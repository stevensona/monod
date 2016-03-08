import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

// vendor styles
import 'codemirror/lib/codemirror.css';

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
