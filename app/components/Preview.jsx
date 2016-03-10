import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PreviewLoader from './loaders/Preview';

const { number, string } = PropTypes;

export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.requestAnimationId = false;
  }

  componentWillMount() {
    PreviewLoader().then((deps) => {
      this.marked = deps.marked.setOptions({
        highlight: function (code) {
          return deps.hljs.highlightAuto(code).value;
        }
      });

      this.emojify = deps.emojify;
      this.emojify.setConfig({
        img_dir: 'https://github.global.ssl.fastly.net/images/icons/emoji/'
      });

      this.forceUpdate();
    });
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
    let html;

    if (!this.marked) {
      html = [
        '<em>',
        'We are processing your document...',
        '</em>'
      ].join('');
    } else {
      html = this.marked(this.props.raw.toString(), { sanitize: false });
      html = this.emojify.replace(html);
    }

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
