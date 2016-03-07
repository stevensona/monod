import React, { Component } from 'react';

import Header from './Header.jsx';
import Editor from './Editor.jsx';
import Footer from './Footer.jsx';


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
