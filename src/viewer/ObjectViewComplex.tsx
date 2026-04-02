import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { getName } from './utils';

export type ObjectViewComplexProps = {
  value: unknown;
};

export const ObjectViewComplex = memo<ObjectViewComplexProps>(({ value }) => (
  <ObjectSymbol>
    {'[object '}

    <Typography
      component="span"
      fontFamily="monospace"
      color="secondary"
    >
      {getName(value)}
    </Typography>

    {']'}
  </ObjectSymbol>
));

ObjectViewComplex.displayName = 'ObjectViewComplex';
