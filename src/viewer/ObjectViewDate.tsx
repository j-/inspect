import { memo } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewNaN } from './ObjectViewNaN';
import { ObjectViewString } from './ObjectViewString';

export type ObjectViewDateProps = {
  value: Date;
};

export const ObjectViewDate = memo<ObjectViewDateProps>(({ value }) => (
  <ObjectSymbol>
    new Date({
      isNaN(value.valueOf()) ?
        <ObjectViewNaN /> :
        <ObjectViewString value={value.toISOString()} />
    })
  </ObjectSymbol>
));

ObjectViewDate.displayName = 'ObjectViewDate';
