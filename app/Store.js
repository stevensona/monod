import localforage from 'localforage';
import debounce from 'lodash.debounce';
import uuid from 'uuid';
import sjcl from 'sjcl';

export default class Store {

  constructor(name, events) {
    this.state = {
      document: {
        uuid: uuid.v4(),
        content: DEFAULT_CONTENT
      },
      secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0)
    };

    this.events = events;

    localforage.config({
      name: 'monod',
      storeName: name
    });

    this._persist = debounce(this._persist, 2000);
  }

  findById(id, secret) {
    localforage
      .getItem(id)
      .then((document) => {
        if (!secret || null === document) {
          this.events.emit('store:invalid', this.state);

          return;
        }

        document.content = sjcl.decrypt(secret, document.content);

        this.state.document = document;
        this.state.secret   = secret;

        this.events.emit('store:change', this.state);
      })
      .catch(() => {
        this.events.emit('store:notfound');
      });
  }

  update(document) {
    if (DEFAULT_CONTENT === document.content) {
      // we don't want to store default content
      return;
    }

    this.state.document = document;
    this.events.emit('store:change', this.state);

    this._persist();
  }

  sync() {
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
