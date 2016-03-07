import React, { Component, PropTypes } from 'react';

const { func, string } = PropTypes;

export default class Markdown extends Component {
  render() {
    return (
      <div className="markdown">
        <textarea
          onChange={this.props.onChange}
          placeholder="Type your *markdown* content here"
          value={this.props.raw} />
      </div>
    );
  }
}

Markdown.propTypes = {
  raw: string.isRequired,
  onChange: func.isRequired
}
