import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';
import { ObjectViewBoolean } from './ObjectViewBoolean';
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
  const { thisObject: value } = useViewerContext();
  const isRecursive = useIsRecursive();

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
        renderValue={(promiseValue) => (
          <RootViewerProvider object={promiseValue}>
            <ObjectView />
          </RootViewerProvider>
        )}
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
