import Typography from '@mui/material/Typography';
import { memo } from 'react';

export const ObjectViewFunction = memo<{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  value: Function;
}>(({ value }) => (
  <Typography component="span" color="grey.600" fontFamily="monospace">
    {'[function '}

    <Typography
      component="span"
      fontFamily="monospace"
    >
      {value.name}
    </Typography>

    {'()]'}
  </Typography>
));
