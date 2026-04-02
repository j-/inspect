import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewBoolean = memo<{ value: boolean }>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(300, 40%, 40%)"
  >
    {JSON.stringify(value)}
  </Typography>
));

ObjectViewBoolean.displayName = 'ObjectViewBoolean';
