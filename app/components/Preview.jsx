import React, { PropTypes, Component } from 'react';
import marked from 'marked';

const { string } = PropTypes;

export default class Preview extends Component {

  update() {
    var toHtml = marked(this.props.raw.toString(), { sanitize: true });

    return {
      __html: toHtml
    };
  }

  render() {
    return (
      <div className="preview">
        <div
          className="rendered"
          dangerouslySetInnerHTML={this.update()} />
      </div>
    );
  }
}

Preview.propTypes = {
  raw: string.isRequired
}