import { memo } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';
import type { RenderValueFunction } from './types';

export type ObjectViewSetProps = {
  value: Set<any>;
  renderValue: RenderValueFunction;
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
        {'('}
      </ObjectSymbol>

      <ObjectViewArray value={Array.from(parent.values())} renderValue={(value, i) => (
        renderValue(value, i)
      )} />

      <ObjectSymbol>
        {')'}
      </ObjectSymbol>
    </>
  );
});

ObjectViewSet.displayName = 'ObjectViewSet';
