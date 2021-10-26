/* runner.js - Benchmark test runner for React store context hooks.
 * Copyright (c) 2019 - 2021 Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import Benchmark from 'benchmark';

Benchmark.options.maxTime = 0;
Benchmark.options.minSamples = 5;

export default (name, fn) => new Promise((resolve) => ((new Benchmark(name,
  { defer: true, fn: async (d) => d.resolve(await fn()) }))
  .on('complete', (evt) => {
    process.stdout.write(`${evt.target}\n`);
    resolve();
  })
  .on('error', (evt) => {
    throw evt.target.error;
  })
  .run({ async: true })));
