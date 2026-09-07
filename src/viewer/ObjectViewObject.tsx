import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { type FC, type ReactNode } from 'react';
import { ObjectCollapseToggleButton } from './ObjectCollapseToggleButton';
import { ObjectLabel } from './ObjectLabel';
import { ObjectProperty } from './ObjectProperty';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewComplex } from './ObjectViewComplex';
import { useCanCollapse, useIsCollapsed, useViewerContext } from './providers';
import type { RenderValueFunction } from './types';
import {
  getName,
  isFunction,
  isPrimaryKey,
  type KeyDescriptor,
  orderedKeys,
  renderFullPath,
} from './utils';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isComplex = (value: unknown, types: Function[]) => (
  types.some((Type) => value instanceof Type)
);

type ObjectViewObjectProps = {
  name?: string;
  label?: ReactNode;
  value: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  complexTypes?: Function[];
  customViews?: Map<string, FC<{ name?: string; value: Record<string, unknown> }>>;
  keys?: KeyDescriptor<any>[];
  comments?: Map<string, (value: unknown) => ReactNode>;

  renderValue: RenderValueFunction;
};

export const ObjectViewObject: FC<ObjectViewObjectProps> = ({
  value: parent,
  label,
  name = getName(parent),
  complexTypes = [],
  customViews = new Map(),
  keys = orderedKeys(parent),
  comments = new Map(),

  renderValue,
}) => {
  const { rootName, thisPath, filterKeys, getComment } = useViewerContext();
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const canCollapse = useCanCollapse();

  if (keys.length === 0) {
    return (
      <ObjectSymbol>
        {'{}'}
      </ObjectSymbol>
    );
  }

  return (
    <>
      {label != null ? <>{label}{' '}</> : (
        <ObjectLabel>
          {'length' in parent ? `${name}(${parent.length})` : name}{' '}
        </ObjectLabel>
      )}

      <ObjectSymbol>
        {'{'}
      </ObjectSymbol>

      {canCollapse && (
        <ObjectCollapseToggleButton onClick={() => setIsCollapsed((c) => !c)} />
      )}

      {isCollapsed ? null : (
        <Box component="ul" p={0} m={0} ml="2ch">
          {keys.map((descriptor, i, arr) => {
            const { key, kind } = descriptor;
            const keyName = String(key);
            const CustomView = customViews.get(keyName);
            // Getter/setter descriptors are never treated as functions, since
            // classifying them as such would require invoking the accessor.
            const isAccessor = kind !== 'value';

            if (filterKeys && !filterKeys(parent, thisPath, key)) {
              return null;
            }


            return [
              <Box
                key={`${keyName}:${kind}`}
                component="li"
                sx={{
                  display: 'inline',
                  listStyle: 'none',
                  whiteSpace: 'nowrap',
                  // Secondary (inherited, non-enumerable) properties are dimmed,
                  // matching how browser devtools consoles distinguish them from
                  // own/enumerable ones.
                  opacity: isPrimaryKey(descriptor) ? 1 : 0.6,
                }}
              >
                <a id={renderFullPath([rootName, ...thisPath.map(({ key }) => key), key])} />

                <ObjectProperty
                  name={keyName}
                  kind={kind}
                  rootName={rootName}
                  fullPath={[...thisPath.map(({ key }) => key), key]}
                  isFunction={!isAccessor && isFunction(parent[key])}
                />

                {
                  // Setters have no meaningful value to read, so show a
                  // function stand-in named after the property instead.
                  kind === 'set' ? <ObjectSymbol>{`[function ${keyName}()]`}</ObjectSymbol> :
                  // Is a custom view defined?
                  customViews.has(keyName) ? <CustomView name={keyName} value={parent[key]} /> :
                  // Otherwise, is the value too complex to render?
                  isComplex(parent[key], complexTypes) ? <ObjectViewComplex value={parent[key]} /> :
                  // Otherwise just render it like any other value.
                  renderValue(parent[key], key)
                }
              </Box>,

              i < arr.length - 1 ? (
                <ObjectSymbol key={i + ','}>
                  {','}
                </ObjectSymbol>
              ) : null,

              (() => {
                const commentFn = comments.get(keyName);
                const comment = commentFn
                  ? commentFn(parent[key])
                  : getComment?.(thisPath.map(({ key }) => key), key, parent[key]) ?? null;
                if (!comment) return null;

                return (
                  <Typography
                    key={i + '//'}
                    component="span"
                    color="hsl(150, 40%, 40%)"
                    fontFamily="monospace"
                  >
                    {' // '}{comment}
                  </Typography>
                );
              })(),

              i < arr.length - 1 ? (
                <br key="br" />
              ) : null,
            ];
          })}
        </Box>
      )}

      <ObjectSymbol>
        {'}'}
      </ObjectSymbol>
    </>
  );
};

ObjectViewObject.displayName = 'ObjectViewObject';
