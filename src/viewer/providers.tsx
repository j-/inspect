import { createContext, useContext, type FC, type PropsWithChildren } from 'react';

export type ViewerContextType<T, U = T> = {
  root: true;
  rootObject: T;
  thisObject: T;
  thisKey: undefined;
  thisPath: (string | number | symbol)[];
} | {
  root: false;
  rootObject: T;
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

export type RootViewerProviderProps<T> = PropsWithChildren<{
  object: T;
}>;

export const RootViewerProvider = <T,>({
  children,
  object: rootObject,
}: RootViewerProviderProps<T>) => {
  return (
    <ViewerContext.Provider value={{
      root: true,
      rootObject: rootObject,
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
