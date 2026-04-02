import Typography from '@mui/material/Typography';
import { memo } from 'react';

export type ObjectViewStringProps = {
  value: string;
};

export const ObjectViewString = memo<ObjectViewStringProps>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="primary"
    sx={{ whiteSpace: 'pre-wrap' }}
  >
    {JSON.stringify(value)}
  </Typography>
));

ObjectViewString.displayName = 'ObjectViewString';
