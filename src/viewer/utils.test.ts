import { describe, expect, it } from 'vitest';

import {
  allKeys,
  describeKey,
  forInKeys,
  isPrimaryKey,
  orderedKeys,
  ownKeys,
  ownKeysProto,
} from './utils';

// Most keys resolve to a single own, enumerable 'value' descriptor; this
// shorthand keeps the orderedKeys assertions below readable.
const values = (...keys: (string | number)[]) => keys.map((key) => (
  { key: String(key), kind: 'value', own: true, enumerable: true }
));

describe('forInKeys', () => {
  it('returns an empty array for an empty object', () => {
    expect(forInKeys({})).toEqual([]);
  });

  it('returns own enumerable keys in for-in order', () => {
    const obj = { b: 1, a: 2, c: 3 };
    expect(forInKeys(obj)).toEqual(['b', 'a', 'c']);
  });

  it('excludes non-enumerable own properties', () => {
    const obj: Record<string, number> = {};
    Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false });
    obj.visible = 2;
    expect(forInKeys(obj)).toEqual(['visible']);
  });

  it('includes enumerable properties inherited from the prototype chain', () => {
    const proto = { inherited: 1 };
    const obj = Object.assign(Object.create(proto), { own: 2 });
    expect(forInKeys(obj)).toEqual(['own', 'inherited']);
  });

  it('returns array indices as strings, excluding length', () => {
    expect(forInKeys(['x', 'y'])).toEqual(['0', '1']);
  });
});

describe('ownKeys', () => {
  it('returns an empty array for an empty object', () => {
    expect(ownKeys({})).toEqual([]);
  });

  it('includes non-enumerable own properties', () => {
    const obj: Record<string, number> = {};
    Object.defineProperty(obj, 'hidden', { value: 1, enumerable: false });
    obj.visible = 2;
    expect(ownKeys(obj)).toEqual(['hidden', 'visible']);
  });

  it('excludes properties inherited from the prototype chain', () => {
    const proto = { inherited: 1 };
    const obj = Object.assign(Object.create(proto), { own: 2 });
    expect(ownKeys(obj)).toEqual(['own']);
  });

  it('returns array indices and length', () => {
    expect(ownKeys(['x', 'y'])).toEqual(['0', '1', 'length']);
  });

  it('excludes symbol keys', () => {
    const sym = Symbol('s');
    const obj = { a: 1, [sym]: 2 };
    expect(ownKeys(obj)).toEqual(['a']);
  });
});

describe('ownKeysProto', () => {
  it('returns [] for functions', () => {
    expect(ownKeysProto(() => {})).toEqual([]);
    expect(ownKeysProto(function named() {})).toEqual([]);
  });

  it('returns [] for objects with a null prototype', () => {
    expect(ownKeysProto(Object.create(null))).toEqual([]);
  });

  it('returns [] for a plain object, since every Object.prototype member is unmodified noise', () => {
    expect(ownKeysProto({})).toEqual([]);
  });

  it('keeps Object.prototype members that a more specific prototype overrides', () => {
    // Array.prototype defines its own toString/toLocaleString, distinct from
    // Object.prototype's, so they're kept rather than hidden.
    const result = ownKeysProto([]);
    expect(result).toEqual(expect.arrayContaining(['toString', 'toLocaleString']));
  });

  it('always omits constructor, even when overridden', () => {
    expect(ownKeysProto([])).not.toContain('constructor');
  });

  it('keeps a custom class override of an Object.prototype member', () => {
    class Foo {
      toString() { return 'foo'; }
    }
    expect(ownKeysProto(new Foo())).toContain('toString');
  });

  it('returns the own method names of a class prototype for a class instance', () => {
    class Foo {
      bar() { return 1; }
      baz() { return 2; }
    }
    expect(ownKeysProto(new Foo())).toEqual(['bar', 'baz']);
  });

  it('only returns the immediate prototype, not the whole chain', () => {
    class Grandparent { grandparentMethod() {} }
    class Parent extends Grandparent { parentMethod() {} }
    const instance = new Parent();
    expect(ownKeysProto(instance)).toEqual(['parentMethod']);
  });
});

