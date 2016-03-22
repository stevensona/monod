import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PreviewLoader from './loaders/Preview';

const { func, number, object, string } = PropTypes;


export class PreviewChunk extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.raw !== nextProps.raw || this.props.key !== nextProps.key;
  }

  getHTML() {
    let html;

    html = this.props.md.render(this.props.raw.toString());
    html = this.props.emojione.toImage(html);

    return {
      __html: html
    };
  }

  render() {
    return (
      <div className="chunk">
        <span dangerouslySetInnerHTML={this.getHTML()} />
      </div>
    );
  }
}

PreviewChunk.propTypes = {
  md: object.isRequired,
  emojione: object.isRequired,
  raw: string.isRequired
}

export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.requestAnimationId = false;
  }

  componentWillMount() {
    this.props.previewLoader().then((deps) => {
      this.md = deps.md({
        html: true,
        linkify: true,
        typographer: true,
        highlight: (str, lang) => {
          if (lang && deps.hljs.getLanguage(lang)) {
            try {
              return deps.hljs.highlight(lang, str).value;
            } catch (e) {
              // pass
            }
          }

          return ''; // use external default escaping
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

  render() {
    var preview = (
      <div className="preview-loader">
        <p>Loading all the rendering stuff...</p>
        <i className="fa fa-spinner fa-spin"></i>
      </div>
    );

    if (this.md) {
      preview = this.props.raw.split('\n\n').map((chunk, key) => {
        if(!chunk) {
          return null;
        }

        return (
          <PreviewChunk
            key={'ck-' + key.toString()}
            raw={chunk}
            md={this.md}
            emojione={this.emojione}
          />
        )
      }, this);
    }

    return (
      <div className="preview">
        <div ref="rendered" className="rendered">
          {preview}
        </div>
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
