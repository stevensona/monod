import React, { Component } from 'react';

export default class Markdown extends Component {
  render() {
    return (
      <div className="markdown">
        <textarea placeholder="Type your *markdown* content here" />
      </div>
    );
  }
}
