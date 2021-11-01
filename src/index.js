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
 *
 * @example
 * import { isEmpty, useStore, useStores, withStore } from 'react-store-context-hooks';
 * import { useEffect } from 'react';
 * import { render } from 'react-dom';
 *
 * const ComponentA = () => {
 *   const [value, setValue, delValue] = useStore('key');
 *
 *   useEffect(() => {
 *     if (isEmpty(value)) {
 *       setValue({ key: {
 *         nested: 'value-from-A',
 *       } });
 *     }
 *     return () => delValue();
 *   }, []);
 *
 *   return <>{JSON.stringify(value)}<>;
 * };
 *
 * const ComponentB = () => {
 *   const [value, setValue, delValue] = useStore('key');
 *
 *   useEffect(() => {
 *     if (isEmpty(value)) {
 *       setValue({ key: {
 *         nested: 'value-from-B',
 *       } });
 *     }
 *     return () => delValue();
 *   }, []);
 *
 *   return <>{JSON.stringify(value)}<>;
 * };
 *
 * const App = withStore(() => {
 *   const { setStores } = useStores();
 *
 *   useEffect(() => {
 *     setStores({
 *       key: {
 *         nested: 'value',
 *       },
 *     });
 *   }, []);
 *
 *   return (
 *     <>
 *       <ComponentA />
 *       <ComponentB />
 *     </>
 *   );
 * });
 *
 * render(<App />, document.querySelector('#root'));
 */

const storage = {
  get: (persistence: Storage, key: string, defaultValue: mixed) => {
    if (!(persistence instanceof Storage)) {
      return defaultValue;
    }

    let value: mixed;
    try {
      value = JSON.parse<mixed>(persistence.getItem(key) || 'undefined');
    } catch (_) {
      // no-op.
    }

    return value === undefined ? defaultValue : value;
  },
  remove: (persistence: Storage, key: string) => {
    if (persistence instanceof Storage && persistence.getItem(key) !== null) {
      persistence.removeItem(key);
      return true;
    }
    return false;
  },
  set: (persistence: Storage, key: string, value: mixed) => {
    if (persistence instanceof Storage) {
      const val = JSON.stringify(value);
      if (persistence.getItem(key) !== val) {
        persistence.setItem(key, val);
        return true;
      }
    }
    return false;
  },
};

