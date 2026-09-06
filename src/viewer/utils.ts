export const isNull = (value: unknown): value is null =>
  value === null;

export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number';

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === 'boolean';

export const isBigInt = (value: unknown): value is bigint =>
  typeof value === 'bigint';

export const isArray = (value: unknown): value is unknown[] =>
  Array.isArray(value);

export const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as any).then === 'function';

export const isError = (value: unknown): value is Error =>
  value instanceof Error;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (value: unknown): value is Function =>
  typeof value === 'function';

export const getName = (value: unknown, defaultName = 'Object') => {
  /* eslint-disable no-empty */
  try { return (value as any).__proto__.constructor.name; } catch {}
  try { return (value as any).constructor.name; } catch {}
  try { return Object.getPrototypeOf(value).name; } catch {}
  try { return (value as any).name; } catch {}
  return defaultName;
  /* eslint-enable no-empty */
};

export const getArrayName = (value: unknown[]) =>
  `${getName(value)}(${value.length})`;

export const getErrorName = (err: unknown) => getName(err, 'Error');

export const isMap = (value: unknown): value is Map<unknown, unknown> =>
  value instanceof Map;

export const isSet = (value: unknown): value is Set<unknown> =>
  value instanceof Set;

export const isSymbol = (value: unknown): value is symbol =>
  typeof value === 'symbol';

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const isComplex = (value: unknown): boolean =>
  getName(value) === 'FiberNode' ||
  [
    CSSStyleSheet,
    Document,
    Element,
    HTMLAllCollection,
    HTMLCollection,
    Node,
    NodeList,
    Window,
  ].some((cls) => value instanceof cls);

export const isNaN = (value: unknown): value is typeof NaN =>
  typeof value === 'number' && globalThis.isNaN(value);

export const isInfinity = (value: unknown): value is typeof Infinity =>
  typeof value === 'number' && (value === Infinity || value === -Infinity);

export const isDate = (value: unknown): value is Date =>
  value instanceof Date;

export const isRegExp = (value: unknown): value is RegExp =>
  value instanceof RegExp;

export const forInKeys = <T>(obj: T): (keyof T)[] => {
  const keys: (keyof T)[] = [];
  for (const key in obj) {
    keys.push(key);
  }
  return keys;
};

export const ownKeys = <T>(obj: T): (keyof T)[] => {
  return Object.getOwnPropertyNames(obj) as (keyof T)[];
};

// Always uninteresting, even if overridden (e.g. every class's own constructor).
const ALWAYS_NOISE_KEYS = ['constructor'];

// Members every plain object inherits from Object.prototype; uninteresting
// unless a more specific prototype has overridden them with its own value.
const OBJECT_PROTOTYPE_NOISE_KEYS = [
  '__proto__',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf',
];

export const ownKeysProto = <T>(obj: T): (keyof T)[] => {
  if (obj instanceof Function) return [];
  try {
    const proto = (obj as any).__proto__;
    const keys = Object.getOwnPropertyNames(proto) as (keyof T)[];
    return keys.filter((key) => (
      !ALWAYS_NOISE_KEYS.includes(key as any) && (
        !OBJECT_PROTOTYPE_NOISE_KEYS.includes(key as any) ||
        proto[key as any] !== (Object.prototype as any)[key]
      )
    ));
  } catch {
    return [];
  }
};

