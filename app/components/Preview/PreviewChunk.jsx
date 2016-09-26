/* eslint react/no-danger: 0 */
import React, { PropTypes, Component } from 'react';
import isEqual from 'lodash.isequal';


class PreviewChunk extends Component {

  shouldComponentUpdate(nextProps) {
    // It looks like `attrs` is modified by hljs on `render()`, which
    // makes the chunk to be re-rendered all the time. The problem is
    // that it impacts performance negatively since hljs is costly.
    this.props.chunk.map((chunk) => { // eslint-disable-line array-callback-return
      if ('fence' === chunk.type) {
        chunk.attrs = null; // eslint-disable-line no-param-reassign
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

    return { __html: html };
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
  id: PropTypes.string,
  markdownIt: PropTypes.shape({
    renderer: PropTypes.shape({
      render: PropTypes.func.isRequired,
    }).isRequired,
    options: PropTypes.any.isRequired,
  }).isRequired,
  emojione: PropTypes.shape({
    toImage: PropTypes.func.isRequired,
  }).isRequired,
  chunk: PropTypes.arrayOf(
    PropTypes.object // eslint-disable-line react/forbid-prop-types
  ).isRequired,
  markdownItEnv: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default PreviewChunk;
