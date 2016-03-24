import React, { Component, PropTypes } from 'react';
import localforage from 'localforage';
import debounce from 'lodash.debounce';

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

    this.forageKey = 'raw';
    this.saveRaw = debounce(this.saveRaw, 1000);
  }

  loadRaw() {
    return localforage.getItem(this.forageKey).then((value) => {
      return null !== value ? value : [
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
    })
  }

  saveRaw(raw) {
    localforage.setItem(this.forageKey, raw);
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <Editor loadRaw={this.loadRaw()} onUpdateRaw={this.saveRaw.bind(this)} />
        <Footer version={this.props.version} />
      </div>
    );
  }
}

App.propTypes = {
  version: string.isRequired
}
