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
            onClick={this.props.onClickLeft}
          />
          <div
            className="right"
            onClick={this.props.onClickRight}
          />
      </div>
    );
  }
}

VerticalHandler.PropTypes = {
  onClickLeft: func.isRequired,
  onClickRight: func.isRequired
}
