import React, { PropTypes, Component } from 'react';
import marked from 'marked';
import emojify from 'emojify.js';

import 'emojify.js/dist/css/sprites/emojify.css';
import 'emojify.js/dist/css/sprites/emojify-emoticons.css';

const { string } = PropTypes;

export default class Preview extends Component {
  constructor(props, context) {
    super(props, context);

    emojify.setConfig({ mode: 'sprite' });
  }

  update() {
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
          className="rendered"
          dangerouslySetInnerHTML={this.update()} />
      </div>
    );
  }
}

Preview.propTypes = {
  raw: string.isRequired
}
