import React, { PropTypes, Component } from 'react';
import Loader from 'react-loader';

import Markdown from './Markdown';
import Preview from './Preview';
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
          pos: 0,
          loaded: true,
          mode: EditorModes.PREVIEW
        });
      })
      .catch(() => {
        this.setState({
          raw: '',
          pos: 0,
          loaded: true,
          mode: EditorModes.PREVIEW
        });
      });
    this.setMode(this.state.mode);
  }

  doUpdatePosition(newPos) {
    this.setState(function(previousState) {
      return {
        raw: previousState.raw,
        pos: newPos,
        loaded: previousState.loaded,
        mode: previousState.mode
      };
    });
  }

  onChange(newRaw) {
    this.setState(function(previousState) {
      return {
        raw: newRaw,
        pos: previousState.pos,
        loaded: previousState.loaded,
        mode: previousState.mode
      };
    });

    this.props.onSave(newRaw);
  }

  setMode(mode) {
    this.setState({
        raw: this.state.raw,
        pos: this.state.pos,
        loaded: this.state.loaded,
        mode: mode
    });
  }

  updateMode(e) {
    const hasClickedLeft = e.target.className == 'left' || false;
    var newMode = EditorModes.PREVIEW;

    if (hasClickedLeft && this.state.mode !== EditorModes.FOCUS) {
      newMode = EditorModes.READING;
    }
    if (!hasClickedLeft && this.state.mode !== EditorModes.READING) {
      newMode = EditorModes.FOCUS;
    }

    this.setMode(newMode)
  }

  render() {
    return (
      <Loader loaded={this.state.loaded} loadedClassName={'editor ' + this.state.mode}>
        <Markdown
          raw={this.state.raw}
          onChange={this.onChange.bind(this)}
          doUpdatePosition={this.doUpdatePosition.bind(this)}
        />
        <VerticalHandler
          onClickLeft={this.updateMode.bind(this)}
          onClickRight={this.updateMode.bind(this)}
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
  onSave: func.isRequired
}
