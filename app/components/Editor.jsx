import React, { PropTypes, Component } from 'react';
import Loader from 'react-loader';

import Markdown from './Markdown';
import Preview from './Preview';

const { objectOf, func } = PropTypes;


export default class Editor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      raw: '',
      pos: 0,
      loaded: false
    };
  }

  componentDidMount() {
    this.props.loadRaw
      .then((raw) => {
        this.setState({
          raw: raw,
          pos: 0,
          loaded: true
        });
      })
      .catch(() => {
        this.setState({
          raw: '',
          pos: 0,
          loaded: true
        });
      });
  }

  doUpdatePosition(newPos) {
    this.setState(function(previousState) {
      return {
        raw: previousState.raw,
        pos: newPos,
        loaded: previousState.loaded
      };
    });
  }

  onChange(newRaw) {
    this.setState(function(previousState) {
      return {
        raw: newRaw,
        pos: previousState.pos,
        loaded: previousState.loaded
      };
    });

    this.props.onSave(newRaw);
  }

  render() {
    return (
      <Loader loaded={this.state.loaded} loadedClassName={"editor"}>
        <Markdown
          raw={this.state.raw}
          onChange={this.onChange.bind(this)}
          doUpdatePosition={this.doUpdatePosition.bind(this)}
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
