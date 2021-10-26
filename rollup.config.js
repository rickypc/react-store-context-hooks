/* rollup.config.js - Rollup configuration.
 * Copyright (c) 2019 - 2021  Richard Huang <rickypc@users.noreply.github.com>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import fs from 'fs';
import path from 'path';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const banner = `/*! ${pkg.name} v${pkg.version} | (c) ${pkg.author.name} <${pkg.author.email}> | ${pkg.license} */`;
const external = [
  'react',
  'react/jsx-runtime',
];
const globals = {
  react: 'React',
  'react/jsx-runtime': 'jsxRuntime',
};
const input = ['./src/index.js'];
const writePackage = (json, to) => ({
  generateBundle() {
    const {
      devDependencies,
      eslintConfig,
      jest,
      scripts,
      ...output
    } = json;
    delete output.babel;
    fs.writeFileSync(path.resolve(to), JSON.stringify(output));
  },
  name: 'write-package',
});

export default [
  // CJS and ESM.
  {
    external,
    input,
    onwarn: (warning, next) => {
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
      next(warning);
    },
    output: [
      {
        banner,
        exports: 'named',
        file: `dist/${pkg.main}`,
        format: 'cjs',
        globals,
        sourcemap: true,
        strict: false,
      },
      {
        banner,
        exports: 'named',
        file: `dist/${pkg.module}`,
        format: 'esm',
        globals,
        sourcemap: true,
        strict: false,
      },
    ],
    plugins: [
      // Begin run once.
      del({
        targets: 'dist/*',
      }),
      copy({
        targets: [
          { src: ['CHANGELOG.md', 'example.js', 'LICENSE', 'README.md'], dest: 'dist' },
        ],
      }),
      writePackage(pkg, 'dist/package.json'),
      // End run once.
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          '@babel/flow',
          [
            '@babel/react',
            {
              runtime: 'automatic',
            },
          ],
        ],
      }),
      terser({
        compress: false,
        mangle: false,
      }),
    ],
  },
  // UMD.
  {
    external,
    input,
    output: [
      {
        banner,
        esModule: false,
        exports: 'named',
        file: 'dist/index.umd.js',
        format: 'umd',
        globals,
        name: 'reactStoreContextHooks',
        sourcemap: true,
      },
    ],
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env',
            {
              exclude: ['transform-typeof-symbol'],
              targets: {
                browsers: [
                  'last 2 versions',
                  '> 5%',
                ],
              },
            },
          ],
          '@babel/flow',
          '@babel/react',
        ],
      }),
      terser(),
    ],
  },
];
