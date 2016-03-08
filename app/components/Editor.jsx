import React, { Component } from 'react';
import Markdown from './Markdown';
import Preview from './Preview';


export default class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      raw: '',
      pos: 0
    };
  }

  doUpdatePosition(newPos) {
    window.requestAnimationFrame(() => {
      this.setState(function(previousState) {
        return {
          raw: previousState.raw,
          pos: newPos
        };
      });
    });
  }

  onChange(newRaw) {
    this.setState(function(previousState) {
      return {
        raw: newRaw,
        pos: previousState.pos
      };
    });
  }

  render() {
    return (
      <div className="editor">
        <Markdown
          raw={this.state.raw}
          onChange={this.onChange.bind(this)}
          doUpdatePosition={this.doUpdatePosition.bind(this)}
        />
        <Preview {...this.state} />
      </div>
    );
  }
}
