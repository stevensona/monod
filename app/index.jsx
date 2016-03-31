import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

import { EventEmitter } from 'events';
import Store from './Store';
import Controller from './Controller';

const appElement  = document.getElementById('app');
const appVersion  = appElement.getAttribute('data-app-version');
const apiEndpoint = appElement.getAttribute('data-api-endpoint');

const events     = new EventEmitter();
const store      = new Store('documents', events, apiEndpoint);
const controller = new Controller({ store }, events);

require('offline-plugin/runtime').install();
ReactDOM.render(<App version={appVersion} controller={controller} />, appElement);
