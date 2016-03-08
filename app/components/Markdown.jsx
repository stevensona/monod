import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import _ from 'underscore';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/python/python';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

const { func, string } = PropTypes;

export default class Markdown extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillMount() {
    this.onScroll = _.debounce(this.onScroll, 40);
  }

  componentWillUnmount() {
    this.onScroll.cancel();
  }

  getCodeMirror() {
    return this.refs.markdownTextarea.getCodeMirror();
  }

  onScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();

    if (top === 0) {
      this.props.doUpdatePosition(top / height);
    } else {
      this.props.doUpdatePosition((top + clientHeight) / height);
    }
  }

  render() {
    var options = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'gfm',
      scrollbarStyle: null,
      theme: 'tdit'
    };

    return (
      <div className="markdown" onScroll={this.onScroll.bind(this)}>
        <Codemirror
          ref="markdownTextarea"
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.raw}
          options={options}
        />
      </div>
    );
  }
}

Markdown.propTypes = {
  raw: string.isRequired,
  onChange: func.isRequired,
  doUpdatePosition: func.isRequired
}
