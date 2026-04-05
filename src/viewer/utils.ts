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

export const isObject = (value: unknown): value is object =>
  typeof value === 'object' && value !== null;

export const isComplex = (value: unknown): boolean =>
  (value as any).__proto__.constructor.name === 'FiberNode' ||
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

export const orderedKeys = <T extends object>(obj: T): (keyof T)[] => {
  const all = allKeys(obj);
  const fnKeys = all.filter((key) => typeof obj[key] === 'function');
  // Manually compute the difference
  const fnKeySet = new Set(fnKeys);
  const rest = all.filter((key) => !fnKeySet.has(key));

  const restSorted = [...rest].sort(keyCompare);
  const fnSorted = [...fnKeys].sort(keyCompare);

  return [...restSorted, ...fnSorted];
};

// Matches ECMAScript IdentifierName, so keys like "default" are allowed unquoted.
const JS_IDENTIFIER_NAME_RE = /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u;

export const canRenderUnquotedPropertyKey = (key: string): boolean => (
  JS_IDENTIFIER_NAME_RE.test(key)
);
