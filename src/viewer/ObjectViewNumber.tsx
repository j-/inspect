import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewNumber = memo<{ value: number }>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(150, 40%, 40%)"
  >
    {JSON.stringify(value)}
  </Typography>
));

ObjectViewNumber.displayName = 'ObjectViewNumber';