describe('allKeys', () => {
  it('returns an empty array for an empty plain-prototype-less object', () => {
    expect(allKeys(Object.create(null))).toEqual([]);
  });

  it('merges for-in, own, and prototype keys with no duplicates', () => {
    class Foo { method() {} }
    const obj = Object.assign(new Foo(), { a: 1 });
    const keys = allKeys(obj) as string[];
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain('a');
    expect(keys).toContain('method');
  });

  it('places for-in keys before own keys before prototype keys', () => {
    // protoMethod must be non-enumerable (like a class method) so it is only
    // discoverable via ownKeysProto, not for-in.
    class ProtoHolder { protoMethod() {} }
    const obj = new ProtoHolder() as ProtoHolder & Record<string, unknown>;
    obj.ownOnly = 2;
    Object.defineProperty(obj, 'hiddenOwn', { value: 3, enumerable: false });
    const keys = allKeys(obj) as string[];
    expect(keys.indexOf('ownOnly')).toBeLessThan(keys.indexOf('hiddenOwn'));
    expect(keys.indexOf('hiddenOwn')).toBeLessThan(keys.indexOf('protoMethod'));
  });

  it('includes maybeKeys that are present (even if inherited) on the object', () => {
    const err = new Error('boom');
    const keys = allKeys(err) as string[];
    expect(keys).toEqual(expect.arrayContaining(['message', 'stack', 'name']));
  });

  it('excludes maybeKeys that are absent from the object', () => {
    const keys = allKeys({}) as string[];
    expect(keys).not.toContain('message');
    expect(keys).not.toContain('stack');
    expect(keys).not.toContain('cause');
  });
});

