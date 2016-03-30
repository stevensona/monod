import React, { PropTypes, Component } from 'react';
import Loader from 'react-loader';

import Markdown from './Markdown';
import Preview from './Preview';
import TemplateForm from './TemplateForm';
import VerticalHandler from './VerticalHandler';

const { objectOf, func } = PropTypes;

export const EditorModes = {
  FOCUS: 'focus',
  PREVIEW: 'edit-preview',
  READING: 'reading'
}

export default class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      raw: '',
      template: '',
      pos: 0,
      loaded: false,
      mode: EditorModes.PREVIEW
    };
  }

  componentDidMount() {
    this.props.loadRaw
      .then((raw) => {
        this.setState({
          raw: raw,
          template: '',
          pos: 0,
          loaded: true,
          mode: EditorModes.PREVIEW
        });
      })
      .catch(() => {
        this.setState({
          raw: '',
          template: '',
          pos: 0,
          loaded: true,
          mode: EditorModes.PREVIEW
        });
      });
  }

  updateRaw(newRaw) {
    this.setState(function(previousState) {
      return {
        raw: newRaw ? newRaw : '',
        template: previousState.template,
        pos: previousState.pos,
        loaded: previousState.loaded,
        mode: previousState.mode
      };
    });

    this.props.onUpdateRaw(newRaw);
  }

  updatePosition(newPos) {
    this.setState(function(previousState) {
      return {
        raw: previousState.raw,
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
        raw: previousState.raw,
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
        raw: previousState.raw,
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
        loaded={this.state.loaded}
        loadedClassName={'editor ' + this.state.mode}>
        <TemplateForm
          doUpdateTemplate={this.updateTemplate.bind(this)}
        />
        <Markdown
          raw={this.state.raw}
          onChange={this.updateRaw.bind(this)}
          doUpdatePosition={this.updatePosition.bind(this)}
        />
        <VerticalHandler
          onClickLeft={this.handleOnClick.bind(this)}
          onClickRight={this.handleOnClick.bind(this)}
        />
        <Preview {...this.state} />
      </Loader>
    );
  }
}

Editor.propTypes = {
  // Promise
  loadRaw: objectOf({
    then: func.isRequired,
    catch: func.isRequired
  }).isRequired,
  onUpdateRaw: func.isRequired
}
