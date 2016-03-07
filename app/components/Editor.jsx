import React, { Component } from 'react';

import Markdown from './Markdown.jsx';
import Preview from './Preview.jsx';


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