describe('orderedKeys', () => {
  it('returns an empty array for an empty null-prototype object', () => {
    expect(orderedKeys(Object.create(null))).toEqual([]);
  });

  it('sorts non-function keys case-insensitively', () => {
    const obj = Object.assign(Object.create(null), { banana: 1, Apple: 2, cherry: 3 });
    expect(orderedKeys(obj)).toEqual(values('Apple', 'banana', 'cherry'));
  });

  it('sorts numeric string keys numerically rather than lexicographically', () => {
    const obj = Object.assign(Object.create(null), { 10: 'a', 2: 'b', 1: 'c' });
    expect(orderedKeys(obj)).toEqual(values('1', '2', '10'));
  });

  it('places function-valued keys after non-function keys', () => {
    const obj = Object.assign(Object.create(null), { b: () => {}, a: 1 });
    expect(orderedKeys(obj)).toEqual(values('a', 'b'));
  });

  it('sorts function keys separately from, and after, data keys', () => {
    const obj = Object.assign(Object.create(null), {
      zeta: () => {},
      alpha: () => {},
      b: 1,
      a: 2,
    });
    expect(orderedKeys(obj)).toEqual(values('a', 'b', 'alpha', 'zeta'));
  });

  it('omits unmodified Object.prototype keys for a plain object', () => {
    const obj = { b: 1, a: 2 };
    expect(orderedKeys(obj)).toEqual(values('a', 'b'));
  });

  it('reflects the current behaviour for an array (own data keys, then inherited Array.prototype methods)', () => {
    // Locks in today's exact output: own indices + 'length' first, followed by
    // every enumerable-or-not Array.prototype function (inherited, not own),
    // alphabetically sorted; 'toString'/'toLocaleString' are kept since Array
    // overrides them, unlike the unmodified Object.prototype versions;
    // 'constructor' is always omitted. So future refactors can be checked
    // against it.
    const protoMethods = [
      'at', 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter',
      'find', 'findIndex', 'findLast', 'findLastIndex', 'flat', 'flatMap',
      'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map',
      'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice',
      'some', 'sort', 'splice', 'toLocaleString', 'toReversed', 'toSorted',
      'toSpliced', 'toString', 'unshift', 'values', 'with',
    ];
    expect(orderedKeys(['x', 'y', 'z'])).toEqual([
      ...values('0', '1', '2'),
      { key: 'length', kind: 'value', own: true, enumerable: false },
      ...protoMethods.map((key) => ({ key, kind: 'value', own: false, enumerable: false })),
    ]);
  });

  it('omits uninteresting own keys (length/name/prototype/arguments/caller) for a function', () => {
    function namedFn() {}
    const keys = (orderedKeys(namedFn) as { key: string }[]).map(({ key }) => key);
    expect(keys).not.toContain('length');
    expect(keys).not.toContain('name');
    expect(keys).not.toContain('prototype');
    expect(keys).not.toContain('arguments');
    expect(keys).not.toContain('caller');
  });

  it('keeps a custom own key on a function', () => {
    const fn = Object.assign(() => {}, { customProp: 1 });
    expect(orderedKeys(fn)).toEqual(values('customProp'));
  });

  it('emits a getter descriptor for a getter-only accessor', () => {
    const obj = Object.create(null, {
      value: { get() { return 1; }, enumerable: true },
    });
    expect(orderedKeys(obj)).toEqual([{ key: 'value', kind: 'get', own: true, enumerable: true }]);
  });

  it('emits a setter descriptor for a setter-only accessor', () => {
    const obj = Object.create(null, {
      value: { set(_v) {}, enumerable: true },
    });
    expect(orderedKeys(obj)).toEqual([{ key: 'value', kind: 'set', own: true, enumerable: true }]);
  });

  it('emits both a getter and a setter descriptor for the same key when both are defined', () => {
    const obj = Object.create(null, {
      value: { get() { return 1; }, set(_v) {}, enumerable: true },
    });
    expect(orderedKeys(obj)).toEqual([
      { key: 'value', kind: 'get', own: true, enumerable: true },
      { key: 'value', kind: 'set', own: true, enumerable: true },
    ]);
  });

  it('does not invoke a getter to classify it as a function', () => {
    const obj = Object.create(null, {
      value: {
        get() { throw new Error('should not be invoked'); },
        enumerable: true,
      },
    });
    // A getter is never classed as a "function" key, so it stays with the
    // (empty, here) rest group rather than requiring the accessor to be called.
    expect(() => orderedKeys(obj)).not.toThrow();
    expect(orderedKeys(obj)).toEqual([{ key: 'value', kind: 'get', own: true, enumerable: true }]);
  });

  it('sorts getter/setter descriptors amongst plain value keys by key name', () => {
    const obj = Object.assign(Object.create(null, {
      b: { get() { return 1; }, enumerable: true },
    }), { a: 1, c: 2 });
    expect(orderedKeys(obj)).toEqual(values('a').concat(
      { key: 'b', kind: 'get', own: true, enumerable: true },
      values('c'),
    ));
  });

  it('groups own properties before inherited, non-enumerable prototype properties', () => {
    class Foo { method() {} }
    const instance = Object.assign(new Foo(), { z: 1, a: 2 });
    expect(orderedKeys(instance)).toEqual([
      { key: 'a', kind: 'value', own: true, enumerable: true },
      { key: 'z', kind: 'value', own: true, enumerable: true },
      { key: 'method', kind: 'value', own: false, enumerable: false },
    ]);
  });

  it('treats an own data property and an inherited getter as equally primary, sorted by name', () => {
    class Base {
      get computed() { return 1; }
    }
    const instance = Object.assign(new Base(), { a: 1 });
    expect(orderedKeys(instance)).toEqual([
      { key: 'a', kind: 'value', own: true, enumerable: true },
      { key: 'computed', kind: 'get', own: false, enumerable: false },
    ]);
  });

  it('treats an inherited, non-enumerable getter as primary (e.g. Temporal.Instant-style computed properties)', () => {
    // Temporal.Instant.prototype.epochMilliseconds is inherited and, like most
    // ECMAScript built-in accessors, non-enumerable — but it's still
    // meaningful computed data, not prototype noise, so it must not be dimmed.
    class Base {
      get computed() { return 42; }
    }
    expect(orderedKeys(new Base())).toEqual([
      { key: 'computed', kind: 'get', own: false, enumerable: false },
    ]);
  });

  it('treats an inherited-but-enumerable getter as primary, like Web platform Event getters', () => {
    // e.g. Event.prototype.type: inherited, yet enumerable, so devtools (and
    // this app) show it alongside own properties rather than as prototype noise.
    const proto = {};
    Object.defineProperty(proto, 'type', { get() { return 'click'; }, enumerable: true, configurable: true });
    const instance = Object.assign(Object.create(proto), { isTrusted: true });
    expect(orderedKeys(instance)).toEqual([
      { key: 'isTrusted', kind: 'value', own: true, enumerable: true },
      { key: 'type', kind: 'get', own: false, enumerable: true },
    ]);
  });
});

