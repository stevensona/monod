import React, { Component, PropTypes } from 'react';

const { object } = PropTypes;


export default class MessageBox extends Component {

  render() {
    if (this.props.message && this.props.message.content) {
      return (
        <div className={'message-box ' + this.props.message.type}>
          <p>{this.props.message.content}</p>
        </div>
      );
    }

    return null;
  }
}

MessageBox.propTypes = {
  message: object.isRequired
}
