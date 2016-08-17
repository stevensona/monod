import React, { PropTypes, Component } from 'react';
import grayMatter from 'gray-matter';

import 'emojione/assets/sprites/emojione.sprites.css';

import PreviewChunk from './PreviewChunk';
import previewLoader from '../loaders/Preview';
import Templates from '../Templates';


class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    this.matter = {};
    this.requestAnimationId = false;

    this.setRenderedEl = this.setRenderedEl.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
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
              token.attrObj.rel = 'noreferrer noopener'; // eslint-disable-line no-param-reassign
              break;

            default:
          }
        },
      });

      deps.markdownItPlugins.forEach((plugin) => {
        this.markdownIt.use(plugin);
      });

      // custom containers must be explicitly defined
      this.markdownIt.use(deps.markdownItContainer, 'small', {
        render: (tokens, idx) => { // eslint-disable-line arrow-body-style
          return 1 === tokens[idx].nesting ? '<small>\n' : '</small>\n';
        },
      });

      this.markdownIt.use(deps.markdownItTaskLists, {
        enabled: true,
      });

      this.emojione = deps.emojione;
      this.emojione.ascii = true;
      this.emojione.sprites = true;

      this.forceUpdate();
    });
  }

  componentDidMount() {
    this.$rendered.addEventListener('click', this.onClickCheckbox);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.$rendered) {
      return;
    }

    if (this.props.position !== nextProps.position || 1 === nextProps.position) {
      if (this.requestAnimationId) {
        window.cancelAnimationFrame(this.requestAnimationId);
        this.requestAnimationId = false;
      }

      this.requestAnimationId = window.requestAnimationFrame(() => {
        const previewHeight = this.$rendered.scrollHeight - this.$rendered.offsetHeight;
        const previewScroll = parseInt(previewHeight * this.props.position, 10);

        this.$rendered.scrollTop = previewScroll;
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return this.props.content !== nextProps.content || this.props.template !== nextProps.template;
  }

  componentDidUpdate() {
    const checkboxes = this.$rendered.querySelectorAll('.task-list-item-checkbox');

    let index = 0;
    [].forEach.call(checkboxes, (cb) => {
      cb.setAttribute('data-task-list-item-index', index++);
    });
  }

  componentWillUnmount() {
    this.$rendered.removeEventListener('click', this.onClickCheckbox);
  }

  onClickCheckbox(e) {
    const target = e.target;

    if (target.hasAttribute('data-task-list-item-index')) {
      this.props.onClickCheckbox(target.getAttribute('data-task-list-item-index'));
    }
  }

  /**
   * A chunk is a logical group of tokens
   * We build chunks from token's level and nesting properties
   */
  getChunks(content, env) {
    // Parse the whole markdown document and get tokens
    const tokens = this.markdownIt.parse(content, env);
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
      this.matter = grayMatter(this.props.content);
      data = this.matter.data;

      // Get chunks to render from tokens
      const chunks = this.getChunks(this.matter.content, markdownItEnv);

      content = chunks.map((chunk, id) =>
        <PreviewChunk
          id={`ck-${id.toString()}`}
          key={`ck-${id.toString()}`}
          markdownIt={this.markdownIt}
          emojione={this.emojione}
          chunk={chunk}
          markdownItEnv={markdownItEnv}
        />, this);
    }

    // Compile selected template with given data
    if (this.props.template && this.props.template.length) {
      // Get the template component
      const Template = Templates.find(
        template => template.id === this.props.template
      ).component;

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
  content: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  previewLoader: PropTypes.func.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
};

Preview.defaultProps = {
  previewLoader,
};

export default Preview;