export const allKeys = <T extends object>(obj: T): (keyof T)[] => {
  const maybeKeys = [
    'name',
    'type',
    'message',
    'code',
    'cause',
    'stack',
    'column',
    'columnNumber',
    'line',
    'lineNumber',
    'sourceURL',
    'fileName',
  ] as (keyof T)[];
  const keys = new Set<keyof T>();
  for (const key of forInKeys(obj)) keys.add(key);
  for (const key of ownKeys(obj)) keys.add(key);
  for (const key of ownKeysProto(obj)) keys.add(key);
  for (const key of maybeKeys) if (key in obj) keys.add(key);
  return [...keys.values()];
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

const keyCompare = (
  a: string | number | symbol,
  b: string | number | symbol,
) => collator.compare(String(a), String(b));

export type PropertyKind = 'value' | 'get' | 'set';

export type KeyDescriptor<T extends object = object> = {
  key: keyof T;
  kind: PropertyKind;
};

// Walks the prototype chain to find where a key is actually defined, so accessor
// properties (get/set) can be detected without invoking them.
const findPropertyDescriptor = (obj: unknown, key: PropertyKey): PropertyDescriptor | undefined => {
  for (let current = obj; current != null; current = Object.getPrototypeOf(current)) {
    const descriptor = Object.getOwnPropertyDescriptor(current, key);
    if (descriptor) return descriptor;
  }
  return undefined;
};

// A key backed by a getter and/or setter yields one descriptor per accessor.
export const describeKey = <T extends object>(obj: T, key: keyof T): KeyDescriptor<T>[] => {
  const descriptor = findPropertyDescriptor(obj, key as PropertyKey);
  if (descriptor?.get || descriptor?.set) {
    const descriptors: KeyDescriptor<T>[] = [];
    if (descriptor.get) descriptors.push({ key, kind: 'get' });
    if (descriptor.set) descriptors.push({ key, kind: 'set' });
    return descriptors;
  }
  return [{ key, kind: 'value' }];
};

// Own keys every function carries that are rarely of interest when browsing one as an object.
const EXCLUDED_FUNCTION_KEYS = new Set(['length', 'name', 'prototype', 'arguments', 'caller']);

export const orderedKeys = <T extends object>(obj: T): KeyDescriptor<T>[] => {
  const excludedKeys = obj instanceof Function ? EXCLUDED_FUNCTION_KEYS : null;
  const all = allKeys(obj)
    .filter((key) => !excludedKeys?.has(String(key)))
    .flatMap((key) => describeKey(obj, key));
  // Getters/setters are never classed as functions, since checking would require
  // invoking (and potentially throwing) the accessor.
  const fnKeys = all.filter((d) => d.kind === 'value' && typeof obj[d.key] === 'function');
  // Manually compute the difference
  const fnKeySet = new Set(fnKeys);
  const rest = all.filter((d) => !fnKeySet.has(d));

  const byKey = (a: KeyDescriptor<T>, b: KeyDescriptor<T>) => keyCompare(a.key, b.key);
  const restSorted = [...rest].sort(byKey);
  const fnSorted = [...fnKeys].sort(byKey);

  return [...restSorted, ...fnSorted];
};

// Matches ECMAScript IdentifierName, so keys like "default" are allowed unquoted.
const JS_IDENTIFIER_NAME_RE = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u;

export const canRenderUnquotedPropertyKey = (key: string): boolean => (
  JS_IDENTIFIER_NAME_RE.test(key)
);

export const renderFullPath = ([first, ...rest]: (string | number | symbol)[]) =>
  String(first) + rest.map((part) => {
    // If it's a valid identifier, render as `.identifier`.
    if (typeof part === 'string' && canRenderUnquotedPropertyKey(part)) {
      return `.${part}`;
    }

    // If it's a number or numeric string, render as `[number]`.
    if (!isNaN(Number(part))) {
      return `[${String(part)}]`;
    }

    // Otherwise render as an escaped string.
    return `[${JSON.stringify(part)}]`;
  }).join('');

export const getStorageNS = (storage: Storage, ...namespaces: string[]): Storage => {
  const prefix = `${namespaces.join(':')}:`;

  const toKey = (key: string) => `${prefix}${key}`;
  const fromKey = (key: string) => key.slice(prefix.length);
  const isInNamespace = (key: string) => key.startsWith(prefix);

  const api: Storage = {
    get length() {
      let count = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && isInNamespace(key)) count++;
      }
      return count;
    },

    clear() {
      const keysToRemove: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && isInNamespace(key)) keysToRemove.push(key);
      }
      for (const key of keysToRemove) {
        storage.removeItem(key);
      }
    },

    getItem(key: string) {
      return storage.getItem(toKey(key));
    },

    key(index: number) {
      let seen = 0;
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && isInNamespace(key)) {
          if (seen === index) return fromKey(key);
          seen++;
        }
      }
      return null;
    },

    removeItem(key: string) {
      storage.removeItem(toKey(key));
    },

    setItem(key: string, value: string) {
      storage.setItem(toKey(key), value);
    },
  };

  return api;
};
