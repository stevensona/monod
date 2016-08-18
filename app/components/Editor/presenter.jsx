import React, { PropTypes, Component } from 'react';
import Loader from 'react-loader';

import Markdown from '../Markdown';
import Preview from '../Preview';
import VerticalHandler from './VerticalHandler';


export const EditorModes = {
  FOCUS: 'focus',
  PREVIEW: 'edit-preview',
  READING: 'reading',
};

export default class Editor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      position: 0,
      mode: EditorModes.PREVIEW,
    };

    this.updatePosition = this.updatePosition.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  componentDidUpdate() {
    if (window.Reveal) {
      window.Reveal.layout();
    }
  }

  updatePosition(position) {
    this.setState({ position });
  }

  updateMode(newMode) {
    this.setState({ mode: newMode });
  }

  handleOnClick(e) {
    // class names 'fa fa-chevron-left' and 'left' should match
    const hasClickedLeft = /left/.test(e.target.className);
    let newMode = EditorModes.PREVIEW;

    if (hasClickedLeft && this.state.mode !== EditorModes.FOCUS) {
      newMode = EditorModes.READING;
    }

    if (!hasClickedLeft && this.state.mode !== EditorModes.READING) {
      newMode = EditorModes.FOCUS;
    }

    this.updateMode(newMode);
  }

  render() {
    return (
      <Loader
        loaded={this.props.loaded}
        loadedClassName={`editor ${this.state.mode}`}
      >
        <Markdown
          content={this.props.content}
          onChange={this.props.onUpdateContent}
          onUpdatePosition={this.updatePosition}
          forceUpdate={this.props.forceUpdate}
        />
        <VerticalHandler
          onClickLeft={this.handleOnClick}
          onClickRight={this.handleOnClick}
        />
        <Preview
          content={this.props.content}
          position={this.state.position}
          template={this.props.template}
          onClickCheckbox={this.props.onClickCheckbox}
        />
      </Loader>
    );
  }
}

Editor.propTypes = {
  loaded: PropTypes.bool.isRequired,
  content: PropTypes.string.isRequired,
  template: PropTypes.string.isRequired,
  onUpdateContent: PropTypes.func.isRequired,
  onClickCheckbox: PropTypes.func.isRequired,
  forceUpdate: PropTypes.bool.isRequired,
};
