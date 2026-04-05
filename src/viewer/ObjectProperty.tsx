import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewString } from './ObjectViewString';
import { canRenderUnquotedPropertyKey } from './utils';

type ObjectPropertyProps = {
  name?: string;
  fullPath: (string | number | symbol)[];
  isFunction?: boolean;
};

export const ObjectProperty: FC<ObjectPropertyProps> = ({
  name,
  fullPath,
  isFunction,
}) => {
  return (
    <Tooltip title={fullPath.join('.')} followCursor>
      <Box component="span">
        {canRenderUnquotedPropertyKey(String(name)) ? (
          <Typography
            component="span"
            color={isFunction ? 'textDisabled' : 'inherit'}
            fontFamily="monospace"
          >
            {String(name)}
          </Typography>
        ) : (
          <ObjectViewString value={String(name)} />
        )}

        <ObjectSymbol>
          {': '}
        </ObjectSymbol>
      </Box>
    </Tooltip>
  );
};

ObjectProperty.displayName = 'ObjectProperty';
