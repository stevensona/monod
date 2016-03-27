import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import PreviewLoader from './loaders/Preview';
import isEqual from 'lodash.isequal';
import sanitizeHtml from 'sanitize-html';

const { array, func, number, object, string } = PropTypes;

import 'emojione/assets/sprites/emojione.sprites.css'

class PreviewChunk extends Component {

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props.chunk, nextProps.chunk) || this.props.key !== nextProps.key;
  }

  getHTML() {
    let html;

    html = this.props.markdownIt.renderer.render(
      this.props.chunk,
      this.props.markdownIt.options,
      this.props.env
    );
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
  markdownIt: object.isRequired,
  emojione: object.isRequired,
  chunk: array.isRequired,
  env: object.isRequired
}


export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.requestAnimationId = false;
  }

  componentWillMount() {
    this.props.previewLoader().then((deps) => {
      this.markdownIt = deps.markdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: (str, lang) => {
          if (lang && deps.hljs.getLanguage(lang)) {
            try {
              return deps.hljs.highlightAuto(str).value;
            } catch (e) {
              // pass
            }
          }

          return ''; // use external default escaping
        }
      });

      this.emojione = deps.emojione;
      this.emojione.ascii = true;
      this.emojione.sprites = true;

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

  /**
   * A chunk is a logical group of tokens
   * We build chunks from token's level and nesting properties
   */
  getChunks(raw, env) {

    // Parse the whole markdown document and get tokens
    let tokens = this.markdownIt.parse(raw, env);

    // Sanitize html chunks to avoid browser DOM manipulation
    // that could possibly crash the app (because of React)
    tokens = tokens.map((token) => {
      if (token.type === 'html_block') {
        token.content = sanitizeHtml(token.content);
      }

      return token;
    });

    let chunks = [],
        start = 0,
        stop = 0;

    for (let i = 0 ; i < tokens.length ; i++) {
      if (
          // We are starting tokens walk or in a chunk
          i < start ||
          !(
            // We are (NOT) closing a nested block
            (tokens[i].level === 0 && tokens[i].nesting === -1) ||
            // We are (NOT) in a root block
            (tokens[i].level === 0 && tokens[i].nesting === 0)
          )) {
        continue;
      }
      stop = i+1;
      chunks.push(tokens.slice(start, stop));
      start = stop;
    }

    return chunks;
  }

  render() {
    let preview = (
      <div className="preview-loader">
        <p>Loading all the rendering stuff...</p>
        <i className="fa fa-spinner fa-spin"></i>
      </div>
    );

    if (this.markdownIt) {
      // Markdown document environment (links references, footnotes, etc.)
      const env = {};

      // Get chunks to render from tokens
      let chunks = this.getChunks(this.props.raw, env);

      preview = chunks.map((chunk, key) => {

        return (
          <PreviewChunk
            key={'ck-' + key.toString()}
            markdownIt={this.markdownIt}
            emojione={this.emojione}
            chunk={chunk}
            env={env}
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
