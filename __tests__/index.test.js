/* index.test.js - tests for React store context hooks functionality.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import { act, render } from '@testing-library/react';
import React, { useMemo } from 'react';
import {
  isEmpty,
  useStore,
  useStores,
  withStore,
} from '../src/index.js';

const localProto = Object.getPrototypeOf(global.localStorage);
// After localProto assignment.
const localGet = jest.spyOn(localProto, 'getItem');
const localRemove = jest.spyOn(localProto, 'removeItem');
const localSet = jest.spyOn(localProto, 'setItem');

const sessionProto = Object.getPrototypeOf(global.sessionStorage);
// After sessionProto assignment.
const sessionGet = jest.spyOn(sessionProto, 'getItem');
const sessionRemove = jest.spyOn(sessionProto, 'removeItem');
const sessionSet = jest.spyOn(sessionProto, 'setItem');

describe('React store context hooks module test', () => {
  describe('isEmpty', () => {
    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
    `('should return truthy for $value', ({ value }) => {
      const actual = isEmpty(value);

      expect(actual).toBeTruthy();
    });

    it.each`
      value
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return falsy for $value', ({ value }) => {
      const actual = isEmpty(value);

      expect(actual).toBeFalsy();
    });
  });

  describe('useStore', () => {
    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value for $value', ({ value }) => {
      const isUndefined = value === undefined;
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key');
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.set(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(isUndefined ? 1 : 3);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(isUndefined ? 1 : 3);
    });

    it('should return expected value with localStorage for undefined', () => {
      // Remove previous test value.
      global.localStorage.removeItem('key');
      localRemove.mockClear();

      const response = { rendered: 0 };
      const value = undefined;

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.localStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value with localStorage for $value', ({ value }) => {
      // Remove previous test value.
      global.localStorage.removeItem('key');
      localRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.localStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).toHaveBeenCalledTimes(1);
      expect(localSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);
      localGet.mockClear();
      localSet.mockClear();

      // Ignore same value write check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(localGet).toHaveBeenNthCalledWith(2, 'key');
      expect(localRemove).toHaveBeenCalledTimes(1);
      expect(localRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
      localGet.mockClear();
      localRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      // Delete check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
    });

    it('should return expected value with sessionStorage for undefined', () => {
      // Remove previous test value.
      global.sessionStorage.removeItem('key');
      sessionRemove.mockClear();

      const response = { rendered: 0 };
      const value = undefined;

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.sessionStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Post-delete value check.
      act(() => response.del());
      // Delete check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      // Delete check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value with sessionStorage for $value', ({ value }) => {
      // Remove previous test value.
      global.sessionStorage.removeItem('key');
      sessionRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.sessionStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).toHaveBeenCalledTimes(1);
      expect(sessionSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);
      sessionGet.mockClear();
      sessionSet.mockClear();

      // Ignore same value write check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);

      // Post-delete value check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(sessionGet).toHaveBeenNthCalledWith(2, 'key');
      expect(sessionRemove).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
      sessionGet.mockClear();
      sessionRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      // Delete check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return default value for $value', ({ value }) => {
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', value);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return default value with localStorage for $value', ({ value }) => {
      // Remove previous test value.
      global.localStorage.removeItem('key');
      localRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', value, global.localStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return localStorage existing value for $value', ({ value }) => {
      // Reset previous test value.
      global.localStorage.setItem('key', JSON.stringify(value));
      localSet.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.localStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(localGet).toHaveBeenNthCalledWith(2, 'key');
      expect(localRemove).toHaveBeenCalledTimes(1);
      expect(localRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(2);
      localGet.mockClear();
      localRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(2);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return default value with sessionStorage for $value', ({ value }) => {
      // Remove previous test value.
      global.sessionStorage.removeItem('key');
      sessionRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', value, global.sessionStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-delete value check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return sessionStorage existing value for $value', ({ value }) => {
      // Reset previous test value.
      global.sessionStorage.setItem('key', JSON.stringify(value));
      sessionSet.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.sessionStorage);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-delete value check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(sessionGet).toHaveBeenNthCalledWith(2, 'key');
      expect(sessionRemove).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(2);
      sessionGet.mockClear();
      sessionRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(2);
    });

    it.each`
      value
      ${undefined}
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value with memoized callback for $value', ({ value }) => {
      const isUndefined = value === undefined;
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key');
        response.set = useMemo(() => response.set, []);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.set(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(isUndefined ? 1 : 3);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(isUndefined ? 1 : 3);
    });

    it('should return expected value with localStorage and memoized callback for undefined', () => {
      // Remove previous test value.
      global.localStorage.removeItem('key');
      localRemove.mockClear();

      const response = { rendered: 0 };
      const value = undefined;

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.localStorage);
        response.set = useMemo(() => response.set, []);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value with localStorage and memoized callback for $value', ({ value }) => {
      // Remove previous test value.
      global.localStorage.removeItem('key');
      localRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.localStorage);
        response.set = useMemo(() => response.set, []);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      localGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localSet).toHaveBeenCalledTimes(1);
      expect(localSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);
      localGet.mockClear();
      localSet.mockClear();

      // Ignore same value write check.
      act(() => response.set(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);

      // Post-delete value check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(localGet).toHaveBeenNthCalledWith(2, 'key');
      expect(localRemove).toHaveBeenCalledTimes(1);
      expect(localRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
      localGet.mockClear();
      localRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(localGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
    });

    it('should return expected value with sessionStorage and memoized callback for undefined', () => {
      // Remove previous test value.
      global.sessionStorage.removeItem('key');
      sessionRemove.mockClear();

      const response = { rendered: 0 };
      const value = undefined;

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.sessionStorage);
        response.set = useMemo(() => response.set, []);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-delete value check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${null}
      ${false}
      ${0}
      ${''}
      ${[]}
      ${{}}
      ${true}
      ${1}
      ${-1}
      ${'string'}
      ${[1, 2, 3]}
      ${{ 1: 2 }}
      ${{ k: 'v' }}
    `('should return expected value with sessionStorage and memoized callback for $value', ({ value }) => {
      // Remove previous test value.
      global.sessionStorage.removeItem('key');
      sessionRemove.mockClear();

      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get, response.set, response.del] = useStore('key', undefined, global.sessionStorage);
        response.set = useMemo(() => response.set, []);
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);
      sessionGet.mockClear();

      // Post-write value check.
      act(() => response.set(value));
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionSet).toHaveBeenCalledTimes(1);
      expect(sessionSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value));
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);
      sessionGet.mockClear();
      sessionSet.mockClear();

      // Ignore same value write check.
      act(() => response.set(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value);
      expect(response.rendered).toEqual(2);

      // Post-delete value check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(2);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      // Render.
      expect(sessionGet).toHaveBeenNthCalledWith(2, 'key');
      expect(sessionRemove).toHaveBeenCalledTimes(1);
      expect(sessionRemove).toHaveBeenNthCalledWith(1, 'key');
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
      sessionGet.mockClear();
      sessionRemove.mockClear();

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(sessionGet).toHaveBeenCalledTimes(1);
      // Delete check.
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionRemove).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(3);
    });
  });

  describe('useStores', () => {
    it.each`
      value
      ${{ key: undefined }}
      ${{ key: null }}
      ${{ key: false }}
      ${{ key: 0 }}
      ${{ key: '' }}
      ${{ key: [] }}
      ${{ key: { } }}
      ${{ key: true }}
      ${{ key: 1 }}
      ${{ key: -1 }}
      ${{ key: 'string' }}
      ${{ key: [1, 2, 3] }}
      ${{ key: { 1: 2 } }}
      ${{ key: { k: 'v' } }}
    `('should return expected value for $value', ({ value }) => {
      const isUndefined = value.key === undefined;
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get] = useStore('key');
        ({ setStores: response.sets } = useStores());
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(isUndefined ? 1 : 2);
    });

    it('should return expected value with localStorage for undefined', () => {
      const response = { rendered: 0 };
      const value = { key: undefined };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get] = useStore('key');
        ({ setStores: response.sets } = useStores(global.localStorage));
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${{ key: null }}
      ${{ key: false }}
      ${{ key: 0 }}
      ${{ key: '' }}
      ${{ key: [] }}
      ${{ key: {} }}
      ${{ key: true }}
      ${{ key: 1 }}
      ${{ key: -1 }}
      ${{ key: 'string' }}
      ${{ key: [1, 2, 3] }}
      ${{ key: { 1: 2 } }}
      ${{ key: { k: 'v' } }}
    `('should return expected value with localStorage for $value', ({ value }) => {
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get] = useStore('key');
        ({ setStores: response.sets } = useStores(global.localStorage));
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(localGet).toHaveBeenCalledTimes(1);
      expect(localGet).toHaveBeenNthCalledWith(1, 'key');
      expect(localSet).toHaveBeenCalledTimes(1);
      expect(localSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value.key));
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(2);
      localGet.mockClear();
      localSet.mockClear();

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(localGet).not.toHaveBeenCalled();
      expect(localSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(2);
    });

    it('should return expected value with sessionStorage for undefined', () => {
      const response = { rendered: 0 };
      const value = { key: undefined };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get] = useStore('key');
        ({ setStores: response.sets } = useStores(global.sessionStorage));
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(1);

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(1);
    });

    it.each`
      value
      ${{ key: null }}
      ${{ key: false }}
      ${{ key: 0 }}
      ${{ key: '' }}
      ${{ key: [] }}
      ${{ key: {} }}
      ${{ key: true }}
      ${{ key: 1 }}
      ${{ key: -1 }}
      ${{ key: 'string' }}
      ${{ key: [1, 2, 3] }}
      ${{ key: { 1: 2 } }}
      ${{ key: { k: 'v' } }}
    `('should return expected value with sessionStorage for $value', ({ value }) => {
      const response = { rendered: 0 };

      const App = withStore(() => {
        response.rendered += 1;
        [response.get] = useStore('key');
        ({ setStores: response.sets } = useStores(global.sessionStorage));
        return null;
      });
      render(<App />);

      // Initial value check.
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toBeUndefined();
      expect(response.rendered).toEqual(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(sessionGet).toHaveBeenCalledTimes(1);
      expect(sessionGet).toHaveBeenNthCalledWith(1, 'key');
      expect(sessionSet).toHaveBeenCalledTimes(1);
      expect(sessionSet).toHaveBeenNthCalledWith(1, 'key', JSON.stringify(value.key));
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(2);
      localGet.mockClear();
      localSet.mockClear();

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(sessionGet).not.toHaveBeenCalled();
      expect(sessionSet).not.toHaveBeenCalled();
      expect(response.get).toEqual(value.key);
      expect(response.rendered).toEqual(2);
    });
  });

  describe('withStore', () => {
    it('should be able to share data between components', () => {
      const response = { renderedA: 0, renderedB: 0 };
      const App = withStore(() => (
        <>
          <CompA />
          <CompB />
        </>
      ));
      const CompA = () => {
        response.renderedA += 1;
        [response.getA, response.setA, response.delA] = useStore('key');
        return null;
      };
      const CompB = () => {
        response.renderedB += 1;
        [response.getB, response.setB, response.delB] = useStore('key', 'default');
        return null;
      };

      render(<App />);

      // Initial value check.
      expect(response.getA).toBeUndefined();
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(1);
      expect(response.renderedB).toEqual(1);

      // Post-write value check.
      let value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual(value);
      expect(response.renderedA).toEqual(2);
      expect(response.renderedB).toEqual(2);

      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual(value);
      expect(response.renderedA).toEqual(3);
      expect(response.renderedB).toEqual(3);

      // Post-delete value check.
      act(() => response.delA());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(4);
      expect(response.renderedB).toEqual(4);

      // Prevent short-circuit.
      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual(value);
      expect(response.renderedA).toEqual(5);
      expect(response.renderedB).toEqual(5);

      act(() => response.delB());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(6);
      expect(response.renderedB).toEqual(6);
    });

    it('should NOT be able to share data between different context', () => {
      const response = { renderedA: 0, renderedB: 0 };
      const App = () => (
        <>
          <CompA />
          <CompB />
        </>
      );
      const CompA = withStore(() => {
        response.renderedA += 1;
        [response.getA, response.setA, response.delA] = useStore('key');
        return null;
      });
      const CompB = withStore(() => {
        response.renderedB += 1;
        [response.getB, response.setB, response.delB] = useStore('key', 'default');
        return null;
      });

      render(<App />);

      // Initial value check.
      expect(response.getA).toBeUndefined();
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(1);
      expect(response.renderedB).toEqual(1);

      // Post-write value check.
      let value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(2);
      expect(response.renderedB).toEqual(1);

      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toEqual('non-default-A');
      expect(response.getB).toEqual(value);
      expect(response.renderedA).toEqual(2);
      expect(response.renderedB).toEqual(2);

      // Post-delete value check.
      act(() => response.delA());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toEqual(value);
      expect(response.renderedA).toEqual(3);
      expect(response.renderedB).toEqual(2);

      // Prevent short-circuit.
      value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual('non-default-B');
      expect(response.renderedA).toEqual(4);
      expect(response.renderedB).toEqual(2);

      act(() => response.delB());
      expect(response.getA).toEqual(value);
      expect(response.getB).toEqual('default');
      expect(response.renderedA).toEqual(4);
      expect(response.renderedB).toEqual(3);
    });
  });
});
