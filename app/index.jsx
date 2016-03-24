import './scss/main.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

let appElement = document.getElementById('app');
const appVersion = appElement.getAttribute('data-app-version');

ReactDOM.render(<App version={appVersion} />, appElement);
