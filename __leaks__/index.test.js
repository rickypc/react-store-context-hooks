/* index.test.js - Leak tests for React store context hooks functionality.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import proxyquire from 'proxyquire';
import run from './runner.js';

const Component = () => null;
const context = {
  get() {},
  remove() {},
  set() {},
  sets() {},
};
const events = {};

class Storage {
  constructor() {
    this.data = {};
  }

  getItem(key) {
    return this.data[key];
  }

  removeItem(key) {
    delete this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
  }
}

global.document = {
  addEventListener(topic, listener) {
    events[topic] = listener;
  },
  dispatchEvent: (e) => events[e.type](e),
  removeEventListener: (topic) => delete events[topic],
};
global.localStorage = new Storage();
global.sessionStorage = new Storage();
global.Storage = Storage;

const {
  isEmpty,
  useLocalStore,
  useLocalStores,
  useSessionStore,
  useSessionStores,
  useStore,
  useStores,
  withStore,
} = proxyquire('../src/index.js', {
  react: {
    createContext: () => context,
    useCallback: (cb) => cb,
    useContext: () => context,
    useEffect: (cb) => cb(),
    useState: () => [undefined, () => {}],
  },
});

(async () => {
  await run('isEmpty', () => isEmpty(false));
  await run('useLocalStore', () => useLocalStore('key', 'default'));
  await run('useLocalStores', () => useLocalStores());
  await run('useSessionStore', () => useSessionStore('key', 'default'));
  await run('useSessionStores', () => useSessionStores());
  await run('useStore', () => useStore('key', 'default'));
  await run('useStores', () => useStores({ key1: 'value1' }));
  await run('withStore', () => withStore(Component));
})();
