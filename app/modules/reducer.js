import { combineReducers } from 'redux';

import monod from './monod';
import documents from './documents';
import notification from './notification';


export default combineReducers({
  app: monod,
  documents,
  notification,
});
