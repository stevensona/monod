import React, { Component, PropTypes } from 'react';
import CodeMirror from 'codemirror';
import Dropzone from 'react-dropzone';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import './fold';

import config from '../../config';
import extraKeys from './extra-keys';


export default class Markdown extends Component {

  constructor(props, context) {
    super(props, context);

    this.reader = new window.FileReader();
    this.currentFilename = null;

    this.setTextareaEl = this.setTextareaEl.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.reader.onload = this.onFileUploaded.bind(this);
  }

  componentDidMount() {
    const textareaNode = this.$textarea;
    const options = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true,
      scrollbarStyle: null,
      mode: config.CODE_MIRROR_MODE,
      theme: config.CODE_MIRROR_THEME,
      extraKeys,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    };

    // CodeMirror main instance
    this.codeMirror = CodeMirror.fromTextArea(textareaNode, options);

    // Bind CodeMirror events
    this.codeMirror.on('change', this.onChange.bind(this));
    this.codeMirror.on('scroll', this.onScroll.bind(this));

    // Fold all (images)
    CodeMirror.commands.foldAll(this.codeMirror);
  }

  componentWillReceiveProps(nextProps) {
    if (true === nextProps.forceUpdate && this.props.content !== nextProps.content) {
      this.getCodeMirror().setValue(nextProps.content);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  onChange(doc, change) {
    if ('setValue' !== change.origin) {
      const newValue = doc.getValue();

      if (newValue !== this.props.content) {
        // Update the value -> rendering
        this.props.onChange(newValue);
      }
    }

    // Update scrolling position (ensure rendering is visible)
    this.onScroll();
  }

  onScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();

    this.props.onUpdatePosition(top / (height - clientHeight));
  }

  onDrop(files) {
    if (files[0]) {
      const file = files[0];

      this.currentFilename = file.name || '';
      this.reader.readAsDataURL(file);
    }
  }

  onFileUploaded(event) {
    this.getCodeMirror().replaceSelection(
      `![${this.currentFilename || ''}](${event.target.result})`,
      'start'
    );
    // fold current line, that is the image we've just added
    CodeMirror.commands.fold(this.getCodeMirror());

    this.currentFilename = null;
  }

  getCodeMirror() {
    return this.codeMirror;
  }

  setTextareaEl(node) {
    this.$textarea = node;
  }

  render() {
    return (
      <Dropzone
        onDrop={this.onDrop}
        disableClick
        multiple={false}
        accept="image/*"
        disablePreview
        className="markdown"
      >
        <textarea
          ref={this.setTextareaEl}
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.content}
          autoComplete="off"
        />
      </Dropzone>
    );
  }
}

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdatePosition: PropTypes.func.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
};
