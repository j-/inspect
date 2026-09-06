import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewString } from './ObjectViewString';
import {
  canRenderUnquotedPropertyKey,
  renderFullPath,
  type PropertyKind,
} from './utils';

type ObjectPropertyProps = {
  name?: string;
  kind?: PropertyKind;
  rootName?: string;
  fullPath: (string | number | symbol)[];
  isFunction?: boolean;
};

export const ObjectProperty: FC<ObjectPropertyProps> = ({
  name,
  kind = 'value',
  rootName = 'result',
  fullPath,
  isFunction,
}) => {
  return (
    <Tooltip title={renderFullPath([rootName, ...fullPath])} followCursor>
      <Box component="span">
        {kind === 'get' ? (
          <Typography
            component="span"
            color="primary"
            fontFamily="monospace"
          >
            {'get '}
          </Typography>
        ) : null}

        {kind === 'set' ? (
          <Typography
            component="span"
            color="primary"
            fontFamily="monospace"
          >
            {'set '}
          </Typography>
        ) : null}

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
