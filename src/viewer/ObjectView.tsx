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
import { PartViewerProvider, useIsRecursive } from './providers';
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

export type ObjectViewProps = {
  value: unknown;
};

export const ObjectView: FC<ObjectViewProps> = ({ value }) => {
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
          <ObjectView value={promiseValue} />
        )}
      />
    );
  }

  if (isArray(value)) {
    return (
      <ObjectViewArray
        value={value}
        renderValue={(childValue, index) => (
          <PartViewerProvider thisKey={index}>
            <ObjectView value={childValue} />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isMap(value)) {
    return (
      <ObjectViewMap
        value={value}
        renderValue={(childValue, key) => (
          <PartViewerProvider thisKey={key}>
            <ObjectView value={childValue} />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isSet(value)) {
    return (
      <ObjectViewSet
        value={value}
        renderValue={(childValue, key) => (
          <PartViewerProvider thisKey={key}>
            <ObjectView value={childValue} />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isObject(value)) {
    return (
      <ObjectViewObject
        value={value}
        renderValue={(childValue, thisKey) => (
          <PartViewerProvider thisKey={thisKey}>
            <ObjectView value={childValue} />
          </PartViewerProvider>
        )}
      />
    );
  }

  return <ObjectViewUnknown />;
};

ObjectView.displayName = 'ObjectView';
