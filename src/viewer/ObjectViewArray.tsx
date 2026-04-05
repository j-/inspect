import Box from '@mui/material/Box';
import { type FC } from 'react';
import { ObjectCollapseToggleButton } from './ObjectCollapseToggleButton';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';
import { useIsCollapsed } from './providers';
import type { RenderValueFunction } from './types';
import { getArrayName } from './utils';

export type ObjectViewArrayProps = {
  value: unknown[];
  renderValue: RenderValueFunction;
};

export const ObjectViewArray: FC<ObjectViewArrayProps> = ({ value, renderValue }) => {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();

  if (value.length === 0) {
    return (
      <>
        <ObjectLabel>
          {getArrayName(value)}
        </ObjectLabel>

        {' '}

        <ObjectSymbol>
          {'[]'}
        </ObjectSymbol>
      </>
    );
  }

  return (
    <>
      <ObjectLabel>
        {getArrayName(value)}
      </ObjectLabel>

      {' '}

      <ObjectSymbol>
        {'['}
      </ObjectSymbol>

      <ObjectCollapseToggleButton onClick={() => setIsCollapsed((c) => !c)} />

      {isCollapsed ? null : (
        <Box component="ul" p={0} m={0} ml="2ch">
          {value.map((item, i, arr) => [
            <Box
              key={i}
              component="li"
              display="inline"
              value={i}
              sx={{ listStyle: 'none' }}
            >
              {renderValue(item, i)}
            </Box>,

            i < arr.length - 1 ? (
              <ObjectSymbol key={i + ','}>
                {', '}
              </ObjectSymbol>
            ) : null,
          ])}
        </Box>
      )}

      <ObjectSymbol>
        {']'}
      </ObjectSymbol>
    </>
  );
};

ObjectViewArray.displayName = 'ObjectViewArray';
