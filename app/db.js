import localforage from 'localforage';
import config from './config';

const db = localforage.createInstance({
  name: config.APP_NAME,
  storeName: 'documents',
});

export default db;
