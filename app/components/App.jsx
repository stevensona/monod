import React, { Component } from 'react';
import localforage from 'localforage';

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
  }

  doLoad() {
    return localforage.getItem(this.forageKey).then((value) => {
      return null !== value ? value : '';
    });
  }

  doSave(raw) {
    localforage.setItem(this.forageKey, raw);
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <Editor loadRaw={this.doLoad()} onSave={this.doSave.bind(this)} />
        <Footer />
      </div>
    );
  }
}
