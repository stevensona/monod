import React, { Component } from 'react';

import Markdown from './Markdown';
import Preview from './Preview';


export default class Editor extends Component {
  render() {
    return (
      <div className="editor">
        <Markdown />
        <Preview />
      </div>
    );
  }
}
