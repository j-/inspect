import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';

export const ObjectViewFunction = memo<{
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  value: Function;
}>(({ value }) => (
  <ObjectSymbol>
    {'[function '}

    <Typography
      component="span"
      fontFamily="monospace"
    >
      {value.name}
    </Typography>

    {'()]'}
  </ObjectSymbol>
));
