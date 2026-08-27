import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewBigInt = memo<{ value: bigint }>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(150, 40%, 40%)"
  >
    {String(value)}n
  </Typography>
));

ObjectViewBigInt.displayName = 'ObjectViewBigInt';
