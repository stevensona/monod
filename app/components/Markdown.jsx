import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

// vendor code mirror requirements
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/javascript/javascript.js';

const { func, string } = PropTypes;

export default class Markdown extends Component {
  render() {
    var options = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'gfm',
      scrollbarStyle: null,
      theme: 'tdit',
      value: 'Type your *markdown* content here'
    };

    return (
      <div className="markdown">
        <Codemirror
          ref="markdownTextarea"
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.raw}
          options={options} />
      </div>
    );
  }
}

Markdown.propTypes = {
  raw: string.isRequired,
  onChange: func.isRequired
}
