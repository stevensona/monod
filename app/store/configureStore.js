/* eslint global-require: 0 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createDebounce from 'redux-debounced';
import rootReducer from '../modules/reducer';

const middlewares = [thunk];

if ('production' !== process.env.NODE_ENV) {
  const createLogger = require('redux-logger');

  middlewares.push(createLogger());
}

middlewares.push(createDebounce());

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(
    rootReducer,
    initialState,
    window.devToolsExtension && window.devToolsExtension()
  );
}
