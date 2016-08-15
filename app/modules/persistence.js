import request from 'superagent';

import { encrypt } from '../utils';
import Document from '../Document';
import { isOnline, isOffline } from './monod';
import { updateCurrentDocument } from './documents';


// Actions
export const LOCAL_PERSIST = 'monod/persistence/LOCAL_PERSIST';
export const LOCAL_PERSIST_SUCCESS = 'monod/persistence/LOCAL_PERSIST_SUCCESS';
export const SERVER_PERSIST = 'monod/persistence/SERVER_PERSIST';
export const SERVER_PERSIST_SUCCESS = 'monod/persistence/SERVER_PERSIST_SUCCESS';
export const SERVER_PERSIST_ERROR = 'monod/persistence/SERVER_PERSIST_ERROR';

// Action Creators
export function serverPersist() {
  const thunk = (dispatch, getState) => {
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

        dispatch(updateCurrentDocument(current));

        dispatch({ type: SERVER_PERSIST_SUCCESS });
      })
      .catch((err) => {
        if (!err.response) {
          dispatch(isOffline());
        }

        // TODO: maybe handle this case
        dispatch({ type: SERVER_PERSIST_ERROR });
      });
  };

  return thunk;
}

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
      .then(() => dispatch({ type: LOCAL_PERSIST_SUCCESS }));
  };

  thunk.meta = {
    debounce: {
      time: 1000,
      key: LOCAL_PERSIST,
    },
  };

  return thunk;
}
