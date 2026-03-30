import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { getName } from './utils';

export const ObjectViewComplex = memo<{ value: unknown }>(({ value }) => (
  <Typography component="span" color="black" fontFamily="monospace">
    {'[object '}

    <Typography
      component="span"
      fontFamily="monospace"
      color="secondary"
    >
      {getName(value)}
    </Typography>

    {']'}
  </Typography>
));
