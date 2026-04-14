import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';
import type { FilterKeysPredicate, IsExpandedFunction } from './types';

export type ViewerProps = {
  id: string;
  object: unknown;
  name?: string;
  defaultIsExpanded?: IsExpandedFunction;
  filterKeys?: FilterKeysPredicate;
  useGetThisObject?: () => unknown;
};

export const Viewer: FC<ViewerProps> = ({
  id,
  object,
  name,
  defaultIsExpanded,
  filterKeys,
  useGetThisObject,
}) => {
  return (
    <RootViewerProvider
      id={id}
      object={object}
      name={name}
      defaultIsExpanded={defaultIsExpanded}
      filterKeys={filterKeys}
      useGetThisObject={useGetThisObject}
    >
      <ObjectView />
    </RootViewerProvider>
  );
};
