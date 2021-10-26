/* index.js - Provides various data store hooks that allow functional components
 *            within the same React Context to share the application state.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// @flow

import type { ComponentType, Node } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

/**
 * Provides various data store hooks that allow functional components within
 * the same React Context to share the application state.
 *
 * @module react-store-context-hooks
 * @requires react
 */

const createStore = () => {
  const [store, setStore] = useState<{[string]: mixed}>({});
  return {
    get(key: string, defaultValue: mixed): mixed {
      const value = store[key];
      return value === undefined ? defaultValue : value;
    },
    remove(key: string): void {
      if (key in store) {
        setStore((prev) => {
          const { [key]: k, ...rest } = prev;
          return { ...rest };
        });
      }
    },
    set: (key: string, value: mixed): void => setStore((prev) => (prev[key] !== value
      ? { ...prev, [key]: value } : prev)),
    sets: (data: {[string]: mixed}): void => setStore((prev) => {
      let changes = false;
      const next = Object.entries(data)
        .filter(([key, value]) => prev[key] !== value)
        .reduce((accumulator, [key, value]) => {
          accumulator[key] = value;
          changes = true;
          return accumulator;
        }, prev);
      return changes ? { ...next } : prev;
    }),
  };
};

/**
 * A data store hook that allows a functional component to validate given value
 * emptiness.
 *
 * @alias module:react-store-context-hooks.isEmpty
 * @param {mixed} value The value to be checked for emptiness.
 * @returns {boolean} Value emptiness flag.
 * @example
 * let flag = isEmpty('');
 * // flag = true.
 * flag = isEmpty('value');
 * // flag = false.
 */
export const isEmpty = (value: mixed): boolean => value == null
  || (typeof value === 'object' && Object.keys(value).length === 0)
  || (typeof value === 'string' && value.trim().length === 0)
  || (['boolean', 'number'].includes(typeof value) && !value);

const StoreContext = createContext({});

/**
 * A data store hook that allows any components within the same React Context
 * to share the application state.
 *
 * @alias module:react-store-context-hooks.useStore
 * @param {string} key The store key.
 * @param {mixed} defaultValue The store default value.
 * @returns {Array.<mixed, function(value): void, function(): void>}
 *          Store value, update, and remove callbacks.
 * @example
 * const [store, setStore, delStore] = useStore('key', 'default');
 * // store = 'default'.
 *
 * setStore('value');
 * // store = 'value'.
 *
 * delStore();
 * // store = 'default'.
 */
export const useStore = (key: string, defaultValue: mixed): Array<mixed> => {
  const store = useContext(StoreContext);
  return [
    store.get(key, defaultValue),
    useCallback((newValue: mixed) => store.set(key, newValue), [store]),
    useCallback(() => store.remove(key), [store]),
  ];
};

/**
 * A data store hook that allows a functional component to update multiple
 * stores at once and share the application state with any components within
 * the same React Context.
 *
 * @alias module:react-store-context-hooks.useStores
 * @method
 * @returns {Object.<{ setStores: function(data): void }>} Multiple stores update callback.
 * @example
 * const [store1] = useStore('key1');
 * const [store2] = useStore('key2');
 *
 * const { setStores } = useStores();
 *
 * setStore({
 *   key1: 'value1',
 *   key2: 'value2',
 * });
 * // store1 = 'value1'.
 * // store2 = 'value2'.
 */
export const useStores = (): {} => {
  const store = useContext(StoreContext);
  return { setStores: useCallback(store.sets, [store]) };
};

/**
 * A data store hook that wraps a component with a store context provider.
 *
 * @alias module:react-store-context-hooks.withStores
 * @method
 * @param {React.ComponentType} Component The component to be wrapped with the store provider.
 * @returns {React.ComponentType} The wrapped component with store provider.
 * @example
 * const ComponentWithStore = withStore(Component);
 * return <ComponentWithStore {...props} />;
 */
export const withStore = (Component: ComponentType<any>): ComponentType<any> => {
  // Provide display name.
  const ComponentWithStore = (props: {}): Node => (<StoreContext.Provider value={createStore()}>
    <Component {...props} />
  </StoreContext.Provider>);
  return ComponentWithStore;
};
