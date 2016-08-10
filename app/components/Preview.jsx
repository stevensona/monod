/* eslint no-param-reassign: 0, array-callback-return: 0, react/no-multi-comp: 0 */
import React, { PropTypes, Component } from 'react';
import grayMatter from 'gray-matter';
import isEqual from 'lodash.isequal';

import 'emojione/assets/sprites/emojione.sprites.css';

import PreviewLoader from './loaders/Preview';
import Templates from './Templates';


const { array, func, number, object, string } = PropTypes;

export class PreviewChunk extends Component {

  shouldComponentUpdate(nextProps) {
    // It looks like `attrs` is modified by hljs on `render()`, which
    // makes the chunk to be re-rendered all the time. The problem is
    // that it impacts performance negatively since hljs is costly.
    this.props.chunk.map((chunk) => {
      if ('fence' === chunk.type) {
        chunk.attrs = null;
      }
    });

    return !isEqual(this.props.chunk, nextProps.chunk) || this.props.id !== nextProps.id;
  }

  getHTML() {
    let html;

    html = this.props.markdownIt.renderer.render(
      this.props.chunk,
      this.props.markdownIt.options,
      this.props.markdownItEnv
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
  id: string,
  markdownIt: object.isRequired,
  emojione: object.isRequired,
  chunk: array.isRequired,
  markdownItEnv: object.isRequired
};


export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.matter = {};
    this.requestAnimationId = false;

    this.setRenderedEl = this.setRenderedEl.bind(this);
  }

  componentWillMount() {
    this.props.previewLoader().then((deps) => {
      this.markdownIt = deps.markdownIt('default', {
        html: false,
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
        },
        modifyToken: (token) => {
          switch (token.type) {
            case 'link_open':
              token.attrObj.rel = 'noreferrer noopener';
              break;

            default:
          }
        }
      });

      deps.markdownItPlugins.forEach((plugin) => {
        this.markdownIt.use(plugin);
      });

      // custom containers must be explicitly defined
      this.markdownIt.use(deps.markdownItContainer, 'small', {
        render: (tokens, idx) => {
          return 1 === tokens[idx].nesting ? '<small>\n' : '</small>\n';
        }
      });

      this.emojione = deps.emojione;
      this.emojione.ascii = true;
      this.emojione.sprites = true;

      this.forceUpdate();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.$rendered) {
      return;
    }

    if (this.props.pos !== nextProps.pos || 1 === nextProps.pos) {
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
    return this.props.raw !== nextProps.raw || this.props.template !== nextProps.template;
  }

  /**
   * A chunk is a logical group of tokens
   * We build chunks from token's level and nesting properties
   */
  getChunks(raw, env) {
    // Parse the whole markdown document and get tokens
    const tokens = this.markdownIt.parse(raw, env);
    const chunks = [];

    let start = 0;
    let stop = 0;

    for (let i = 0; i < tokens.length; i++) {
      // TODO: invert condition to get rid of the 'continue' statement
      if (
        // We are starting tokens walk or in a chunk
        i < start ||
        !(
          // We are (NOT) closing a nested block
          (0 === tokens[i].level && -1 === tokens[i].nesting) ||
          // We are (NOT) in a root block
          (0 === tokens[i].level && 0 === tokens[i].nesting)
        )
      ) {
        continue; // eslint-disable-line no-continue
      }

      stop = i + 1;
      chunks.push(tokens.slice(start, stop));
      start = stop;
    }

    return chunks;
  }

  setRenderedEl(node) {
    this.$rendered = node;
  }

  render() {
    let content = [(
      <div className="preview-loader" key="preview-loader">
        <p>Loading all the rendering stuff...</p>
        <i className="fa fa-spinner fa-spin" />
      </div>
    )];
    let data = {};

    if (this.markdownIt) {
      // Markdown document environment (links references, footnotes, etc.)
      const markdownItEnv = {};

      // Get front-matter vars
      this.matter = grayMatter(this.props.raw);
      data = this.matter.data;

      // Get chunks to render from tokens
      const chunks = this.getChunks(this.matter.content, markdownItEnv);

      content = chunks.map((chunk, id) => {
        return (
          <PreviewChunk
            id={`ck-${id.toString()}`}
            key={`ck-${id.toString()}`}
            markdownIt={this.markdownIt}
            emojione={this.emojione}
            chunk={chunk}
            markdownItEnv={markdownItEnv}
          />
        );
      }, this);
    }

    // Compile selected template with given data
    if (this.props.template && this.props.template.length) {
      // Get the template component
      const Template = Templates.find(
        (template) => {
          return template.id === this.props.template;
        }).component;

      content = (
        <Template content={content} data={data} />
      );
    }

    return (
      <div className="preview">
        <div ref={this.setRenderedEl} className="rendered">
          {content}
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  raw: string.isRequired,
  template: string.isRequired,
  pos: number.isRequired,
  previewLoader: func.isRequired
};

Preview.defaultProps = {
  previewLoader: PreviewLoader
};
