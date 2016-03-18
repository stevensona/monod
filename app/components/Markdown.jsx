import React, { Component, PropTypes } from 'react';
import MarkdownLoader from './loaders/Markdown';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

const { func, string } = PropTypes;

export default class Markdown extends Component {

  componentWillMount() {
    MarkdownLoader().then(() => {
      this.forceUpdate();
    });
  }

  componentDidMount() {
    const textareaNode = this.refs.markdownTextarea;
    const options = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'gfm',
      scrollbarStyle: null,
      theme: 'monod'
    };

    // CodeMirror main instance
    this.codeMirror = CodeMirror.fromTextArea(textareaNode, options);

    // Bind CodeMirror events
    this.codeMirror.on('change', this.handleOnChange.bind(this));
    this.codeMirror.on('scroll', this.handleScroll.bind(this));

    // Set default value
    const defaultValue = this.props.raw || '';
    this.codeMirror.setValue(defaultValue);
  }

  shouldComponentUpdate() {
    return false;
  }

  getCodeMirror() {
    return this.codeMirror;
  }

  handleOnChange() {
    const newValue = this.getCodeMirror().getDoc().getValue();

    // Update the value -> rendering
    this.props.onChange && this.props.onChange(newValue);

    // Update scrolling position (ensure rendering is visible)
    this.handleScroll();
  }

  handleScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();
    this.props.doUpdatePosition(top / (height - clientHeight));
  }

  render() {

    return (
      <div className="markdown">
        <textarea
          ref="markdownTextarea"
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.raw}
          autoComplete="off"
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
