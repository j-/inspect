import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { getName } from './utils';

export const ObjectViewComplex = memo<{ value: unknown }>(({ value }) => (
  <ObjectSymbol>
    {'[object '}

    <Typography
      component="span"
      fontFamily="monospace"
      color="secondary"
    >
      {getName(value)}
    </Typography>

    {']'}
  </ObjectSymbol>
));
