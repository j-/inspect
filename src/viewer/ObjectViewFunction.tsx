import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';

export type ObjectViewFunctionProps = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  value: Function;
};

export const ObjectViewFunction = memo<ObjectViewFunctionProps>(({ value }) => (
  <ObjectSymbol>
    {value.name ? `[function ${value.name}()]` : '[() => {}]'}
  </ObjectSymbol>
));

ObjectViewFunction.displayName = 'ObjectViewFunction';
