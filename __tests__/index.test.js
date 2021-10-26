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
      expect(response.rendered).toBe(1);

      // Post-write value check.
      act(() => response.set(value));
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toBe(isUndefined ? 1 : 3);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toBe(isUndefined ? 1 : 3);
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
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(1);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(1);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(1);
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
      expect(response.rendered).toBe(1);

      // Post-write value check.
      act(() => response.set(value));
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.set(value));
      expect(response.get).toBe(value);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);

      // Post-delete value check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toBe(isUndefined ? 1 : 3);

      // Ignore non-existence delete check.
      act(() => response.del());
      expect(response.get).toBeUndefined();
      expect(response.rendered).toBe(isUndefined ? 1 : 3);
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
      expect(response.rendered).toBe(1);

      // Post-write value check.
      act(() => response.sets(value));
      expect(response.get).toBe(value.key);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);

      // Ignore same value write check.
      act(() => response.sets(value));
      expect(response.get).toBe(value.key);
      expect(response.rendered).toBe(isUndefined ? 1 : 2);
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
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(1);
      expect(response.renderedB).toBe(1);

      // Post-write value check.
      let value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toBe(value);
      expect(response.getB).toBe(value);
      expect(response.renderedA).toBe(2);
      expect(response.renderedB).toBe(2);

      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toBe(value);
      expect(response.getB).toBe(value);
      expect(response.renderedA).toBe(3);
      expect(response.renderedB).toBe(3);

      // Post-delete value check.
      act(() => response.delA());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(4);
      expect(response.renderedB).toBe(4);

      // Prevent short-circuit.
      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toBe(value);
      expect(response.getB).toBe(value);
      expect(response.renderedA).toBe(5);
      expect(response.renderedB).toBe(5);

      act(() => response.delB());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(6);
      expect(response.renderedB).toBe(6);
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
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(1);
      expect(response.renderedB).toBe(1);

      // Post-write value check.
      let value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toBe(value);
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(2);
      expect(response.renderedB).toBe(1);

      value = 'non-default-B';
      act(() => response.setB(value));
      expect(response.getA).toBe('non-default-A');
      expect(response.getB).toBe(value);
      expect(response.renderedA).toBe(2);
      expect(response.renderedB).toBe(2);

      // Post-delete value check.
      act(() => response.delA());
      expect(response.getA).toBeUndefined();
      expect(response.getB).toBe(value);
      expect(response.renderedA).toBe(3);
      expect(response.renderedB).toBe(2);

      // Prevent short-circuit.
      value = 'non-default-A';
      act(() => response.setA(value));
      expect(response.getA).toBe(value);
      expect(response.getB).toBe('non-default-B');
      expect(response.renderedA).toBe(4);
      expect(response.renderedB).toBe(2);

      act(() => response.delB());
      expect(response.getA).toBe(value);
      expect(response.getB).toBe('default');
      expect(response.renderedA).toBe(4);
      expect(response.renderedB).toBe(3);
    });
  });
});
