/* eslint new-cap: 0 */
import React, { Component, PropTypes } from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import MarkdownLoader from './loaders/Markdown';


const { func, string } = PropTypes;

export default class Markdown extends Component {

  constructor(props, context) {
    super(props, context);

    this.setTextareaEl = this.setTextareaEl.bind(this);
  }

  componentWillMount() {
    MarkdownLoader().then(() => {
      const defaultValue = this.props.raw || '';
      const textareaNode = this.$textarea;
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
      this.codeMirror.setValue(defaultValue);
    });
  }

  componentDidMount() {
    /*
    this.context.controller.on(Events.UPDATE_WITHOUT_CONFLICT, (state) => {
      // force content update
      this.getCodeMirror().setValue(state.document.content);
    });

    this.context.controller.on(Events.CONFLICT, (state) => {
      // force content update
      this.getCodeMirror().setValue(state.fork.document.content);
    });
    */
  }

  shouldComponentUpdate() {
    return false;
  }

  getCodeMirror() {
    return this.codeMirror;
  }

  setTextareaEl(node) {
    this.$textarea = node;
  }

  handleOnChange() {
    const newValue = this.getCodeMirror().getDoc().getValue();

    // Update the value -> rendering
    this.props.onChange(newValue);

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
          ref={this.setTextareaEl}
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
};
