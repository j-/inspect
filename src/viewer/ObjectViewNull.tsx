import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewNull = memo(() => (
  <Typography component="span" color="gray.500" fontFamily="monospace">
    null
  </Typography>
));

ObjectViewNull.displayName = 'ObjectViewNull';
