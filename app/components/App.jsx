import React, { Component, PropTypes } from 'react';
import localforage from 'localforage';
import debounce from 'lodash.debounce';
import uuid from 'uuid';
import sjcl from 'sjcl';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';

const { string } = PropTypes;


export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    localforage.config({
      name: 'monod'
    });

    this.state = {
      document: {
        uuid: uuid.v4(),
        content: DEFAULT_CONTENT
      },
      secret: sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10), 0),
      loaded: false
    };

    this.updateContent = debounce(this.updateContent, 500);
  }

  componentDidMount() {
    const id = window.location.pathname.slice(1);
    const secret = window.location.hash.slice(1);

    localforage
      .getItem(id)
      .then((document) => {
        if (secret && null !== document) {
          document.content = sjcl.decrypt(secret, document.content);

          this.setState({
            document: document,
            secret: secret,
            loaded: true
          });
        }
      })
      .then(() => {
        this.setState({ loaded: true });
      });
  }

  updateContent(content) {
    if (DEFAULT_CONTENT === content) {
      return;
    }

    const doc    = this.state.document;
    const secret = this.state.secret;
    doc.content  = content;

    this.setState((previousState) => {
      return {
        document: doc,
        secret: secret,
        loaded: previousState.loaded
      };
    });

    doc.content = sjcl.encrypt(secret, doc.content, {ks: 256});
    localforage.setItem(doc.uuid, doc);

    window.history.pushState(
      {}, '', `/${this.state.document.uuid}#${this.state.secret}`
    );
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <Editor
          loaded={this.state.loaded}
          content={this.state.document.content}
          onContentUpdate={this.updateContent.bind(this)}
        />
        <Footer version={this.props.version} />
      </div>
    );
  }
}

App.propTypes = {
  version: string.isRequired
};

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
