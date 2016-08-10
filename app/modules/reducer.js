import { combineReducers } from 'redux';

import monod from './monod';
import documents from './documents';


export default combineReducers({
  app: monod,
  documents,
});
