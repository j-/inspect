import { useEffect, useState, type FC, type PropsWithChildren, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { ObjectSymbol } from './ObjectSymbol';

type PromiseStatus = 'pending' | 'fulfilled' | 'rejected';

export const ObjectViewPromiseStatus: FC<PropsWithChildren<{ status: PromiseStatus }>> = ({ status, children }) => (
  <>
    <ObjectLabel>
      {`Promise(${status}): `}
    </ObjectLabel>
    {status === 'pending' ? <ObjectSymbol>&hellip;</ObjectSymbol> : children}
  </>
);

export type ObjectViewPromiseProps = {
  value: Promise<unknown>,
  renderValue: (value: unknown, state: 'fulfilled' | 'rejected') => ReactNode;
};

export const ObjectViewPromise: FC<ObjectViewPromiseProps> = ({
  value,
  renderValue,
}) => {
  const [promiseState, setPromiseState] = useState<PromiseStatus>('pending');
  const [promiseValue, setPromiseValue] = useState<unknown>();
  const [promiseError, setPromiseError] = useState<unknown>();

  useEffect(() => {
    // setPromiseState('pending');
    // setPromiseValue(undefined);
    // setPromiseError(undefined);
    Promise.resolve(value)
      .then((value) => {
        setPromiseState('fulfilled');
        setPromiseValue(value);
      })
      .catch((error) => {
        setPromiseState('rejected');
        setPromiseError(error);
      });
  }, [value]);

  return (
    <ObjectViewPromiseStatus status={promiseState}>
      {promiseState === 'pending' ? null : renderValue(
        promiseState === 'fulfilled' ? promiseValue : promiseError,
        promiseState,
      )}
    </ObjectViewPromiseStatus>
  );
};

ObjectViewPromise.displayName = 'ObjectViewPromise';
