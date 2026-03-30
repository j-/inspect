import { memo } from 'react';
import { ObjectViewArray } from './ObjectViewArray';
import { ObjectViewBoolean } from './ObjectViewBoolean';
import { ObjectViewFunction } from './ObjectViewFunction';
import { ObjectViewNull } from './ObjectViewNull';
import { ObjectViewNumber } from './ObjectViewNumber';
import { ObjectViewObject } from './ObjectViewObject';
import { ObjectViewPromise } from './ObjectViewPromise';
import { ObjectViewString } from './ObjectViewString';
import { ObjectViewUndefined } from './ObjectViewUndefined';
import { ObjectViewUnknown } from './ObjectViewUnknown';
import { PartViewerProvider } from './providers';
import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isPromise,
  isString,
  isUndefined,
} from './utils';

export const ObjectView = memo<{ value: unknown }>(({ value }) => {
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
});
