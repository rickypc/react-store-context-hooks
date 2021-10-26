// Use React development.
process.env.NODE_ENV = 'development';

// Dependencies.
const { act, render } = require('@testing-library/react');
const globalJsdom = require('global-jsdom');
// eslint-disable-next-line import/no-extraneous-dependencies,no-unused-vars
const JSDOM = require('jsdom');
const React = require('react');
// eslint-disable-next-line no-unused-vars
const ReactDOM = require('react-dom');

const {
  isEmpty,
  useStore,
  useStores,
  withStore,
} = require('react-store-context-hooks');

// eslint-disable-next-line no-console
['', 'value'].forEach((value) => console.log(`isEmpty('${value}') => ${isEmpty(value)}`));

const response = { renderedA: 0, renderedB: 0 };

const App = withStore(() => {
  response.setStores = useStores().setStores;
  return (
    <React.Fragment>
      <CompA />
      <CompB />
    </React.Fragment>
  );
});

const CompA = () => {
  response.renderedA += 1;
  [response.getA, response.setA, response.delA] = useStore('key');
  // eslint-disable-next-line no-console
  console.log(`Component A value => ${response.getA}`);
  return null;
};

const CompB = () => {
  response.renderedB += 1;
  [response.getB, response.setB, response.delB] = useStore('key', 'defaultB');
  // eslint-disable-next-line no-console
  console.log(`Component B value => ${response.getB}`);
  return null;
};

const cleanup = globalJsdom();
const { unmount } = render(<App />);

// useStores.setStores.
act(() => response.setStores({
  key: 'default',
}));

// useStore.set.
act(() => response.setA('set-from-A'));
act(() => response.setA('set-from-B'));

// useStore.del.
act(() => response.delA());
act(() => response.delB());

unmount();
cleanup();
