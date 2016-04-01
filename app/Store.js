import uuid from 'uuid';
import sjcl from 'sjcl';
import request from 'superagent';

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
      document: {
        uuid: uuid.v4(),
        content: DEFAULT_CONTENT,
        last_modified: null, // defined by the server
        last_modified_locally: null
      },
      // we automatically generate a secret, but it might not be used
      secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0)
    };

    this.events      = events;
    this.endpoint    = endpoint;
    this.localforage = localforage;

    this.localforage.config({
      name: 'monod',
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

        return document;
      })
      .catch(() => {
        return request
          .get(`${this.endpoint}/documents/${id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .then((res) => {
            this.events.emit(Events.APP_IS_ONLINE);

            return Promise.resolve(res.body);
          })
          .catch((err) => {
            if (err.response && 404 === err.response.statusCode) {
              this.events.emit(Events.DOCUMENT_NOT_FOUND, this.state);

              return Promise.reject('document not found');
            }

            this.events.emit(Events.APP_IS_OFFLINE);

            return Promise.reject('request failed (network)');
          });
      })
      .then((document) => {
        return this
          .decrypt(document.content, secret)
          .then((content) => {
            document.content  = content;
            this.state.secret = secret;

            this._updateCurrentDocument(document);
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
    if (DEFAULT_CONTENT === document.content) {
      return;
    }

    document.last_modified_locally = Date.now();

    this._updateCurrentDocument(document);

    this._localPersist();
  }

  _updateCurrentDocument(document) {
    this.state.document = Object.assign({}, document);
    this.events.emit(Events.CHANGE, this.state);
  }

  sync() {
    if (DEFAULT_CONTENT === this.state.document.content) {
      return;
    }

    // document is new
    if (!this.state.document.last_modified) {
      this._serverPersist();
    } else {
      request
        .get(`${this.endpoint}/documents/${this.state.document.uuid}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          // `err` is not null if request fails (e.g., status code = 400),
          // but `res` if undefined when the request fails because of the
          // network.
          if (err) {
            if (!res) {
              this.events.emit(Events.APP_IS_OFFLINE);
            }

            return;
          }

          const serverDocument = res.body;
          const localDocument  = Object.assign({}, this.state.document);

          if (serverDocument.last_modified === localDocument.last_modified) {
            // here, document on the server has not been updated, so we can
            // probably push safely
            if (serverDocument.last_modified < localDocument.last_modified_locally) {
              this._serverPersist();
            }
          } else {
            if (serverDocument.last_modified > localDocument.last_modified) {
              if (
                !localDocument.last_modified_locally ||
                serverDocument.last_modified > localDocument.last_modified_locally
              ) {
                this
                  .decrypt(serverDocument.content, this.state.secret)
                  .then((content) => {
                    localDocument.content = content;

                    this._updateCurrentDocument(localDocument);

                    this.events.emit(Events.UPDATE_WITHOUT_CONFLICT, {
                      document: localDocument
                    });

                    this._localPersist();
                  });

                return;
              }

              // someone fucking modified my document!

              // generate a new secret for fork'ed document
              const secret = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0);

              // copy current document
              this
                .encrypt(localDocument.content, secret)
                .then((content) => {
                  const fork = Object.assign({}, localDocument);

                  fork.uuid = uuid.v4();
                  fork.content = content;
                  fork.last_modified = null;

                  // persist fork'ed document
                  this.localforage.setItem(fork.uuid, fork).then(() => {
                    // now, update current doc with server content if we
                    // are able to decrypt it
                    this
                      .decrypt(serverDocument.content, this.state.secret)
                      .then((content) => {
                        // update last_modified so that we are fully sync'ed
                        // with server now
                        this.state.document.last_modified = serverDocument.last_modified;

                        // we persist encrypted content
                        this.state.document.content = serverDocument.content;

                        // persist locally
                        this.localforage.setItem(
                          this.state.document.uuid,
                          this.state.document
                        ).then(() => {
                          // we deal with decrypted content
                          this.state.document.content = content;

                          this.events.emit(Events.CONFLICT, {
                            fork: {
                              document: fork,
                              secret: secret
                            },
                            document: this.state.document,
                            secret: this.state.secret
                          });
                        });
                      });
                    });
                });
            }
          }
        });
    }
  }

  decrypt(content, secret) {
    try {
      return Promise.resolve(sjcl.decrypt(secret, content));
    } catch (e) {
      this.events.emit(Events.DECRYPTION_FAILED, this.state);

      return Promise.reject('decryption failed');
    }
  }

  encrypt(content, secret) {
    return Promise.resolve(sjcl.encrypt(secret, content, { ks: 256 }));
  }

  _localPersist() {
    this
      .encrypt(this.state.document.content, this.state.secret)
      .then((content) => {
        const document = Object.assign({}, this.state.document);
        document.content = content;

        this.localforage.setItem(document.uuid, document);
      });
  }

  _serverPersist() {
    this
      .encrypt(this.state.document.content, this.state.secret)
      .then((content) => {
        const document = Object.assign({}, this.state.document);
        document.content = content;

        request
          .put(`${this.endpoint}/documents/${document.uuid}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({
            content: content
          })
          .end((err, res) => {
            if (err) {
              this.events.emit(Events.APP_IS_OFFLINE);

              return;
            }

            this.state.document.last_modified = res.body.last_modified;
            this._localPersist();

            this.events.emit(Events.SYNCHRONIZE, { date: new Date() });
            this.events.emit(Events.APP_IS_ONLINE);
          });
      }
    );
  }
}

const DEFAULT_CONTENT = [
  'Introducing Monod',
  '=================',
  '',
  '> **TL;DR** This editor is the first experiment we wanted to tackle at **Le lab**. This _week #1 release_ is a pure client-side application written with [React](https://facebook.github.io/react/) by the good folks at [TailorDev](https://tailordev.fr)!',
  '',
  'Read more about how and why we built Monod at: https://tailordev.fr/blog/.',
  '',
  'See, we have code & Emoji support, yay! :clap:',
  '',
  '``` python',
  'def hello():',
  '    print("Have fun with Monod!")',
  '```',
  '',
  '*Play with this page and [send us feedback](mailto:hello@tailordev.fr?subject=About Monod). We would :heart: to hear from you!*'
].join('\n');
