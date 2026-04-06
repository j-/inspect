import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewInfinity = memo(() => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(300, 40%, 40%)"
  >
    Infinity
  </Typography>
));

ObjectViewInfinity.displayName = 'ObjectViewInfinity';
