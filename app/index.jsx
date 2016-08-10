import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './scss/main.scss';

import App from './components/App.jsx';
import configureStore from './store/configureStore';

const appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');
const apiEndpoint = appElement.getAttribute('data-api-endpoint');

const store = configureStore();

//require('offline-plugin/runtime').install();
ReactDOM.render(
  <Provider store={store}>
    <App version={appVersion} controller={controller} />
  </Provider>,
  appElement
);
