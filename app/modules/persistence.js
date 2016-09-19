import request from 'superagent';

import config from '../config';
import Document from '../Document';
import { Errors, encrypt, decrypt } from '../utils';
import { isOnline, isOffline } from './monod';
import {
  updateCurrentDocument,
  forceUpdateCurrentDocument,
} from './documents';
import { warning } from './notification';


// Actions
export const LOCAL_PERSIST = 'monod/persistence/LOCAL_PERSIST';
export const LOCAL_PERSIST_SUCCESS = 'monod/persistence/LOCAL_PERSIST_SUCCESS';
export const SERVER_PERSIST = 'monod/persistence/SERVER_PERSIST';
export const SERVER_PERSIST_SUCCESS = 'monod/persistence/SERVER_PERSIST_SUCCESS';
export const SERVER_PERSIST_ERROR = 'monod/persistence/SERVER_PERSIST_ERROR';

// Action Creators
export function localPersist() {
  const thunk = (dispatch, getState, { db }) => {
    dispatch({ type: LOCAL_PERSIST });

    const document = getState().documents.current;
    const secret = getState().documents.secret;

    const encrypted = document.set(
      'content', encrypt(document.get('content'), secret)
    );

    return db
      .setItem(encrypted.get('uuid'), encrypted.toJS())
      .then(() => {
        dispatch({ type: LOCAL_PERSIST_SUCCESS });

        return Promise.resolve();
      });
  };

  thunk.meta = {
    debounce: {
      time: config.LOCAL_PERSIST_DEBOUNCE_TIME,
      key: LOCAL_PERSIST,
    },
  };

  return thunk;
}

export function serverPersist() {
  const thunk = (dispatch, getState, { db }) => {
    dispatch({ type: SERVER_PERSIST });

    const document = getState().documents.current;
    const secret = getState().documents.secret;

    const id = document.get('uuid');
    const content = document.get('content');

    return request
      .put(`/documents/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        content: encrypt(content, secret),
        template: document.get('template'),
      })
      .then((res) => {
        dispatch(isOnline());

        const current = new Document({
          uuid: id,
          content,
          last_modified: res.body.last_modified,
          last_modified_locally: null,
          template: res.body.template || '',
        });

        return Promise.resolve(current);
      })
      .then((current) => {
        dispatch(updateCurrentDocument(current));

        const encrypted = current.set(
          'content', encrypt(current.get('content'), secret)
        );

        return db.setItem(encrypted.get('uuid'), encrypted.toJS());
      })
      .then(() => {
        dispatch({ type: SERVER_PERSIST_SUCCESS });

        return Promise.resolve();
      })
      .catch((error) => {
        if (!error.response) {
          dispatch(isOffline());
        }

        if (403 === error.status) {
          const res = error.response;
          const current = new Document({
            uuid: id,
            content: decrypt(res.body.content, secret),
            last_modified: res.body.last_modified,
            last_modified_locally: null,
            template: res.body.template || '',
          });

          dispatch(warning(config.READONLY_MESSAGE));
          dispatch(forceUpdateCurrentDocument(current));

          const encrypted = current.set('content', res.body.content);

          return db.setItem(encrypted.get('uuid'), encrypted.toJS());
        }

        // TODO: maybe handle this case
        dispatch({ type: SERVER_PERSIST_ERROR, error });

        return Promise.reject(Errors.SERVER_UNREACHABLE);
      });
  };

  return thunk;
}
