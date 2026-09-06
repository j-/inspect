import { describe, expect, it } from 'vitest';

import {
  allKeys,
  forInKeys,
  orderedKeys,
  ownKeys,
  ownKeysProto,
} from './utils';

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

  it('returns the filtered own property names of Object.prototype for a plain object', () => {
    const result = ownKeysProto({});
    expect(result).not.toContain('constructor');
    expect(result).not.toContain('hasOwnProperty');
    expect(result).not.toContain('isPrototypeOf');
    expect(result).not.toContain('propertyIsEnumerable');
    expect(result).not.toContain('__proto__');
    expect(result).not.toContain('__defineGetter__');
    expect(result).not.toContain('__defineSetter__');
    expect(result).not.toContain('__lookupGetter__');
    expect(result).not.toContain('__lookupSetter__');
    expect(result).toEqual(expect.arrayContaining(['toString', 'toLocaleString', 'valueOf']));
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
    const obj = { a: 1 };
    const keys = allKeys(obj) as string[];
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain('a');
    expect(keys).toContain('toString');
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
    expect(orderedKeys(obj)).toEqual(['Apple', 'banana', 'cherry']);
  });

  it('sorts numeric string keys numerically rather than lexicographically', () => {
    const obj = Object.assign(Object.create(null), { 10: 'a', 2: 'b', 1: 'c' });
    expect(orderedKeys(obj)).toEqual(['1', '2', '10']);
  });

  it('places function-valued keys after non-function keys', () => {
    const obj = Object.assign(Object.create(null), { b: () => {}, a: 1 });
    expect(orderedKeys(obj)).toEqual(['a', 'b']);
  });

  it('sorts function keys separately from, and after, data keys', () => {
    const obj = Object.assign(Object.create(null), {
      zeta: () => {},
      alpha: () => {},
      b: 1,
      a: 2,
    });
    expect(orderedKeys(obj)).toEqual(['a', 'b', 'alpha', 'zeta']);
  });

  it('reflects the current behaviour for a plain object (including Object.prototype keys)', () => {
    const obj = { b: 1, a: 2 };
    expect(orderedKeys(obj)).toEqual([
      'a', 'b',
      'toLocaleString', 'toString', 'valueOf',
    ]);
  });

  it('reflects the current behaviour for an array (data keys, then sorted Array.prototype methods)', () => {
    // Locks in today's exact output (indices + 'length', followed by every
    // enumerable-or-not own function on Array.prototype, alphabetically sorted)
    // so a generator refactor can be checked against it.
    expect(orderedKeys(['x', 'y', 'z'])).toEqual([
      '0', '1', '2', 'length',
      'at', 'concat', 'copyWithin', 'entries', 'every', 'fill', 'filter',
      'find', 'findIndex', 'findLast', 'findLastIndex', 'flat', 'flatMap',
      'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map',
      'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice',
      'some', 'sort', 'splice', 'toLocaleString', 'toReversed', 'toSorted',
      'toSpliced', 'toString', 'unshift', 'values', 'with',
    ]);
  });
});
