import Box from '@mui/material/Box';
import { memo, type ReactNode } from 'react';
import { ObjectCollapseToggleButton } from './ObjectCollapseToggleButton';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';
import { useCanCollapse, useIsCollapsed } from './providers';

export type ObjectViewMapProps = {
  value: Map<any, any>;
  renderValue: (value: unknown, nextKey: string | symbol) => ReactNode;
};

export const ObjectViewMap = memo<ObjectViewMapProps>(({
  value: parent,
  renderValue,
}) => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const canCollapse = useCanCollapse();

  return (
    <>
      <ObjectLabel>
        {'size' in parent ? `Map(${parent.size})` : 'Map'}{' '}
      </ObjectLabel>

      <ObjectSymbol>
        {'(['}
      </ObjectSymbol>

      {canCollapse && (
        <ObjectCollapseToggleButton onClick={() => setIsCollapsed((c) => !c)} />
      )}

      {isCollapsed ? null : (
        <Box component="ul" p={0} m={0} ml="2ch">
          {Array.from(parent.keys()).map((key, i, arr) => {
            return [
              <Box
                key={key}
                component="li"
                sx={{ display: 'inline', listStyle: 'none', whiteSpace: 'nowrap' }}
              >
                {renderValue([key, parent.get(key)], key)}
              </Box>,

              i < arr.length - 1 ? (
                <ObjectSymbol key={i + ','}>
                  {','}
                </ObjectSymbol>
              ) : null,

              i < arr.length - 1 ? (
                <br key="br" />
              ) : null,
            ];
          })}
        </Box>
      )}

      <ObjectSymbol>
        {'])'}
      </ObjectSymbol>
    </>
  );
});

ObjectViewMap.displayName = 'ObjectViewMap';