const createStore = () => {
  const [store, setStore] = useState<{[string]: mixed}>({});
  return {
    get(key: string, defaultValue: mixed, persistence: Storage): mixed {
      const value = store[key];
      return value === undefined
        ? storage.get(persistence, key, defaultValue) : value;
    },
    remove: (key: string, persistence: Storage): void => setStore((prev) => {
      const removed = storage.remove(persistence, key);
      if (removed || key in prev) {
        const { [key]: val, ...next } = prev;
        return { ...next };
      }
      return prev;
    }),
    set: (key: string, value: mixed, persistence: Storage): void => setStore((prev) => {
      if (prev[key] !== value) {
        storage.set(persistence, key, value);
        return { ...prev, [key]: value };
      }
      return prev;
    }),
    sets: (data: {[string]: mixed}, persistence: Storage): void => setStore((prev) => {
      let changes = false;
      const next = Object.entries(data)
        .filter(([key, value]) => prev[key] !== value)
        .reduce((accumulator, [key, value]) => {
          storage.set(persistence, key, value);
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
 * @method
 * @param {mixed} value The value to be checked for emptiness.
 * @returns {boolean} Value emptiness flag.
 *
 * @example
 * let flag = isEmpty('');
 * // flag = true
 * flag = isEmpty('value');
 * // flag = false
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
 * The accessor will validate the value in the data store first before
 * accessing the given persistent storage. If both data store
 * and persistent storage values are empty, it will use the default value.
 *
 * The mutators will persist the value with JSON string format
 * in the persistent storage.
 *
 * @alias module:react-store-context-hooks.useStore
 * @method
 * @param {string} key The store key.
 * @param {mixed} defaultValue The store default value.
 * @param {Storage} persistence The data persistence choices: localStorage, sessionStorage.
 * @returns {Array.<mixed, function(value): void, function(): void>}
 *          Store value, update, and remove callbacks.
 *
 * @example <caption>Without persistent storage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * const Component = () => {
 *   const [store, setStore, delStore] = useStore('key', 'default');
 *   // store = 'default'
 *
 *   useEffect(() => {
 *     setStore('value');
 *     // store = 'value'
 *
 *     return () => {
 *       delStore();
 *       // store = 'default'
 *     };
 *   }, []);
 * };
 *
 * @example <caption>With localStorage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * // Simulate an existing value
 * localStorage.setItem('key', JSON.stringify('local-default'));
 *
 * const Component = () => {
 *   const [store, setStore, delStore] = useStore('key', 'default', localStorage);
 *   // store = 'local-default'
 *   // localStorage.getItem('key') = '"local-default"'
 *
 *   useEffect(() => {
 *     setStore('value');
 *     // store = 'value'
 *     // localStorage.getItem('key') = '"value"'
 *
 *     return () => {
 *       delStore();
 *       // store = 'default'
 *       // localStorage.getItem('key') = null
 *     };
 *   }, []);
 * };
 *
 * @example <caption>With sessionStorage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * // Simulate an existing value
 * sessionStorage.setItem('key', JSON.stringify('session-default'));
 *
 * const Component = () => {
 *   const [store, setStore, delStore] = useStore('key', 'default', sessionStorage);
 *   // store = 'session-default'
 *   // sessionStorage.getItem('key') = '"session-default"'
 *
 *   useEffect(() => {
 *     setStore('value');
 *     // store = 'value'
 *     // sessionStorage.getItem('key') = '"value"'
 *
 *     return () => {
 *       delStore();
 *       // store = 'default'
 *       // sessionStorage.getItem('key') = null
 *     };
 *   }, []);
 * };
 */
export const useStore = (key: string, defaultValue: mixed, persistence: Storage): Array<mixed> => {
  const store = useContext(StoreContext);
  return [
    store.get(key, defaultValue, persistence),
    useCallback((value: mixed) => store.set(key, value, persistence), [store]),
    useCallback(() => store.remove(key, persistence), [store]),
  ];
};

/**
 * A data store hook that allows a functional component to update multiple
 * stores at once and share the application state with any components within
 * the same React Context.
 *
 * The mutator will persist the values with JSON string format
 * in the persistent storage.
 *
 * @alias module:react-store-context-hooks.useStores
 * @method
 * @param {Storage} persistence The data persistence choices: localStorage, sessionStorage.
 * @returns {Object.<{ setStores: function(data): void }>} Multiple stores update callback.
 *
 * @example <caption>Without persistent storage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * const Component = () => {
 *   const [store1] = useStore('key1');
 *   const [store2] = useStore('key2');
 *   const { setStores } = useStores();
 *
 *   useEffect(() => {
 *     setStore({
 *       key1: 'value1',
 *       key2: {
 *         nested: 'value',
 *       },
 *     });
 *   }, []);
 *
 *   // store1 = 'value1'
 *   // store2 = {
 *   //   nested: 'value',
 *   // }
 *
 *   return <>{JSON.stringify({ store1, store2 })}</>;
 * };
 *
 * @example <caption>With localStorage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * const Component = () => {
 *   const [store1] = useStore('key1', undefined, localStorage);
 *   const [store2] = useStore('key2', undefined, localStorage);
 *   const { setStores } = useStores(localStorage);
 *
 *   useEffect(() => {
 *     setStore({
 *       key1: 'value1',
 *       key2: {
 *         nested: 'value',
 *       },
 *     });
 *   }, []);
 *
 *   // store1 = 'value1'
 *   // store2 = {
 *   //   nested: 'value',
 *   // }
 *   // localStorage.getItem('key1') = '"value1"'
 *   // localStorage.getItem('key2') = '{"nested":"value"}'
 *
 *   return <>{JSON.stringify({ store1, store2 })}</>;
 * };
 *
 * @example <caption>With sessionStorage</caption>
 * import { useEffect } from 'react';
 * import { useStore }  from 'react-store-context-hooks';
 *
 * const Component = () => {
 *   const [store1] = useStore('key1', undefined, sessionStorage);
 *   const [store2] = useStore('key2', undefined, sessionStorage);
 *   const { setStores } = useStores(sessionStorage);
 *
 *   useEffect(() => {
 *     setStore({
 *       key1: 'value1',
 *       key2: {
 *         nested: 'value',
 *       },
 *     });
 *   }, []);
 *
 *   // store1 = 'value1'
 *   // store2 = {
 *   //   nested: 'value',
 *   // }
 *   // sessionStorage.getItem('key1') = '"value1"'
 *   // sessionStorage.getItem('key2') = '{"nested":"value"}'
 *
 *   return <>{JSON.stringify({ store1, store2 })}</>;
 * };
 */
export const useStores = (persistence: Storage): {} => {
  const store = useContext(StoreContext);
  return {
    setStores: useCallback((data: {[string]: mixed}): void => store.sets(data, persistence),
      [store]),
  };
};

/**
 * A data store hook that wraps a component with a store context provider.
 *
 * @alias module:react-store-context-hooks.withStores
 * @method
 * @param {React.ComponentType} Component The component to be wrapped with the store provider.
 * @returns {React.ComponentType} The wrapped component with store provider.
 *
 * @example <caption>Wrap an existing component</caption>
 * import { render }  from 'react-dom';
 * import { withStore }  from 'react-store-context-hooks';
 *
 * const Component = (props) => {
 *   return <>{JSON.stringify(props)}</>;
 * };
 *
 * const ComponentWithStore = withStore(Component);
 *
 * render(<ComponentWithStore attr1="val1" attr2="val2" />, document.querySelector('#root'));
 *
 * @example <caption>Wrap a component on-the-fly</caption>
 * import { render }  from 'react-dom';
 * import { withStore }  from 'react-store-context-hooks';
 *
 * const ComponentWithStore = withStore((props) => {
 *   return <>{JSON.stringify(props)}</>;
 * });
 *
 * render(<ComponentWithStore attr1="val1" attr2="val2" />, document.querySelector('#root'));
 */
export const withStore = (Component: ComponentType<any>): ComponentType<any> => {
  // Provide display name.
  const ComponentWithStore = (props: {}): Node => (<StoreContext.Provider value={createStore()}>
    <Component {...props} />
  </StoreContext.Provider>);
  return ComponentWithStore;
};
