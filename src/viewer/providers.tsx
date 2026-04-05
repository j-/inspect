import {
  createContext,
  useContext,
  useMemo,
  type FC,
  type PropsWithChildren,
} from 'react';
import useStorageState from 'use-storage-state';
import { getStorageNS } from './utils';

export type ViewerContextType<T, U = T> = {
  root: true;
  rootObject: T;
  rootName: string;
  thisObject: T;
  thisKey: undefined;
  thisPath: (string | number | symbol)[];
} | {
  root: false;
  rootObject: T;
  rootName: string;
  thisObject: U;
  thisKey: string | number | symbol;
  thisPath: (string | number | symbol)[];
};

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

      for (const key of thisPath) {
        if (checkObject === thisObject) return true;
        checkObject = (checkObject as any)[key];
      }

      return false;
    } catch {
      return null;
    }
  })();

  return result;
};

export const useIsCollapsed = () => {
  const { thisPath } = useViewerContext();

  const storage = useMemo(() => {
    return getStorageNS(
      window.localStorage,
      window.location.origin,
      window.location.pathname,
      ...thisPath.map(String),
    );
  }, [thisPath]);

  return useStorageState<boolean | null>('collapsed', {
    storage,
    defaultValue: null,
  });
};

export type RootViewerProviderProps<T> = PropsWithChildren<{
  object: T;
  name?: string;
}>;

export const RootViewerProvider = <T,>({
  children,
  object: rootObject,
  name = 'result',
}: RootViewerProviderProps<T>) => {
  return (
    <ViewerContext.Provider value={{
      root: true,
      rootObject: rootObject,
      rootName: name,
      thisObject: rootObject,
      thisKey: undefined,
      thisPath: [],
    }}>
      {children}
    </ViewerContext.Provider>
  );
};

export type PartViewerProviderProps = PropsWithChildren<{
  thisKey: string | number | symbol;
}>;

export const PartViewerProvider: FC<PartViewerProviderProps> = ({
  children,
  thisKey,
}) => {
  const context = useViewerContext();

  return (
    <ViewerContext.Provider value={{
      ...context,
      root: false,
      thisObject: (context.thisObject as any)[thisKey],
      thisKey,
      thisPath: [...context.thisPath, thisKey],
    }}>
      {children}
    </ViewerContext.Provider>
  );
};
