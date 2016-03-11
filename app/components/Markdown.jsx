import React, { Component, PropTypes } from 'react';
import MarkdownLoader from './loaders/Markdown';
import Codemirror from 'react-codemirror';

import 'codemirror/lib/codemirror.css';

const { func, string } = PropTypes;

export default class Markdown extends Component {

  componentWillMount() {
    MarkdownLoader().then(() => {
      this.forceUpdate();
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  getCodeMirror() {
    return this.refs.markdownTextarea.getCodeMirror();
  }

  handleOnScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();

    if (top <= clientHeight / 10) {
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
      theme: 'monod'
    };

    return (
      <div className="markdown" onScroll={this.handleOnScroll.bind(this)}>
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
