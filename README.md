[![Version](https://img.shields.io/npm/v/react-store-context-hooks)](https://bit.ly/3CrKTGs)
[![Downloads](https://img.shields.io/npm/dt/react-store-context-hooks)](https://bit.ly/3CrKTGs)
<!---
[![Dependency Status](https://img.shields.io/david/rickypc/react-store-context-hooks)](https://bit.ly/2XIejB8)
[![Dev Dependency Status](https://img.shields.io/david/dev/rickypc/react-store-context-hooks)](https://bit.ly/3mbPI1a)
-->
[![Code Style](https://img.shields.io/badge/code%20style-Airbnb-red)](https://bit.ly/2JYN1gk)
[![Build](https://img.shields.io/github/workflow/status/rickypc/react-store-context-hooks/Validations)](https://bit.ly/2XL1lCJ)
[![Coverage](https://img.shields.io/codecov/c/github/rickypc/react-store-context-hooks)](https://bit.ly/3bd4kam)
[![Vulnerability](https://img.shields.io/snyk/vulnerabilities/github/rickypc/react-store-context-hooks)](https://bit.ly/3bhs0Kp)
<!---
[![Dependabot](https://api.dependabot.com/badges/status?host=github&repo=rickypc/react-store-context-hooks)](https://bit.ly/2KIM5vs)
-->
[![License](https://img.shields.io/npm/l/react-store-context-hooks)](https://mzl.la/2vLmCye)

React Store Context Hooks
=========================

Provides various data store hooks that allow functional components within
the same React Context to share the application state.

CDN Link
-
```html
<script crossorigin src="https://unpkg.com/react-store-context-hook/index.umd.js"></script>
```

Node.js Installation
-

```bash
$ yarn add react-store-context-hooks
# or
$ npm install --save react-store-context-hooks
```

API Reference
-
Provides various data store hooks that allow functional components within
the same React Context to share the application state.

**Requires**: <code>module:react</code>  

* [react-store-context-hooks](#module_react-store-context-hooks)
    * [.isEmpty(value)](#module_react-store-context-hooks.isEmpty) ⇒ <code>boolean</code>
    * [.useStore(key, defaultValue)](#module_react-store-context-hooks.useStore) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
    * [.useStores()](#module_react-store-context-hooks.useStores) ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
    * [.withStores(Component)](#module_react-store-context-hooks.withStores) ⇒ <code>React.ComponentType</code>

<a name="module_react-store-context-hooks.isEmpty"></a>

### react-store-context-hooks.isEmpty(value) ⇒ <code>boolean</code>
A data store hook that allows a functional component to validate given value
emptiness.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>boolean</code> - Value emptiness flag.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>mixed</code> | The value to be checked for emptiness. |

**Example**  
```js
let flag = isEmpty('');
// flag = true.
flag = isEmpty('value');
// flag = false.
```
<a name="module_react-store-context-hooks.useStore"></a>

### react-store-context-hooks.useStore(key, defaultValue) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
A data store hook that allows any components within the same React Context
to share the application state.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code> - Store value, update, and remove callbacks.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The store key. |
| defaultValue | <code>mixed</code> | The store default value. |

**Example**  
```js
const [store, setStore, delStore] = useStore('key', 'default');
// store = 'default'.

setStore('value');
// store = 'value'.

delStore();
// store = 'default'.
```
<a name="module_react-store-context-hooks.useStores"></a>

### react-store-context-hooks.useStores() ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
A data store hook that allows a functional component to update multiple
stores at once and share the application state with any components within
the same React Context.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Object.&lt;{setStores: function(data): void}&gt;</code> - Multiple stores update callback.  
**Example**  
```js
const [store1] = useStore('key1');
const [store2] = useStore('key2');

const { setStores } = useStores();

setStore({
  key1: 'value1',
  key2: 'value2',
});
// store1 = 'value1'.
// store2 = 'value2'.
```
<a name="module_react-store-context-hooks.withStores"></a>

### react-store-context-hooks.withStores(Component) ⇒ <code>React.ComponentType</code>
A data store hook that wraps a component with a store context provider.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>React.ComponentType</code> - The wrapped component with store provider.  

| Param | Type | Description |
| --- | --- | --- |
| Component | <code>React.ComponentType</code> | The component to be wrapped with the store provider. |

**Example**  
```js
const ComponentWithStore = withStore(Component);
return <ComponentWithStore {...props} />;
```

Development Dependencies
-
You will need to install [Node.js](https://bit.ly/2SMCGXK) as a local
development dependency. The `npm` package manager comes bundled with all
recent releases of `Node.js`. You can also use [yarn](https://bit.ly/3nmWS1K)
as a package manager.

`yarn` or `npm install` will attempt to resolve any `npm` module dependencies
that have been declared in the project’s `package.json` file, installing them
into the `node_modules` folder.

```bash
$ yarn
# or
$ npm install
```

Run Benchmark, Flow, Leak, Lint, and Unit Tests
-
To make sure we did not break anything, let's run all the tests:

```bash
$ yarn test
# or
$ npm run test:lint; npm run test:flow; npm run test:unit; npm run test:bench; npm run test:leak
```

Run benchmark tests only:

```bash
$ yarn test:bench
# or
$ npm run test:bench
```

Run static type tests only:

```bash
$ yarn test:flow
# or
$ npm run test:flow
```

Run leak tests only:

```bash
$ yarn test:leak
# or
$ npm run test:leak
```

Run lint tests only:

```bash
$ yarn test:lint
# or
$ npm run test:lint
```

Run unit tests only:

```bash
$ yarn test:unit
# or
$ npm run test:unit
```

Run Budles, Documentation, and Typescript definition Builds
-
To generate distribution bundles, documentation, and Typescript definition, run:

```bash
$ yarn build
# or
$ npm run build:docs; npm run build:bundles; npm run build:ts
```

Run bundles build only:

```bash
$ yarn build:bundles
# or
$ npm run build:bundles
```

Run documentation build only:

```bash
$ yarn build:docs
# or
$ npm run build:docs
```

Run Typescript definition build only:

```bash
$ yarn build:ts
# or
$ npm run build:ts
```

Contributing
-
If you would like to contribute code to React Store Context Hooks repository,
you can do so through GitHub by forking the repository and sending a pull request.

If you do not agree to [Contribution Agreement](CONTRIBUTING.md), do not
contribute any code to React Store Context Hooks repository.

When submitting code, please make every effort to follow existing conventions
and style in order to keep the code as readable as possible. Please also include
appropriate test cases.

That's it! Thank you for your contribution!

License
-
Copyright (c) 2019 - 2021 Richard Huang.

This utility is free software, licensed under: [Mozilla Public License (MPL-2.0)](https://mzl.la/2vLmCye).

Documentation and other similar content are provided under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://bit.ly/2SMCRlS).
