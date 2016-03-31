import localforage from 'localforage';
import debounce from 'lodash.debounce';
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
  DECRYPTION_FAILED: 'store:decryption_failed'
};

export default class Store {

  constructor(name, events, endpoint) {
    this.state = {
      document: {
        uuid: uuid.v4(),
        content: DEFAULT_CONTENT
      },
      secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0)
    };

    this.events = events;
    this.endpoint = endpoint;

    localforage.config({
      name: 'monod',
      storeName: name
    });

    this._persist = debounce(this._persist, 2000);
  }

  findById(id, secret) {
    if (!id) {
      this.events.emit(Events.NO_DOCUMENT_ID, this.state);

      return;
    }

    localforage
      .getItem(id)
      .then((document) => {
        if (null === document) {
          return Promise.reject('document not found');
        }

        this._decrypt(document, secret);
      })
      .catch(() => {
        request
          .get(`${this.endpoint}/documents/${id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            if (err) {
              this.events.emit(Events.APP_IS_OFFLINE, this.state);
            }

            if (err || 200 !== res.status || !res.body.content) {
              // `err` might be handled differently in the future
              this.events.emit(Events.DOCUMENT_NOT_FOUND, this.state);

              return;
            }

            this._decrypt(res.body, secret);
            this.events.emit(Events.APP_IS_ONLINE);
          })
      });
  }

  update(document) {
    if (DEFAULT_CONTENT === document.content) {
      // we don't want to store default content
      return;
    }

    this.state.document = document;
    this.events.emit(Events.CHANGE, this.state);

    this._persist();
  }

  sync() {
    let requests = [];
    localforage.iterate((data, id) => {
      requests.push(
        request
          .put(`${this.endpoint}/documents/${id}`)
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .send({ content: data.content })
      );
    })
    .then(() => {
      Promise
        .all(requests)
        .then(() => {
          this.events.emit(Events.SYNCHRONIZE, { date: new Date() });
          this.events.emit(Events.APP_IS_ONLINE);
        })
        .catch(() => {
          requests.forEach((req) => {
            if (!req.aborted) {
              req.abort();
            }
          });

          this.events.emit(Events.APP_IS_OFFLINE);
        });
    });
  }

  _decrypt(document, secret) {
    try {
      document.content = sjcl.decrypt(secret, document.content);
    } catch (e) {
      this.events.emit(Events.DECRYPTION_FAILED, this.state);

      return;
    }

    this.state.document = document;
    this.state.secret   = secret;

    this.events.emit(Events.CHANGE, this.state);
  }

  _persist() {
    const document = this.state.document;

    document.content = sjcl.encrypt(
      this.state.secret,
      document.content,
      { ks: 256 }
    );

    localforage.setItem(document.uuid, document);
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
