import React, { Component } from 'react';
import localforage from 'localforage';
import debounce from 'lodash.debounce';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';


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
        'Read more about how and why we build Monod at: https://tailordev.fr/blog/.',
        '',
        '### Markdown syntax',
        '',
        'This note demonstrates some of what [Markdown][1] is capable of doing.',
        '',
        '``` python',
        'def hello():',
        '    print("Have fun with Monod!")',
        '```',
        '',
        '*Play with this page and [give us feedback](mailto:hello@tailordev.fr). We would :heart: to ear from you!*'
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
        <Footer />
      </div>
    );
  }
}
