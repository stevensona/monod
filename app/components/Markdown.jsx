import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/mode/gfm/gfm';

// vendor styles
import 'codemirror/lib/codemirror.css';

const { func, string } = PropTypes;

export default class Markdown extends Component {
  render() {
    var options = {
      mode: 'gfm'
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
