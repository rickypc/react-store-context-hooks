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

Provides various data store hooks that allow functional components to share
the application state within the same React Context or different React Context
using persistent storage.

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
Provides various data store hooks that allow functional components to share
the application state within the same React Context or different
React Context using persistent storage.

**Requires**: <code>module:react</code>  
**Example** *(Within the same React Context)*  
```js
import { isEmpty, useStore, useStores, withStore } from 'react-store-context-hooks';
import { render } from 'react-dom';
import { useEffect } from 'react';

const ComponentA = () => {
  const [value, setValue, delValue] = useStore('key');

  useEffect(() => {
    if (isEmpty(value)) {
      setValue({ key: {
        nested: 'value-from-A',
      } });
    }
    return () => delValue();
  }, []);

  return <>{JSON.stringify(value)}</>;
};

const ComponentB = () => {
  const [value, setValue, delValue] = useStore('key');

  useEffect(() => {
    if (isEmpty(value)) {
      setValue({ key: {
        nested: 'value-from-B',
      } });
    }
    return () => delValue();
  }, []);

  return <>{JSON.stringify(value)}</>;
};

const App = withStore(() => {
  const { setStores } = useStores();

  useEffect(() => {
    setStores({
      key: {
        nested: 'value',
      },
    });
  }, []);

  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
});

render(<App />, document.querySelector('#root'));
```
**Example** *(Different React Context with localStorage)*  
```js
import { render } from 'react-dom';
import { useEffect } from 'react';
import { useLocalStore, useLocalStores }  from 'react-store-context-hooks';

const ComponentA = () => {
  const { setStores } = useLocalStores();

  useEffect(() => {
    setStores({
      key: 'value',
    });
  }, []);

  return null;
};

const ComponentB = () => {
  const [value] = useLocalStore('key');
  return <>{JSON.stringify(value)}</>;
};

const ComponentC = () => {
  const [value] = useLocalStore('key');
  return <>{JSON.stringify(value)}</>;
};

render(<><ComponentA /><ComponentB /><ComponentC /></>, document.querySelector('#root'));
```
**Example** *(Different React Context with sessionStorage)*  
```js
import { render } from 'react-dom';
import { useEffect } from 'react';
import { useSessionStore, useSessionStores }  from 'react-store-context-hooks';

const ComponentA = () => {
  const { setStores } = useSessionStores();

  useEffect(() => {
    setStores({
      key: 'value',
    });
  }, []);

  return null;
};

const ComponentB = () => {
  const [value] = useSessionStore('key');
  return <>{JSON.stringify(value)}</>;
};

const ComponentC = () => {
  const [value] = useSessionStore('key');
  return <>{JSON.stringify(value)}</>;
};

render(<><ComponentA /><ComponentB /><ComponentC /></>, document.querySelector('#root'));
```

