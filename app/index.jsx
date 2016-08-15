import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import './scss/main.scss';

import App from './components/App';
import configureStore from './store/configureStore';
import db from '../db';
import { load } from './modules/monod';

const appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');

const store = configureStore();

store.dispatch(load(
  window.location.pathname.slice(1),
  window.location.hash.slice(1),
  db
));

// require('offline-plugin/runtime').install();

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
