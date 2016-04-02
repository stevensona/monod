import uuid from 'uuid';
import sjcl from 'sjcl';
import request from 'superagent';
import Document from './Document';
import { Config } from './Config';
import Immutable from 'immutable';

const { Promise } = global;

export const Events = {
  NO_DOCUMENT_ID: 'store:no-document-id',
  DOCUMENT_NOT_FOUND: 'store:document-not-found',
  APP_IS_OFFLINE: 'store:app-is-offline',
  APP_IS_ONLINE: 'store:app-is-online',
  CHANGE: 'store:change',
  SYNCHRONIZE: 'store:synchronize',
  DECRYPTION_FAILED: 'store:decryption_failed',
  CONFLICT: 'store:conflict',
  UPDATE_WITHOUT_CONFLICT: 'store:update-without-conflict'
};

export default class Store {

  constructor(name, events, endpoint, localforage) {
    this.state = {
      // we automatically create a default document, but it might not be used
      document: new Document(),
      // we automatically generate a secret, but it might not be used
      secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0)
    };

    this.events      = events;
    this.endpoint    = endpoint;
    this.localforage = localforage;

    this.localforage.config({
      name: Config.APP_NAME,
      storeName: name
    });
  }

  /**
   * The aim of this method is to load a document by:
   *
   *   0. No ID => Events.NO_DOCUMENT_ID
   *   1. Looking into the local database first
   *     1.1. If it is not found => go to 2.
   *     1.2. If found, we attempt to decrypt it
   *       1.2.1 Decryption OK => document loaded + Events.CHANGE
   *       1.2.2 Decryption KO => Events.DECRYPTION_FAILED
   *   2. Fetch the document on the server
   *     2.1 Found => We attempt to decrypt it
   *       2.1.1 Decryption OK => document loaded + Events.CHANGE
   *       2.1.2 Decryption KO => Events.DECRYPTION_FAILED
   *     2.2 Not found => Events.DOCUMENT_NOT_FOUND
   *
   */
  findById(id, secret) {
    if (!id) {
      this.events.emit(Events.NO_DOCUMENT_ID, this.state);

      return Promise.reject('No document id');
    }

    return this
      .localforage
      .getItem(id)
      .then((document) => {
        if (null === document) {
          return Promise.reject('document not found');
        }

        return Promise.resolve(Immutable.fromJS(document));
      })
      .catch(() => {
        return request
          .get(`${this.endpoint}/documents/${id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .then((res) => {
            this.events.emit(Events.APP_IS_ONLINE);

            return Promise.resolve(new Document({
              uuid: res.body.uuid,
              content: res.body.content,
              last_modified: res.body.last_modified
            }));
          })
          .catch(this._handleRequestError.bind(this));
      })
      .then((document) => {
        return this
          .decrypt(document.get('content'), secret)
          .then((decryptedContent) => {
            this.state = {
              document: new Document({
                uuid: document.get('uuid'),
                content: decryptedContent,
                last_modified: document.get('last_modified'),
                last_modified_locally: document.get('last_modified_locally')
              }),
              secret: secret
            };

            this.events.emit(Events.CHANGE, this.state);

            this._localPersist();

            return this.state;
          });
      });
  }

  /**
   * This method is called when the document has been updated by the user
   */
  update(document) {
    // we don't want to store default content
    if (document.hasDefaultContent()) {
      return;
    }

    this.state = {
      document: new Document({
        uuid: document.get('uuid'),
        content: document.get('content'),
        last_modified: document.get('last_modified'),
        last_modified_locally: Date.now()
      }),
      secret: this.state.secret
    };

    this.events.emit(Events.CHANGE, this.state);

    this._localPersist();
  }

  /**
   * Synchronize current document between local and server databases
   */
  sync() {
    if (this.state.document.hasDefaultContent()) {
      return Promise.resolve('No need to sync');
    }

    // document is new
    if (this.state.document.isNew()) {
      return this._serverPersist();
    } else {
      return request
        .get(`${this.endpoint}/documents/${this.state.document.get('uuid')}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .then((res) => {
          this.events.emit(Events.APP_IS_ONLINE);

          return Promise.resolve(res);
        })
        .catch(this._handleRequestError.bind(this))
        .then((res) => {
          const localDoc  = this.state.document;
          const serverDoc = new Document({
            uuid: res.body.uuid,
            content: res.body.content,
            last_modified: res.body.last_modified
          });

          if (serverDoc.get('last_modified') === localDoc.get('last_modified')) {
            // here, document on the server has not been updated, so we can
            // probably push safely
            if (serverDoc.get('last_modified') < localDoc.get('last_modified_locally')) {
              return this._serverPersist();
            }

            return Promise.resolve('nothing to do');
          } else {
            // In theory, it should never happened, but... what happens if:
            // localDoc.get('last_modified') > serverDoc.get('last_modified') ?
            if (serverDoc.get('last_modified') > localDoc.get('last_modified')) {
              if (localDoc.hasNoLocalChanges()) {
                const secret = this.state.secret;

                return this
                  .decrypt(serverDoc.content, secret)
                  .then((decryptedContent) => {
                    this.state = {
                      document: new Document({
                        uuid: serverDoc.get('uuid'),
                        content: decryptedContent,
                        last_modified: serverDoc.get('last_modified')
                      }),
                      secret: secret
                    };

                    this.events.emit(Events.UPDATE_WITHOUT_CONFLICT, {
                      document: this.state.document
                    });
                  })
                  .then(() => {
                    return this._localPersist();
                  });
              } else {
                // someone fucking modified my document!
                // but I also modified it so... let's fork \o/

                // generate a new secret for fork'ed document
                const forkSecret = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0);

                // what we want is to create a fork
                return this
                  .encrypt(localDoc.content, forkSecret)
                  .then((encryptedContent) => {
                    const fork = new Document({
                      uuid: uuid.v4(),
                      content: localDoc.content
                    });

                    // persist fork'ed document
                    return this.localforage.setItem(
                      fork.get('uuid'),
                      new Document({
                        uuid: fork.get('uuid'),
                        content: encryptedContent
                      }).toJS()
                    )
                    .then(() => {
                      return Promise.resolve(fork);
                    });
                  })
                  .then((fork) => {
                    // now, we can update the former doc with server content
                    const former = new Document({
                      uuid: serverDoc.get('uuid'),
                      content: serverDoc.get('content'),
                      last_modified: serverDoc.get('last_modified')
                    });

                    return this
                      .localforage
                      .setItem(
                        former.get('uuid'),
                        former.toJS()
                      )
                      .then(() => {
                        const conflictState = {
                          fork: {
                            document: fork,
                            secret: forkSecret
                          },
                          document: former,
                          secret: this.state.secret
                        };

                        // state is now sync'ed with fork
                        this.state = {
                          document: fork,
                          secret: forkSecret
                        };

                        this.events.emit(Events.CONFLICT, conflictState);

                        return Promise.resolve(conflictState);
                      });
                  });
              }
            }
          }
        });
    }
  }

  // Pure / side-effect free method
  decrypt(content, secret) {
    try {
      return Promise.resolve(sjcl.decrypt(secret, content));
    } catch (e) {
      this.events.emit(Events.DECRYPTION_FAILED, this.state);

      return Promise.reject('decryption failed');
    }
  }

  // Pure / side-effect free method
  encrypt(content, secret) {
    return Promise.resolve(sjcl.encrypt(secret, content, { ks: 256 }));
  }

  // Impure / side-effect free method
  _localPersist() {
    const doc = this.state.document;
    const secret = this.state.secret;

    return this
      .encrypt(doc.get('content'), secret)
      .then((encryptedContent) => {
        return this.localforage.setItem(
          doc.get('uuid'),
          new Document({
            uuid: doc.get('uuid'),
            content: encryptedContent,
            last_modified: doc.get('last_modified'),
            last_modified_locally: doc.get('last_modified_locally')
          }).toJS()
        );
      })
      .then(() => {
        return Promise.resolve(this.state);
      });
  }

  // Impure / side-effect free method
  _serverPersist() {
    const doc = this.state.document;
    const secret = this.state.secret;

    return this
      .encrypt(doc.get('content'), secret)
      .then((encryptedContent) => {
        return request
          .put(`${this.endpoint}/documents/${doc.get('uuid')}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            content: encryptedContent
          })
          .then((res) => {
            this.events.emit(Events.APP_IS_ONLINE);

            return Promise.resolve(res);
          })
          .catch(this._handleRequestError.bind(this))
          .then((res) => {
            this.state = {
              document: new Document({
                uuid: doc.get('uuid'),
                content: doc.get('content'),
                last_modified: res.body.last_modified,
                last_modified_locally: null
              }),
              secret: secret
            };

            this.events.emit(Events.SYNCHRONIZE);

            return this._localPersist();
          });
      }
    );
  }

  _handleRequestError(err) {
    if (err.response && 404 === err.response.statusCode) {
      this.events.emit(Events.DOCUMENT_NOT_FOUND, this.state);

      return Promise.reject('document not found');
    }

    this.events.emit(Events.APP_IS_OFFLINE);

    return Promise.reject('request failed (network)');
  }
}
