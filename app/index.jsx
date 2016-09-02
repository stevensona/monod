import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import './scss/main.scss';

import App from './components/App';
import configureStore from './store/configureStore';
import { load } from './modules/monod';

const appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');

const store = configureStore();

store.dispatch(load(
  window.location.pathname.slice(1),
  window.location.hash.slice(1)
));

if ('production' === process.env.NODE_ENV) {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
  require('raven-js') // eslint-disable-line global-require
    .config('https://33eb806367954478b38b7dba7828bb54@app.getsentry.com/92503', {
      release: appVersion,
    })
    .install();
}

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <App version={appVersion} />
    </Provider>
  </AppContainer>,
  appElement
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default; // eslint-disable-line global-require

    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <NextApp version={appVersion} />
        </Provider>
      </AppContainer>,
      appElement
    );
  });
}
