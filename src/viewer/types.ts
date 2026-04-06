import type { ReactNode } from 'react';

export type KeyType = string | number | symbol;

export type ViewerPathStepType = 'object' | 'array' | 'set' | 'map';

export type ViewerPathStep = {
  type: ViewerPathStepType;
  key: KeyType;
  selector: (prevObject: unknown) => unknown;
};

export type RenderValueFunction = <T, U extends KeyType>(
  value: T,
  key: U,
) => ReactNode;

export type IsExpandedFunction = (
  thisObject: unknown,
  thisPath: ViewerPathStep[],
) => boolean;
