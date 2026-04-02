import { memo, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';

export type ObjectViewSetProps = {
  value: Set<any>;
  renderValue: (value: unknown, nextKey: string | symbol) => ReactNode;
};

export const ObjectViewSet = memo<ObjectViewSetProps>(({
  value: parent,
  renderValue,
}) => {
  return (
    <>
      <ObjectLabel>
        {'size' in parent ? `Set(${parent.size})` : 'Set'}{' '}
      </ObjectLabel>

      <ObjectSymbol>
        {'( '}
      </ObjectSymbol>

      <ObjectViewArray value={Array.from(parent.values())} renderValue={(value, i) => (
        renderValue(value, `${i}`)
      )} />

      <ObjectSymbol>
        {')'}
      </ObjectSymbol>
    </>
  );
});
