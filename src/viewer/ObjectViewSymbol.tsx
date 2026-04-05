import Typography from '@mui/material/Typography';
import { memo } from 'react';

export type ObjectViewSymbolProps = {
  value: symbol;
};

export const ObjectViewSymbol = memo<ObjectViewSymbolProps>(({ value }) => (
  <Typography component="span" color="gray.500" fontFamily="monospace">
    {String(value)}
  </Typography>
));

ObjectViewSymbol.displayName = 'ObjectViewSymbol';
