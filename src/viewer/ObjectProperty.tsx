import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewString } from './ObjectViewString';
import { canRenderUnquotedPropertyKey, renderFullPath } from './utils';

type ObjectPropertyProps = {
  name?: string;
  rootName?: string;
  fullPath: (string | number | symbol)[];
  isFunction?: boolean;
};

export const ObjectProperty: FC<ObjectPropertyProps> = ({
  name,
  rootName = 'result',
  fullPath,
  isFunction,
}) => {
  return (
    <Tooltip title={renderFullPath([rootName, ...fullPath])} followCursor>
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
