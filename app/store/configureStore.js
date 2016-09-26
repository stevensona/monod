/* eslint global-require: 0 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createDebounce from 'redux-debounced';
import rootReducer from '../modules/reducer';
import db from '../db';

const middlewares = [
  createDebounce(),
  thunk.withExtraArgument({ db }),
];

if ('production' !== process.env.NODE_ENV) {
  const createLogger = require('redux-logger');

  middlewares.push(createLogger());
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(
    rootReducer,
    initialState,
    'production' !== process.env.NODE_ENV && 'undefined' !== typeof window &&
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );
}