* [react-store-context-hooks](#module_react-store-context-hooks)
    * [.isEmpty(value)](#module_react-store-context-hooks.isEmpty) ⇒ <code>boolean</code>
    * [.useLocalStore(key, defaultValue)](#module_react-store-context-hooks.useLocalStore) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
    * [.useLocalStores()](#module_react-store-context-hooks.useLocalStores) ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
    * [.useSessionStore(key, defaultValue)](#module_react-store-context-hooks.useSessionStore) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
    * [.useSessionStores()](#module_react-store-context-hooks.useSessionStores) ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
    * [.useStore(key, defaultValue, persistence)](#module_react-store-context-hooks.useStore) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
    * [.useStores(persistence)](#module_react-store-context-hooks.useStores) ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
    * [.withStores(Component)](#module_react-store-context-hooks.withStores) ⇒ <code>React.ComponentType</code>

<a name="module_react-store-context-hooks.isEmpty"></a>

### react-store-context-hooks.isEmpty(value) ⇒ <code>boolean</code>
A data store hook allows a functional component to validate given value
emptiness.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>boolean</code> - Value emptiness flag.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>mixed</code> | The value to be checked for emptiness. |

**Example**  
```js
import { isEmpty } from 'react-store-context-hooks';

let flag = isEmpty('');
// flag = true
flag = isEmpty('value');
// flag = false
```
<a name="module_react-store-context-hooks.useLocalStore"></a>

### react-store-context-hooks.useLocalStore(key, defaultValue) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
A data store hook allows any components on different React Context to share
the application state using localStorage as the persistent storage.

The mutator will persist the value with JSON string format in the
persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code> - Store value, update, and remove callbacks.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The store key. |
| defaultValue | <code>mixed</code> | The store default value. |

**Example**  
```js
import { useEffect } from 'react';
import { useLocalStore }  from 'react-store-context-hooks';

// Simulate an existing value
localStorage.setItem('key', JSON.stringify('local-default'));

const ComponentA = () => {
  const [value, setValue, delValue] = useLocalStore('key', 'default');
  // value = 'local-default'
  // localStorage.getItem('key') = '"local-default"'

  useEffect(() => {
    setValue('value');
    // value = 'value'
    // localStorage.getItem('key') = '"value"'

    return () => {
      delValue();
      // value = 'default'
      // localStorage.getItem('key') = null
    };
  }, []);

  return null;
};

const ComponentB = () => {
  const [value] = useLocalStore('key');
  // value = 'local-default'
  // localStorage.getItem('key') = '"local-default"'

  // After ComponentA setValue('value');
  // value = 'value'
  // localStorage.getItem('key') = '"value"'

  // After ComponentA delValue();
  // value = undefined
  // localStorage.getItem('key') = null

  return null;
};
```
<a name="module_react-store-context-hooks.useLocalStores"></a>

### react-store-context-hooks.useLocalStores() ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
A data store hook allows any components on different React Context to update
multiple stores at once and share the application state using localStorage as
the persistent storage.

The mutator will persist the values with JSON string format in the
persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Object.&lt;{setStores: function(data): void}&gt;</code> - Multiple stores update callback.  
**Example**  
```js
import { useEffect } from 'react';
import { useLocalStore, useLocalStores }  from 'react-store-context-hooks';

const ComponentA = () => {
  const { setStores } = useLocalStores();

  useEffect(() => {
    setStores({
      key1: 'value1',
      key2: {
        nested: 'value',
      },
    });
  }, []);

  return null;
};

const ComponentB = () => {
  const [value1] = useLocalStore('key1');
  const [value2] = useLocalStore('key2');

  // value1 = 'value1'
  // value2 = {
  //   nested: 'value',
  // }
  // localStorage.getItem('key1') = '"value1"'
  // localStorage.getItem('key2') = '{"nested":"value"}'

  return <>{JSON.stringify({ value1, value2 })}</>;
};
```
<a name="module_react-store-context-hooks.useSessionStore"></a>

### react-store-context-hooks.useSessionStore(key, defaultValue) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
A data store hook allows any components on different React Context to share
the application state using sessionStorage as the persistent storage.

The mutator will persist the value with JSON string format in the
persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code> - Store value, update, and remove callbacks.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The store key. |
| defaultValue | <code>mixed</code> | The store default value. |

**Example**  
```js
import { useEffect } from 'react';
import { useSessionStore }  from 'react-store-context-hooks';

// Simulate an existing value
sessionStorage.setItem('key', JSON.stringify('session-default'));

const ComponentA = () => {
  const [value, setValue, delValue] = useSessionStore('key', 'default');
  // value = 'session-default'
  // sessionStorage.getItem('key') = '"session-default"'

  useEffect(() => {
    setValue('value');
    // value = 'value'
    // sessionStorage.getItem('key') = '"value"'

    return () => {
      delValue();
      // value = 'default'
      // sessionStorage.getItem('key') = null
    };
  }, []);

  return null;
};

const ComponentB = () => {
  const [value] = useSessionStore('key');
  // value = 'session-default'
  // sessionStorage.getItem('key') = '"session-default"'

  // After ComponentA setValue('value');
  // value = 'value'
  // sessionStorage.getItem('key') = '"value"'

  // After ComponentA delValue();
  // value = undefined
  // sessionStorage.getItem('key') = null

  return null;
};
```
<a name="module_react-store-context-hooks.useSessionStores"></a>

### react-store-context-hooks.useSessionStores() ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
A data store hook allows any components on different React Context to update
multiple stores at once and share the application state using sessionStorage
as the persistent storage.

The mutator will persist the values with JSON string format in the
persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Object.&lt;{setStores: function(data): void}&gt;</code> - Multiple stores update callback.  
**Example**  
```js
import { useEffect } from 'react';
import { useSessionStore, useSessionStores }  from 'react-store-context-hooks';

const ComponentA = () => {
  const { setStores } = useSessionStores();

  useEffect(() => {
    setStores({
      key1: 'value1',
      key2: {
        nested: 'value',
      },
    });
  }, []);

  return null;
};

const ComponentB = () => {
  const [value1] = useSessionStore('key1');
  const [value2] = useSessionStore('key2');

  // value1 = 'value1'
  // value2 = {
  //   nested: 'value',
  // }
  // sessionStorage.getItem('key1') = '"value1"'
  // sessionStorage.getItem('key2') = '{"nested":"value"}'

  return <>{JSON.stringify({ value1, value2 })}</>;
};
```
<a name="module_react-store-context-hooks.useStore"></a>

### react-store-context-hooks.useStore(key, defaultValue, persistence) ⇒ <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code>
A data store hook allows any components within the same React Context
to share the application state.

The accessor will validate the value in the data store first before
accessing the given persistent storage. If both data store
and persistent storage values are empty, it will use the default value.

The mutators will persist the value with JSON string format
in the persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Array.&lt;mixed, function(value): void, function(): void&gt;</code> - Store value, update, and remove callbacks.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | The store key. |
| defaultValue | <code>mixed</code> | The store default value. |
| persistence | <code>Storage</code> | The data persistence choices: localStorage, sessionStorage. |

**Example** *(Without persistent storage)*  
```js
import { useEffect } from 'react';
import { useStore }  from 'react-store-context-hooks';

const Component = () => {
  const [value, setValue, delValue] = useStore('key', 'default');
  // value = 'default'

  useEffect(() => {
    setValue('value');
    // value = 'value'

    return () => {
      delValue();
      // value = 'default'
    };
  }, []);

  return null;
};
```
**Example** *(With localStorage)*  
```js
import { useEffect } from 'react';
import { useStore }  from 'react-store-context-hooks';

// Simulate an existing value
localStorage.setItem('key', JSON.stringify('local-default'));

const Component = () => {
  const [value, setValue, delValue] = useStore('key', 'default', localStorage);
  // value = 'local-default'
  // localStorage.getItem('key') = '"local-default"'

  useEffect(() => {
    setValue('value');
    // value = 'value'
    // localStorage.getItem('key') = '"value"'

    return () => {
      delValue();
      // value = 'default'
      // localStorage.getItem('key') = null
    };
  }, []);

  return null;
};
```
**Example** *(With sessionStorage)*  
```js
import { useEffect } from 'react';
import { useStore }  from 'react-store-context-hooks';

// Simulate an existing value
sessionStorage.setItem('key', JSON.stringify('session-default'));

const Component = () => {
  const [value, setValue, delValue] = useStore('key', 'default', sessionStorage);
  // value = 'session-default'
  // sessionStorage.getItem('key') = '"session-default"'

  useEffect(() => {
    setValue('value');
    // value = 'value'
    // sessionStorage.getItem('key') = '"value"'

    return () => {
      delValue();
      // value = 'default'
      // sessionStorage.getItem('key') = null
    };
  }, []);

  return null;
};
```
<a name="module_react-store-context-hooks.useStores"></a>

### react-store-context-hooks.useStores(persistence) ⇒ <code>Object.&lt;{setStores: function(data): void}&gt;</code>
A data store hook allows a functional component to update multiple stores
at once and share the application state with any components within
the same React Context.

The mutator will persist the values with JSON string format
in the persistent storage.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>Object.&lt;{setStores: function(data): void}&gt;</code> - Multiple stores update callback.  

| Param | Type | Description |
| --- | --- | --- |
| persistence | <code>Storage</code> | The data persistence choices: localStorage, sessionStorage. |

**Example** *(Without persistent storage)*  
```js
import { useEffect } from 'react';
import { useStore, useStores }  from 'react-store-context-hooks';

const Component = () => {
  const [value1] = useStore('key1');
  const [value2] = useStore('key2');
  const { setStores } = useStores();

  useEffect(() => {
    setStores({
      key1: 'value1',
      key2: {
        nested: 'value',
      },
    });
  }, []);

  // value1 = 'value1'
  // value2 = {
  //   nested: 'value',
  // }

  return <>{JSON.stringify({ value1, value2 })}</>;
};
```
**Example** *(With localStorage)*  
```js
import { useEffect } from 'react';
import { useStore, useStores }  from 'react-store-context-hooks';

const Component = () => {
  const [value1] = useStore('key1', undefined, localStorage);
  const [value2] = useStore('key2', undefined, localStorage);
  const { setStores } = useStores(localStorage);

  useEffect(() => {
    setStores({
      key1: 'value1',
      key2: {
        nested: 'value',
      },
    });
  }, []);

  // value1 = 'value1'
  // value2 = {
  //   nested: 'value',
  // }
  // localStorage.getItem('key1') = '"value1"'
  // localStorage.getItem('key2') = '{"nested":"value"}'

  return <>{JSON.stringify({ value1, value2 })}</>;
};
```
**Example** *(With sessionStorage)*  
```js
import { useEffect } from 'react';
import { useStore, useStores }  from 'react-store-context-hooks';

const Component = () => {
  const [value1] = useStore('key1', undefined, sessionStorage);
  const [value2] = useStore('key2', undefined, sessionStorage);
  const { setStores } = useStores(sessionStorage);

  useEffect(() => {
    setStores({
      key1: 'value1',
      key2: {
        nested: 'value',
      },
    });
  }, []);

  // value1 = 'value1'
  // value2 = {
  //   nested: 'value',
  // }
  // sessionStorage.getItem('key1') = '"value1"'
  // sessionStorage.getItem('key2') = '{"nested":"value"}'

  return <>{JSON.stringify({ value1, value2 })}</>;
};
```
<a name="module_react-store-context-hooks.withStores"></a>

### react-store-context-hooks.withStores(Component) ⇒ <code>React.ComponentType</code>
A data store hook wraps a component with a store context provider.

**Kind**: static method of [<code>react-store-context-hooks</code>](#module_react-store-context-hooks)  
**Returns**: <code>React.ComponentType</code> - The wrapped component with store provider.  

| Param | Type | Description |
| --- | --- | --- |
| Component | <code>React.ComponentType</code> | The component to be wrapped with the store provider. |

**Example** *(Wrap an existing component)*  
```js
import { render }  from 'react-dom';
import { withStore }  from 'react-store-context-hooks';

const Component = (props) => {
  return <>{JSON.stringify(props)}</>;
};

const ComponentWithStore = withStore(Component);

render(<ComponentWithStore attr1="val1" attr2="val2" />, document.querySelector('#root'));
```
**Example** *(Wrap a component on-the-fly)*  
```js
import { render }  from 'react-dom';
import { withStore }  from 'react-store-context-hooks';

const ComponentWithStore = withStore((props) => {
  return <>{JSON.stringify(props)}</>;
});

render(<ComponentWithStore attr1="val1" attr2="val2" />, document.querySelector('#root'));
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
