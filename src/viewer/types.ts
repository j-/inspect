import type { ReactNode } from 'react';

export type RenderValueFunction = (
  value: unknown,
  key: string | symbol | number,
) => ReactNode;

export type IsExpandedFunction = (
  thisObject: unknown,
  thisPath: (string | number | symbol)[],
) => boolean;
