import React, { Component } from 'react';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';


export default class App extends Component {
  render() {
    return (
      <div className="layout">
        <Header />
        <Editor />
        <Footer />
      </div>
    );
  }
}
