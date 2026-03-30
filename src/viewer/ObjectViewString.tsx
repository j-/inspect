import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewString = memo<{ value: string }>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="primary"
  >
    {JSON.stringify(value)}
  </Typography>
));
