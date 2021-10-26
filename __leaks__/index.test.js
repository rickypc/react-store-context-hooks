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

const {
  isEmpty,
  useStore,
  useStores,
  withStore,
} = proxyquire('../src/index.js', {
  react: {
    createContext: () => context,
    useCallback: (cb) => cb,
    useContext: () => context,
    useState() {},
  },
});

(async () => {
  await run('isEmpty', () => isEmpty(false));
  await run('useStore', () => useStore('key', 'default'));
  await run('useStores', () => useStores({ key1: 'value1' }));
  await run('withStore', () => withStore(Component));
})();
