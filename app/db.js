import localforage from 'localforage';
import config from './config';

const db = localforage.createInstance({
  name: config.APP_NAME,
  storeName: config.DOCUMENTS_STORE,
});

export default db;
