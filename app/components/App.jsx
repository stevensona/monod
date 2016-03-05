import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
      <div className="layout">
        <header className="page-header">
          <h1>TDit <small>TailorDev Markdown Editor</small></h1>
        </header>
        <div className="content">
          <div className="editor">
            Edit here.
          </div>
          <div className="preview">
            Preview here.
          </div>
        </div>
      </div>
    );
  }
}
