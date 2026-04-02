import Box from '@mui/material/Box';
import { memo, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';

export type ObjectViewMapProps = {
  value: Map<any, any>;
  renderValue: (value: unknown, nextKey: string | symbol) => ReactNode;
};

export const ObjectViewMap = memo<ObjectViewMapProps>(({
  value: parent,
  renderValue,
}) => {
  return (
    <>
      <ObjectLabel>
        {'size' in parent ? `Map(${parent.size})` : 'Map'}{' '}
      </ObjectLabel>

      <ObjectSymbol>
        {'(['}
      </ObjectSymbol>

      <Box component="ul" p={0} m={0} ml="2ch">
        {Array.from(parent.keys()).map((key, i, arr) => {
          return [
            <Box
              key={key}
              component="li"
              sx={{ display: 'inline', listStyle: 'none', whiteSpace: 'nowrap' }}
            >
              <ObjectViewArray value={[key, parent.get(key)]} renderValue={(value, index) => (
                renderValue(value, index === 0 ? `${key} (key)` : `${key} (value)`)
              )} />
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

      <ObjectSymbol>
        {'])'}
      </ObjectSymbol>
    </>
  );
});
