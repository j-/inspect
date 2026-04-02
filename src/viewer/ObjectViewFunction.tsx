import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';

export type ObjectViewFunctionProps = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  value: Function;
};

export const ObjectViewFunction = memo<ObjectViewFunctionProps>(({ value }) => (
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

ObjectViewFunction.displayName = 'ObjectViewFunction';
