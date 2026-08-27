import type { FC } from 'react';
import { ObjectView } from './ObjectView';
import { RootViewerProvider } from './providers';
import type { FilterKeysPredicate, IsExpandedFunction, PathCommentFunction } from './types';

export type ViewerProps = {
  id: string;
  object: unknown;
  name?: string;
  defaultIsExpanded?: IsExpandedFunction;
  filterKeys?: FilterKeysPredicate;
  getComment?: PathCommentFunction;
  useGetThisObject?: () => unknown;
};

export const Viewer: FC<ViewerProps> = ({
  id,
  object,
  name,
  defaultIsExpanded,
  filterKeys,
  getComment,
  useGetThisObject,
}) => {
  return (
    <RootViewerProvider
      id={id}
      object={object}
      name={name}
      defaultIsExpanded={defaultIsExpanded}
      filterKeys={filterKeys}
      getComment={getComment}
      useGetThisObject={useGetThisObject}
    >
      <ObjectView />
    </RootViewerProvider>
  );
};
