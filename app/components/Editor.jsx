import React, { PropTypes, Component } from 'react';
import Loader from 'react-loader';

import Markdown from './Markdown';
import Preview from './Preview';
import TemplateForm from './TemplateForm';
import VerticalHandler from './VerticalHandler';

const { bool, func, string } = PropTypes;

export const EditorModes = {
  FOCUS: 'focus',
  PREVIEW: 'edit-preview',
  READING: 'reading'
};

export default class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      template: '',
      pos: 0,
      mode: EditorModes.PREVIEW
    };
  }

  updatePosition(newPos) {
    this.setState(function(previousState) {
      return {
        template: previousState.template,
        pos: newPos,
        loaded: previousState.loaded,
        mode: previousState.mode
      };
    });
  }

  updateMode(newMode) {
    this.setState(function(previousState) {
      return {
        template: previousState.template,
        pos: previousState.pos,
        loaded: previousState.loaded,
        mode: newMode
      };
    });
  }

  updateTemplate(newTemplate) {
    this.setState(function(previousState) {
      return {
        template: newTemplate,
        pos: previousState.pos,
        loaded: previousState.loaded,
        mode: previousState.mode
      };
    });
  }

  handleOnClick(e) {
    const hasClickedLeft = e.target.className == 'left' || false;
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
        loadedClassName={'editor ' + this.state.mode}>
        <TemplateForm
          doUpdateTemplate={this.updateTemplate.bind(this)}
        />
        <Markdown
          raw={this.props.content}
          onChange={this.props.onContentUpdate}
          doUpdatePosition={this.updatePosition.bind(this)}
        />
        <VerticalHandler
          onClickLeft={this.handleOnClick.bind(this)}
          onClickRight={this.handleOnClick.bind(this)}
        />
        <Preview
          raw={this.props.content}
          pos={this.state.pos}
        />
      </Loader>
    );
  }
}

Editor.propTypes = {
  loaded: bool.isRequired,
  content: string.isRequired,
  onContentUpdate: func.isRequired
};
