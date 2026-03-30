import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { memo, type FC, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { ObjectViewComplex } from './ObjectViewComplex';
import { useViewerContext } from './providers';
import { getName, orderedKeys } from './utils';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isComplex = (value: unknown, types: Function[]) => (
  types.some((Type) => value instanceof Type)
);

type ObjectViewObjectProps = {
  name?: string;
  value: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  complexTypes?: Function[];
  customViews?: Map<string, FC<{ name?: string; value: Record<string, unknown> }>>;
  keys?: string[];
  comments?: Map<string, (value: unknown) => ReactNode>;

  renderValue: (value: unknown, nextKey: string | symbol) => ReactNode;
};

export const ObjectViewObject = memo<ObjectViewObjectProps>(({
  value: parent,
  name = getName(parent),
  complexTypes = [],
  customViews = new Map(),
  keys = orderedKeys(parent),
  comments = new Map(),

  renderValue,
}) => {
  const { thisPath } = useViewerContext();

  if (keys.length === 0) {
    return (
      <Typography component="span" color="gray.300" fontFamily="monospace">
        {'{}'}
      </Typography>
    );
  }

  return (
    <>
      <ObjectLabel>
        {'length' in parent ? `${name}(${parent.length})` : name}{' '}
      </ObjectLabel>

      <Typography component="span" color="gray.300" fontFamily="monospace">
        {'{'}
      </Typography>

      <Box component="ul" p={0} m={0} ml="2ch">
        {keys.map((key, i, arr) => {
          const CustomView = customViews.get(key);

          return [
            <Box
              key={key}
              component="li"
              sx={{ display: 'inline', listStyle: 'none', whiteSpace: 'nowrap' }}
            >
              <Tooltip title={[...thisPath, key].join('.')} followCursor>
                <Typography
                  component="span"
                  color={typeof parent[key] === 'function' ? 'textDisabled' : 'inherit'}
                  fontFamily="monospace"
                >
                  {key}
                  {': '}
                </Typography>
              </Tooltip>

              {
                // Is a custom view defined?
                customViews.has(key) ? <CustomView name={key} value={parent[key]} /> :
                // Otherwise, is the value too complex to render?
                isComplex(parent[key], complexTypes) ? <ObjectViewComplex value={parent[key]} /> :
                // Otherwise just render it like any other value.
                renderValue(parent[key], key)
              }
            </Box>,

            i < arr.length - 1 ? (
              <Typography
                key={i + ','}
                component="span"
                color="gray.300"
                fontFamily="monospace"
              >
                {','}
              </Typography>
            ) : null,

            (() => {
              const commentFn = comments.get(key);
              if (!commentFn) return null;

              const comment = commentFn(parent[key]);
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

      <Typography component="span" color="gray.300" fontFamily="monospace">
        {'}'}
      </Typography>
    </>
  );
});
