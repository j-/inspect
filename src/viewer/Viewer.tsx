import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';

export type ViewerProps = {
  object: unknown;
  name?: string;
};

export const Viewer: FC<ViewerProps> = ({ object, name }) => {
  return (
    <RootViewerProvider object={object} name={name}>
      <ObjectView />
    </RootViewerProvider>
  );
};
