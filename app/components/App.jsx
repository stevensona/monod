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
    this.doSave = debounce(this.doSave, 1000);
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
