import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';
import { ObjectViewBoolean } from './ObjectViewBoolean';
import { ObjectViewComplex } from './ObjectViewComplex';
import { ObjectViewFunction } from './ObjectViewFunction';
import { ObjectViewMap } from './ObjectViewMap';
import { ObjectViewNull } from './ObjectViewNull';
import { ObjectViewNumber } from './ObjectViewNumber';
import { ObjectViewObject } from './ObjectViewObject';
import { ObjectViewPromise } from './ObjectViewPromise';
import { ObjectViewSet } from './ObjectViewSet';
import { ObjectViewString } from './ObjectViewString';
import { ObjectViewUndefined } from './ObjectViewUndefined';
import { ObjectViewUnknown } from './ObjectViewUnknown';
import { PartViewerProvider, RootViewerProvider, useIsRecursive, useViewerContext } from './providers';
import {
  isArray,
  isBoolean,
  isComplex,
  isFunction,
  isMap,
  isNull,
  isNumber,
  isObject,
  isPromise,
  isSet,
  isString,
  isUndefined,
} from './utils';

export const ObjectView: FC = () => {
  const { rootObject, thisObject: value, thisPath } = useViewerContext();
  const isRecursive = useIsRecursive();

  const resolvesToRecursiveValue = (promiseValue: unknown) => {
    if (!isObject(promiseValue)) {
      return false;
    }

    try {
      let checkObject = rootObject;

      for (const key of thisPath) {
        if (checkObject === promiseValue) {
          return true;
        }

        checkObject = (checkObject as any)[key];
      }

      return checkObject === promiseValue;
    } catch {
      return false;
    }
  };

  if (isRecursive) {
    return (
      <ObjectSymbol>
        {'↻'}
      </ObjectSymbol>
    );
  }

  if (isNull(value)) {
    return <ObjectViewNull />;
  }

  if (isUndefined(value)) {
    return <ObjectViewUndefined />;
  }

  if (isBoolean(value)) {
    return <ObjectViewBoolean value={value} />;
  }

  if (isNumber(value)) {
    return <ObjectViewNumber value={value} />;
  }

  if (isString(value)) {
    return <ObjectViewString value={value} />;
  }

  if (isFunction(value)) {
    return <ObjectViewFunction value={value} />;
  }

  if (isPromise(value)) {
    return (
      <ObjectViewPromise
        value={value}
        renderValue={(promiseValue) => {
          if (resolvesToRecursiveValue(promiseValue)) {
            return (
              <ObjectSymbol>
                {'↻'}
              </ObjectSymbol>
            );
          }

          return (
            <RootViewerProvider id={thisPath.join('.')} object={promiseValue}>
              <ObjectView />
            </RootViewerProvider>
          );
        }}
      />
    );
  }

  if (isArray(value)) {
    return (
      <ObjectViewArray
        value={value}
        renderValue={(_, index) => (
          <PartViewerProvider thisKey={index}>
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isMap(value)) {
    return (
      <ObjectViewMap
        value={value}
        renderValue={(_, key) => (
          <PartViewerProvider thisKey={key}>
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isSet(value)) {
    return (
      <ObjectViewSet
        value={value}
        renderValue={(_, key) => (
          <PartViewerProvider thisKey={key}>
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isComplex(value) && thisPath.length > 0) {
    return (
      <ObjectViewComplex value={value} />
    );
  }

  if (isObject(value)) {
    return (
      <ObjectViewObject
        value={value}
        renderValue={(_, thisKey) => (
          <PartViewerProvider thisKey={thisKey}>
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  return <ObjectViewUnknown />;
};

ObjectView.displayName = 'ObjectView';
