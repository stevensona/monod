import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PreviewLoader from './loaders/Preview';

const { func, number, string } = PropTypes;

export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.requestAnimationId = false;
  }

  componentWillMount() {
    this.props.previewLoader().then((deps) => {
      this.marked = deps.marked.setOptions({
        sanitize: false,
        highlight: function (code) {
          return deps.hljs.highlightAuto(code).value;
        }
      });

      this.emojione = deps.emojione;
      this.emojione.ascii = true;

      this.forceUpdate();
    });
  }

  componentDidMount() {
    this.$rendered = ReactDOM.findDOMNode(this.refs.rendered);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pos !== nextProps.pos || nextProps.pos === 1) {
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
        '<div class="preview-loader">',
        '<p>Loading all the rendering stuff...</p>',
        '<i class="fa fa-spinner fa-spin"></i>',
        '</div>'
      ].join('');
    } else {
      html = this.marked(this.props.raw.toString());
      html = this.emojione.toImage(html);
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
  pos: number.isRequired,
  previewLoader: func.isRequired
}

Preview.defaultProps = {
  previewLoader: PreviewLoader
}
