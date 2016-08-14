/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import uuid from 'uuid';
import request from 'superagent';

import db from '../db';
import { encrypt, decrypt, newSecret } from '../utils';
import { serverPersist } from './persistence';
import Document from '../Document';

import { isOnline, isOffline } from './monod';
import {
  loadSucess,
  updateCurrentDocument,
  decryptionFailed,
  notFound,
} from './documents';
import { warning } from './notification';


// Actions
const SYNCHRONIZE = 'monod/sync/SYNCHRONIZE';
const SYNCHRONIZE_SUCCESS = 'monod/sync/SYNCHRONIZE_SUCCESS';

// Action Creators
export function synchronize() { // eslint-disable-line import/prefer-default-export
  const thunk = (dispatch, getState) => {
    dispatch({ type: SYNCHRONIZE });

    const document = getState().documents.current;
    const secret = getState().documents.secret;

    if (document.isNew()) {
      dispatch({ type: SYNCHRONIZE_SUCCESS });

      return;
    }

    if (document.hasNeverBeenSync()) {
      dispatch(serverPersist());
      dispatch({ type: SYNCHRONIZE_SUCCESS });

      return;
    }

    request
      .get(`/documents/${document.get('uuid')}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .then((res) => {
        dispatch(isOnline());

        return Promise.resolve(res);
      })
      .catch((err) => {
        if (err.response && 404 === err.response.statusCode) {
          dispatch(notFound());

          return Promise.reject(new Error('document not found'));
        }

        dispatch(isOffline());

        return Promise.reject(new Error('request failed (network)'));
      })
      .then((res) => {
        const serverDoc = new Document({
          uuid: res.body.uuid,
          content: res.body.content,
          last_modified: res.body.last_modified,
          template: res.body.template || '',
        });

        if (serverDoc.get('last_modified') === document.get('last_modified')) {
          // here, document on the server has not been updated, so we can
          // probably push safely
          if (serverDoc.get('last_modified') < document.get('last_modified_locally')) {
            dispatch(serverPersist());

            return;
          }

          return;
        }

        // In theory, it should never happened, but... what happens if:
        // localDoc.get('last_modified') > serverDoc.get('last_modified') ?
        if (serverDoc.get('last_modified') > document.get('last_modified')) {
          if (document.hasNoLocalChanges()) {
            const decryptedContent = decrypt(serverDoc.get('content'), secret);

            if (null === decryptedContent) {
              dispatch(decryptionFailed());

              return;
            }

            dispatch(updateCurrentDocument(
              serverDoc.set('content', decryptedContent)
            ));

            return;
          }

          // someone modified my document!
          // ... but I also modified it so... let's fork \o/

          // generate a new secret for fork'ed document

          const forkSecret = newSecret();

          // what we want is to create a fork
          const fork = new Document({
            uuid: uuid.v4(),
            content: document.get('content'),
            template: document.get('template'),
          });

          // persist fork'ed document
          db.setItem(
            fork.get('uuid'),
            new Document({
              uuid: fork.get('uuid'),
              content: encrypt(document.get('content'), forkSecret),
              template: fork.get('template'),
            }).toJS()
          )
          .then(() => {
            // now, we can update the former doc with server content
            const former = new Document({
              uuid: serverDoc.get('uuid'),
              content: serverDoc.get('content'),
              last_modified: serverDoc.get('last_modified'),
              template: serverDoc.get('template'),
            });

            db.setItem(
              former.get('uuid'),
              former.toJS()
            )
            .then(() => {
              dispatch(warning(
                (<span>
                  <i>Snap!</i>&nbsp;
                  The document you were working on has been updated by a
                  third, and you are now working on a <strong>fork</strong>.
                  You can still find the original (and updated) document:&nbsp;
                  <a href={`/${former.uuid}#${secret}`}>here</a>.
                </span>)
              ));

              dispatch(loadSucess(fork, forkSecret));
            });
          });
        }
      });
  };

  return thunk;
}
