import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewObject } from './ObjectViewObject';
import type { RenderValueFunction } from './types';
import { orderedKeys } from './utils';

export type ObjectViewFunctionProps = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  value: Function;
  renderValue: RenderValueFunction;
};

export const ObjectViewFunction = memo<ObjectViewFunctionProps>(({ value, renderValue }) => {
  const symbol = (
    <ObjectSymbol>
      {value.name ? `[function ${value.name}()]` : '[() => {}]'}
    </ObjectSymbol>
  );

  const meaningfulKeys = orderedKeys(value);

  if (meaningfulKeys.length === 0) {
    return symbol;
  }

  return (
    <ObjectViewObject
      value={value}
      renderValue={renderValue}
      keys={meaningfulKeys}
      label={symbol}
    />
  );
});

ObjectViewFunction.displayName = 'ObjectViewFunction';
