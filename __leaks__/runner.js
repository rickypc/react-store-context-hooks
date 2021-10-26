/* runner.js - Leak test runner for React store context hooks.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import memwatch from '@airbnb/node-memwatch';
import tape from 'tape';

const concurrency = 50;
const concurrents = [...Array(concurrency).keys()];
const exiter = () => process.exit(0);
const iterations = 5;
const log = (t, message) => message.split('\n')
  .forEach((line) => t.emit('result', line));
const max = concurrency * iterations;

process.once('SIGINT', exiter);
process.once('SIGTERM', exiter);

export default (name, fn) => new Promise((resolve) => tape(name, async (t) => {
  t.plan(1);
  let error = null;
  const catcher = (err = {}) => {
    if (err.name === 'MaxListenersExceededWarning') {
      error = error || err;
    }
  };
  const runner = async (count, done) => {
    if (error || count === iterations) {
      done();
      return;
    }
    await fn();
    // Enough time to take a deep breath.
    setTimeout(() => runner(count + 1, done), 25);
  };

  const heapDiff = new memwatch.HeapDiff();
  process.on('warning', catcher);
  await Promise.all(concurrents.map(() => new Promise((done) => runner(0, done))));
  process.removeListener('warning', catcher);

  if (error) {
    log(t, error.stack);
    t.fail('event listener leak detected');
    resolve();
    return;
  }

  const diff = heapDiff.end();
  const leaks = diff.change.details.filter((change) => (change['+'] >= max));

  if (leaks.length) {
    log(t, JSON.stringify(diff, null, 2));
    t.fail('memory leak detected');
  } else {
    t.pass('no memory leak detected');
  }

  resolve();
}));
