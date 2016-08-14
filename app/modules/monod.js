import Immutable from 'immutable';
import request from 'superagent';

import db from '../db';
import Document from '../Document';
import { decrypt } from '../utils';
import {
  loadDefault,
  loadSuccess,
  notFound,
  decryptionFailed,
} from './documents';


// Actions
const IS_ONLINE = 'monod/IS_ONLINE';
const IS_OFFLINE = 'monod/IS_OFFLINE';

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

export function load(id, secret) {
  return (dispatch) => {
    if (!id) {
      dispatch(loadDefault());

      return;
    }

    db
      .getItem(id)
      .then((document) => {
        if (null === document) {
          return Promise.reject(new Error('document not found'));
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
            dispatch(notFound());

            return Promise.reject(new Error('document not found'));
          }

          dispatch(isOffline());

          return Promise.reject(new Error('request failed (network)'));
        })
      )
      .then((document) => {
        const decryptedContent = decrypt(document.get('content'), secret);

        if (null === decryptedContent) {
          dispatch(decryptionFailed());

          return;
        }

        dispatch(loadSuccess(document.set('content', decryptedContent), secret));
      });
  };
}
