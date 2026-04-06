import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewNaN = memo(() => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(300, 40%, 40%)"
  >
    NaN
  </Typography>
));

ObjectViewNaN.displayName = 'ObjectViewNaN';
