import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

let appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');

require('offline-plugin/runtime').install();
ReactDOM.render(<App version={appVersion} />, appElement);
