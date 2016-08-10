import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';

import './scss/main.scss';

import App from './components/App';
import configureStore from './store/configureStore';

const appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');
const apiEndpoint = appElement.getAttribute('data-api-endpoint');

const store = configureStore();

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
    const NextApp = require('./components/App').default;
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
