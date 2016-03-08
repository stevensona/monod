import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';
import emojify from 'emojify.js';
import hljs from 'highlight.js';
import zenscroll from 'zenscroll';

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
  }

  componentDidMount() {
    this.$rendered = ReactDOM.findDOMNode(this.refs.rendered);
    this.scroller  = zenscroll.createScroller(this.$rendered);
  }

  componentDidUpdate() {
    window.requestAnimationFrame(() => {
      const previewHeight = this.$rendered.scrollHeight - this.$rendered.offsetHeight;
      const previewScroll = parseInt(previewHeight * this.props.pos, 10);

      this.scroller.toY(previewScroll, 200);
    });
  }

  getHTML() {
    var html = marked(this.props.raw.toString(), { sanitize: true });

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
