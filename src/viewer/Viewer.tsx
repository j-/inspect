import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';

export type ViewerProps = {
  id: string;
  object: unknown;
  name?: string;
};

export const Viewer: FC<ViewerProps> = ({ id, object, name }) => {
  return (
    <RootViewerProvider id={id} object={object} name={name}>
      <ObjectView />
    </RootViewerProvider>
  );
};
