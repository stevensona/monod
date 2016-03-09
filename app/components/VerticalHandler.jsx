import React, { Component, PropTypes } from 'react';

const { func } = PropTypes;

export default class VerticalHandler extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {

    return (
      <div className="vertical-handler">
          <div
            className="left"
            onClick={this.props.onLeftClick}
          />
          <div
            className="right"
            onClick={this.props.onRightClick}
          />
      </div>
    );
  }
}

VerticalHandler.PropTypes = {
  onLeftClick: func.isRequired,
  onRightClick: func.isRequired
}
