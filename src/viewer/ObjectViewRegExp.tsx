import Typography from '@mui/material/Typography';
import { memo } from 'react';

export type ObjectViewRegExpProps = {
  value: RegExp;
};

export const ObjectViewRegExp = memo<ObjectViewRegExpProps>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="hsl(300, 40%, 40%)"
    sx={{ whiteSpace: 'pre-wrap' }}
  >
    /{value.source}/{value.flags}
  </Typography>
));

ObjectViewRegExp.displayName = 'ObjectViewRegExp';
