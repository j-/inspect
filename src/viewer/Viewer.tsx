import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';
import type { IsExpandedFunction } from './types';

export type ViewerProps = {
  id: string;
  object: unknown;
  name?: string;
  defaultIsExpanded?: IsExpandedFunction;
};

export const Viewer: FC<ViewerProps> = ({
  id,
  object,
  name,
  defaultIsExpanded,
}) => {
  return (
    <RootViewerProvider
      id={id}
      object={object}
      name={name}
      defaultIsExpanded={defaultIsExpanded}
    >
      <ObjectView />
    </RootViewerProvider>
  );
};
