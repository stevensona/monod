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
      pos: 0,
      mode: EditorModes.PREVIEW
    };
  }

  updatePosition(newPos) {
    this.setState({ pos: newPos });
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

  componentDidUpdate() {
    if (window.Reveal) {
      window.Reveal.sync();
    }
  }

  render() {
    return (
      <Loader
        loaded={this.props.loaded}
        loadedClassName={`editor ${this.state.mode}`}
      >
        <TemplateForm
          template={this.props.template}
          doUpdateTemplate={this.props.onUpdateTemplate}
        />
        <Markdown
          raw={this.props.content}
          onChange={this.props.onUpdateContent}
          doUpdatePosition={this.updatePosition.bind(this)}
        />
        <VerticalHandler
          onClickLeft={this.handleOnClick.bind(this)}
          onClickRight={this.handleOnClick.bind(this)}
        />
        <Preview
          raw={this.props.content}
          pos={this.state.pos}
          template={this.props.template}
        />
      </Loader>
    );
  }
}

Editor.propTypes = {
  loaded: bool.isRequired,
  content: string.isRequired,
  template: string.isRequired,
  onUpdateContent: func.isRequired,
  onUpdateTemplate: func.isRequired
};

Editor.contextTypes = {
  controller: PropTypes.object.isRequired
};
