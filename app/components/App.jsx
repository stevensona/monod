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
      return null !== value ? value : '';
    });
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
