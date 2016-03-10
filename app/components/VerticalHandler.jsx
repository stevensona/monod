import React, { Component, PropTypes } from 'react';

const { func } = PropTypes;

export default class VerticalHandler extends Component {
  render() {

    return (
      <div className="vertical-handler">
          <div
            className="left"
            title="Reduce markdown editor"
            onClick={this.props.onClickLeft}>
            <i className="fa fa-chevron-left"></i>
          </div>
          <div
            className="right"
            title="Reduce preview"
            onClick={this.props.onClickRight}>
            <i className="fa fa-chevron-right"></i>
          </div>
      </div>
    );
  }
}

VerticalHandler.PropTypes = {
  onClickLeft: func.isRequired,
  onClickRight: func.isRequired
}
