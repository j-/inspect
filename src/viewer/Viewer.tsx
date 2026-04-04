import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';

export type ViewerProps = {
  object: unknown;
};

export const Viewer: FC<ViewerProps> = ({ object }) => {
  return (
    <RootViewerProvider object={object}>
      <ObjectView />
    </RootViewerProvider>
  );
};
