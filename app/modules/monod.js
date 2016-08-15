import Immutable from 'immutable';
import request from 'superagent';

import Document from '../Document';
import { Errors, decrypt } from '../utils';
import {
  loadDefault,
  loadSuccess,
  notFound,
  decryptionFailed,
  serverUnreachable,
} from './documents';


// Actions
export const IS_ONLINE = 'monod/IS_ONLINE';
export const IS_OFFLINE = 'monod/IS_OFFLINE';

// Action Creators
export function isOnline() {
  return { type: IS_ONLINE };
}

export function isOffline() {
  return { type: IS_OFFLINE };
}

// Reducer
const initialState = {
  offline: true,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case IS_ONLINE:
      return { offline: false };

    case IS_OFFLINE:
      return { offline: true };

    default: return state;
  }
}

/**
 * An action creator that loads a document based on its id, and a secret key to
 * decrypt it. It looks into the local database first, and calls the API if the
 * local database does not return anything.
 */
export function load(id, secret) {
  return (dispatch, getState, { db }) => {
    if (!id) {
      dispatch(loadDefault());

      return Promise.resolve();
    }

    return db
      .getItem(id)
      .then((document) => {
        if (null === document) {
          return Promise.reject(Errors.NOT_FOUND);
        }

        return Promise.resolve(new Document(Immutable.fromJS(document)));
      })
      .catch(() => request
        .get(`/documents/${id}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .then((res) => {
          dispatch(isOnline());

          return Promise.resolve(new Document({
            uuid: res.body.uuid,
            content: res.body.content,
            last_modified: res.body.last_modified,
            template: res.body.template || '', // avoid BC break
          }));
        })
        .catch((err) => {
          if (err.response && 404 === err.response.statusCode) {
            return Promise.reject(Errors.NOT_FOUND);
          }

          dispatch(isOffline());

          return Promise.reject(Errors.SERVER_UNREACHABLE);
        })
      )
      .then((document) => {
        const decryptedContent = decrypt(document.get('content'), secret);

        if (null === decryptedContent) {
          return Promise.reject(Errors.DECRYPTION_FAILED);
        }

        dispatch(loadSuccess(document.set('content', decryptedContent), secret));
      })
      .catch((err) => {
        switch (err) {
          case Errors.NOT_FOUND:
            dispatch(notFound());
            break;

          case Errors.SERVER_UNREACHABLE:
            dispatch(serverUnreachable());
            break;

          case Errors.DECRYPTION_FAILED:
            dispatch(decryptionFailed());
            break;

          default: // well...
        }
      });
  };
}
