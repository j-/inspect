import { useEffect, useState, type FC, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';

export type ObjectViewPromiseProps = {
  value: Promise<unknown>,
  renderValue: (value: unknown) => ReactNode;
};

export const ObjectViewPromise: FC<ObjectViewPromiseProps> = ({
  value,
  renderValue,
}) => {
  const [promiseState, setPromiseState] = useState('pending');
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
    <>
      <ObjectLabel>
        {`Promise(${promiseState}): `}
      </ObjectLabel>

      {promiseValue ? (
        renderValue(promiseValue)
      ) : (
        renderValue(promiseError)
      )}
    </>
  );
};

ObjectViewPromise.displayName = 'ObjectViewPromise';
