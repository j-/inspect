import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';
import useStorageState from 'use-storage-state';
import type { IsExpandedFunction, ViewerPathStep } from './types';
import { getStorageNS } from './utils';

export type ViewerContextType<T, U = T> = {
  id: string;
  rootObject: T;
  rootName: string;
  thisPath: ViewerPathStep[];
  defaultIsExpanded?: IsExpandedFunction;
} & (
  | { root: true; thisObject: T; thisKey: undefined; }
  | { root: boolean; thisObject: U; thisKey: string | number | symbol; }
);

export const ViewerContext = createContext<ViewerContextType<unknown> | null>(
  null,
);

export const useViewerContext = () => {
  const context = useContext(ViewerContext);

  if (!context) {
    throw new Error('useViewerContext must be used within a Viewer');
  }

  return context;
};

export const useIsRecursive = () => {
  const { thisObject, rootObject, thisPath } = useViewerContext();

  const result = (() => {
    try {
      let checkObject = rootObject;

      for (const step of thisPath) {
        if (checkObject === thisObject) return true;
        checkObject = step.selector(checkObject);
      }

      return false;
    } catch {
      return null;
    }
  })();

  return result;
};

export const useCanCollapse = () => {
  const { root } = useViewerContext();
  return !root;
};

export const useIsCollapsed = () => {
  const { id, thisPath, thisObject, defaultIsExpanded } = useViewerContext();

  const storage = useMemo(() => {
    return getStorageNS(
      window.sessionStorage,
      window.location.origin,
      id,
      ...thisPath.map(({ key }) => String(key)),
    );
  }, [id, thisPath]);

  return useStorageState<boolean | null>('collapsed', {
    storage,
    defaultValue:
      defaultIsExpanded ? !defaultIsExpanded(thisObject, thisPath) : null,
  });
};

export type RootViewerProviderProps<T> = PropsWithChildren<{
  id: string;
  object: T;
  name?: string;
  defaultIsExpanded?: IsExpandedFunction;
}>;

export const RootViewerProvider = <T,>({
  id,
  children,
  object: rootObject,
  name = 'result',
  defaultIsExpanded,
}: RootViewerProviderProps<T>) => {
  return (
    <ViewerContext.Provider value={{
      id,
      root: true,
      rootObject: rootObject,
      rootName: name,
      thisObject: rootObject,
      thisKey: undefined,
      thisPath: [],
      defaultIsExpanded,
    }}>
      {children}
    </ViewerContext.Provider>
  );
};

export type PartViewerProviderProps = PropsWithChildren<{
  thisType: ViewerPathStep['type'];
  thisKey: string | number | symbol;
  selector: (prevObject: unknown) => unknown;
}>;

export const PartViewerProvider: FC<PartViewerProviderProps> = ({
  children,
  thisType,
  thisKey,
  selector,
}) => {
  const context = useViewerContext();

  return (
    <ViewerContext.Provider value={{
      ...context,
      root: false,
      thisObject: selector(context.thisObject),
      thisKey,
      thisPath: [
        ...context.thisPath,
        { type: thisType, key: thisKey, selector },
      ],
    }}>
      {children}
    </ViewerContext.Provider>
  );
};
