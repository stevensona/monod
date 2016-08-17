/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import uuid from 'uuid';
import request from 'superagent';

import config from '../config';
import Document from '../Document';
import { Errors, encrypt, decrypt, newSecret } from '../utils';
import { localPersist, serverPersist } from './persistence';
import { isOnline, isOffline } from './monod';
import {
  loadSuccess,
  forceUpdateCurrentDocument,
  decryptionFailed,
} from './documents';
import { info, warning } from './notification';


// Actions
export const SYNCHRONIZE = 'monod/sync/SYNCHRONIZE';
export const SYNCHRONIZE_SUCCESS = 'monod/sync/SYNCHRONIZE_SUCCESS';
export const SYNCHRONIZE_ERROR = 'monod/sync/SYNCHRONIZE_ERROR';
export const FORKING = 'monod/sync/FORKING';
export const NO_NEED_TO_SYNC = 'monod/sync/NO_NEED_TO_SYNC';

// Action Creators
export function synchronize() { // eslint-disable-line import/prefer-default-export
  const thunk = (dispatch, getState, { db }) => {
    dispatch({ type: SYNCHRONIZE });

    const document = getState().documents.current;
    const secret = getState().documents.secret;

    if (document.isDefault()) {
      dispatch({ type: NO_NEED_TO_SYNC });
      dispatch({ type: SYNCHRONIZE_SUCCESS });

      return Promise.resolve();
    }

    if (document.hasNeverBeenSync()) {
      return dispatch(
        serverPersist()
      )
      .then(() => {
        dispatch({ type: SYNCHRONIZE_SUCCESS });

        return Promise.resolve();
      })
      .catch((error) => {
        dispatch({ type: SYNCHRONIZE_ERROR, error });

        return Promise.resolve();
      });
    }

    return request
      .get(`/documents/${document.get('uuid')}`)
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
      .then((serverDoc) => {
        if (serverDoc.get('last_modified') === document.get('last_modified')) {
          // here, document on the server has not been updated, so we can
          // probably push safely
          if (serverDoc.get('last_modified') < document.get('last_modified_locally')) {
            return dispatch(serverPersist());
          }

          dispatch({ type: NO_NEED_TO_SYNC });

          return Promise.resolve();
        }

        if (serverDoc.get('last_modified') > document.get('last_modified')) {
          if (document.hasNoLocalChanges()) {
            const decryptedContent = decrypt(serverDoc.get('content'), secret);

            if (null === decryptedContent) {
              return Promise.reject(Errors.DECRYPTION_FAILED);
            }

            dispatch(forceUpdateCurrentDocument(
              serverDoc
                .set('content', decryptedContent)
                .set('last_modified_locally', null)
            ));

            dispatch(info(config.DOCUMENT_UPDATED_MESSAGE));

            return dispatch(localPersist());
          }

          // Oh noooo, someone modified my document!  ... but I also modified
          // it so...  let's fork it \o/
          dispatch({ type: FORKING });

          // generate a new secret for fork'ed document
          const forkSecret = newSecret();

          // what we want is to create a fork
          const fork = new Document({
            uuid: uuid.v4(),
            content: document.get('content'),
            template: document.get('template'),
          });

          // persist fork'ed document
          return db
            .setItem(
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

              return db
                .setItem(
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

                  dispatch(loadSuccess(fork, forkSecret));

                  return Promise.resolve();
                });
            });
        }

        // TODO: In theory, it should never happened, but... what happens if:
        // localDoc.get('last_modified') > serverDoc.get('last_modified')...?

        return Promise.resolve();
      })
      .then(() => {
        dispatch({ type: SYNCHRONIZE_SUCCESS });

        return Promise.resolve();
      })
      .catch((error) => {
        // TODO: maybe deal with these errors
        switch (error) {
          case Errors.DECRYPTION_FAILED:
            dispatch(decryptionFailed());
            break;

          default:
        }

        dispatch({ type: SYNCHRONIZE_ERROR, error });

        return Promise.resolve();
      });
  };

  return thunk;
}
