import React, { Component, PropTypes } from 'react';
import localforage from 'localforage';
import debounce from 'lodash.debounce';
import uuid from 'uuid';

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
      secret: 'foo'
    };

    this.updateContent = debounce(this.updateContent, 1000);
  }

  componentDidMount() {
    const id = window.location.pathname.slice(1);
    const secret = window.location.hash.slice(1);

    localforage
      .getItem(id)
      .then((document) => {
        if (null !== document) {
          this.setState({
            document: document,
            secret: secret
          });
        }
      });
  }

  componentDidUpdate() {
    window.history.pushState({}, '', '/' + this.state.document.uuid);
  }

  updateContent(content) {
    if (DEFAULT_CONTENT === content) {
      return;
    }

    this.setState({
      document: {
        uuid: this.state.document.uuid,
        content: content
      },
      secret: this.state.secret
    });

    localforage.setItem(
      this.state.document.uuid,
      this.state.document
    );
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <Editor
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
