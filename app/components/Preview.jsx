import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import emojify from 'emojify.js';
import hljs from 'highlight.js';

const { number, string } = PropTypes;

import 'highlight.js/styles/zenburn.css';

export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    marked.setOptions({
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });

    emojify.setConfig({
      img_dir: 'https://github.global.ssl.fastly.net/images/icons/emoji/'
    });

    this.requestAnimationId = false;
  }

  componentDidMount() {
    this.$rendered = ReactDOM.findDOMNode(this.refs.rendered);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pos !== nextProps.pos) {
      if (this.requestAnimationId) {
        window.cancelAnimationFrame(this.requestAnimationId);
        this.requestAnimationId = false;
      }

      this.requestAnimationId = window.requestAnimationFrame(() => {
        const previewHeight = this.$rendered.scrollHeight - this.$rendered.offsetHeight;
        const previewScroll = parseInt(previewHeight * this.props.pos, 10);

        this.$rendered.scrollTop = previewScroll;
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.raw !== nextProps.raw;
  }

  getHTML() {
    var html = marked(this.props.raw.toString(), { sanitize: false });

    html = emojify.replace(html);

    return {
      __html: html
    };
  }

  render() {
    return (
      <div className="preview">
        <div
          ref="rendered"
          className="rendered"
          dangerouslySetInnerHTML={this.getHTML()} />
      </div>
    );
  }
}

Preview.propTypes = {
  raw: string.isRequired,
  pos: number.isRequired
}