describe('describeKey', () => {
  it('returns a single value descriptor for a plain data property', () => {
    expect(describeKey({ a: 1 }, 'a')).toEqual([{ key: 'a', kind: 'value', own: true, enumerable: true }]);
  });

  it('returns a single get descriptor for a getter-only accessor', () => {
    const obj = Object.create(null, { a: { get() { return 1; }, enumerable: true } });
    expect(describeKey(obj, 'a')).toEqual([{ key: 'a', kind: 'get', own: true, enumerable: true }]);
  });

  it('returns a single set descriptor for a setter-only accessor', () => {
    const obj = Object.create(null, { a: { set(_v) {}, enumerable: true } });
    expect(describeKey(obj, 'a')).toEqual([{ key: 'a', kind: 'set', own: true, enumerable: true }]);
  });

  it('returns both descriptors, get first, when both accessors are defined', () => {
    const obj = Object.create(null, { a: { get() { return 1; }, set(_v) {}, enumerable: true } });
    expect(describeKey(obj, 'a')).toEqual([
      { key: 'a', kind: 'get', own: true, enumerable: true },
      { key: 'a', kind: 'set', own: true, enumerable: true },
    ]);
  });

  it('resolves accessors defined on the prototype chain, marked as not own', () => {
    class Base {
      get inherited() { return 1; }
    }
    const instance = new Base();
    expect(describeKey(instance, 'inherited')).toEqual([{ key: 'inherited', kind: 'get', own: false, enumerable: false }]);
  });

  it('reports enumerable: true for an inherited-but-enumerable accessor', () => {
    const proto = {};
    Object.defineProperty(proto, 'type', { get() { return 'click'; }, enumerable: true, configurable: true });
    const instance = Object.create(proto);
    expect(describeKey(instance, 'type')).toEqual([{ key: 'type', kind: 'get', own: false, enumerable: true }]);
  });
});

describe('isPrimaryKey', () => {
  it('is true when own', () => {
    expect(isPrimaryKey({ key: 'a', kind: 'value', own: true, enumerable: false })).toBe(true);
  });

  it('is true when enumerable but not own', () => {
    expect(isPrimaryKey({ key: 'a', kind: 'value', own: false, enumerable: true })).toBe(true);
  });

  it('is false when neither own nor enumerable, and kind is value', () => {
    expect(isPrimaryKey({ key: 'a', kind: 'value', own: false, enumerable: false })).toBe(false);
  });

  it('is true for a get accessor, even when neither own nor enumerable', () => {
    expect(isPrimaryKey({ key: 'a', kind: 'get', own: false, enumerable: false })).toBe(true);
  });

  it('is true for a set accessor, even when neither own nor enumerable', () => {
    expect(isPrimaryKey({ key: 'a', kind: 'set', own: false, enumerable: false })).toBe(true);
  });
});

