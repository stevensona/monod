import React, { Component, PropTypes } from 'react';
import CodeMirror from 'codemirror';

import 'codemirror/lib/codemirror.css';

import markdownLoader from './loaders/Markdown';


export default class Markdown extends Component {

  constructor(props, context) {
    super(props, context);

    this.setTextareaEl = this.setTextareaEl.bind(this);
  }

  componentWillMount() {
    markdownLoader().then(() => {
      const defaultValue = this.props.content || '';
      const textareaNode = this.$textarea;
      const options = {
        autofocus: true,
        lineNumbers: true,
        lineWrapping: true,
        mode: 'gfm',
        scrollbarStyle: null,
        theme: 'monod',
      };

      // CodeMirror main instance
      this.codeMirror = CodeMirror.fromTextArea(textareaNode, options);

      // Bind CodeMirror events
      this.codeMirror.on('change', this.onChange.bind(this));
      this.codeMirror.on('scroll', this.onScroll.bind(this));

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

  onChange() {
    const newValue = this.getCodeMirror().getDoc().getValue();

    // Update the value -> rendering
    this.props.onChange(newValue);

    // Update scrolling position (ensure rendering is visible)
    this.onScroll();
  }

  onScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();

    this.props.onUpdatePosition(top / (height - clientHeight));
  }

  render() {
    return (
      <div className="markdown">
        <textarea
          ref={this.setTextareaEl}
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.content}
          autoComplete="off"
        />
      </div>
    );
  }
}

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdatePosition: PropTypes.func.isRequired,
};
