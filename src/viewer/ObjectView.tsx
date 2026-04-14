import { type FC } from 'react';
import { ObjectSymbol } from './ObjectSymbol';
import { ObjectViewArray } from './ObjectViewArray';
import { ObjectViewBoolean } from './ObjectViewBoolean';
import { ObjectViewComplex } from './ObjectViewComplex';
import { ObjectViewDate } from './ObjectViewDate';
import { ObjectViewFunction } from './ObjectViewFunction';
import { ObjectViewInfinity } from './ObjectViewInfinity';
import { ObjectViewMap } from './ObjectViewMap';
import { ObjectViewNaN } from './ObjectViewNaN';
import { ObjectViewNull } from './ObjectViewNull';
import { ObjectViewNumber } from './ObjectViewNumber';
import { ObjectViewObject } from './ObjectViewObject';
import { ObjectViewPromise } from './ObjectViewPromise';
import { ObjectViewRegExp } from './ObjectViewRegExp';
import { ObjectViewSet } from './ObjectViewSet';
import { ObjectViewString } from './ObjectViewString';
import { ObjectViewSymbol } from './ObjectViewSymbol';
import { ObjectViewUndefined } from './ObjectViewUndefined';
import { ObjectViewUnknown } from './ObjectViewUnknown';
import {
  PartViewerProvider,
  RootViewerProvider,
  useIsRecursive,
  useViewerContext,
} from './providers';
import {
  isArray,
  isBoolean,
  isComplex,
  isDate,
  isFunction,
  isInfinity,
  isMap,
  isNaN,
  isNull,
  isNumber,
  isObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
} from './utils';

export const ObjectView: FC = () => {
  const { rootObject, thisPath, useGetThisObject } = useViewerContext();
  const value = useGetThisObject();
  const isRecursive = useIsRecursive();

  const resolvesToRecursiveValue = (promiseValue: unknown) => {
    if (!isObject(promiseValue)) {
      return false;
    }

    try {
      let checkObject = rootObject;

      for (const step of thisPath) {
        if (checkObject === promiseValue) {
          return true;
        }

        checkObject = step.selector(checkObject);
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

  if (isNaN(value)) {
    return <ObjectViewNaN />;
  }

  if (isInfinity(value)) {
    return <ObjectViewInfinity />;
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

  if (isDate(value)) {
    return <ObjectViewDate value={value} />;
  }

  if (isRegExp(value)) {
    return <ObjectViewRegExp value={value} />;
  }

  if (isPromise(value)) {
    return (
      <ObjectViewPromise
        value={value}
        renderValue={(promiseValue, state) => {
          if (resolvesToRecursiveValue(promiseValue)) {
            return (
              <ObjectSymbol>
                {'↻'}
              </ObjectSymbol>
            );
          }

          return (
            <RootViewerProvider
              id={thisPath.map(({ key }) => String(key)).join('.')}
              object={promiseValue}
              name={state === 'rejected' ? 'error' : 'result'}
              useGetThisObject={useGetThisObject}
            >
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
          <PartViewerProvider
            thisType="array"
            thisKey={index}
            selector={(prevObject) => (
              (prevObject as unknown[])[index as number]
            )}
          >
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
        renderValue={(entry, index) => {
          const [mapKey] = entry as [unknown, unknown];

          return (
            <PartViewerProvider
              thisType="map"
              thisKey={index}
              selector={(prevObject) => {
                const map = prevObject as Map<unknown, unknown>;
                return [mapKey, map.get(mapKey)];
              }}
            >
              <ObjectView />
            </PartViewerProvider>
          );
        }}
      />
    );
  }

  if (isSet(value)) {
    return (
      <ObjectViewSet
        value={value}
        renderValue={(_, key) => (
          <PartViewerProvider
            thisType="set"
            thisKey={key}
            selector={(prevObject) => (
              Array.from((prevObject as Set<unknown>).values())[key as number]
            )}
          >
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  if (isSymbol(value)) {
    return (
      <ObjectViewSymbol value={value} />
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
          <PartViewerProvider
            thisType="object"
            thisKey={thisKey}
            selector={(prevObject) => (
              prevObject as Record<string | number | symbol, unknown>
            )[thisKey as keyof typeof prevObject]}
          >
            <ObjectView />
          </PartViewerProvider>
        )}
      />
    );
  }

  return <ObjectViewUnknown />;
};

ObjectView.displayName = 'ObjectView';
