import React, { Component, PropTypes } from 'react';

const { object } = PropTypes;


export default class MessageBox extends Component {

  handleClose() {
    console.log('handleClose:', this.refs.msgBox);
  }

  render() {
    if (this.props.message && this.props.message.content) {
      return (
        <div className={'message-box ' + this.props.message.type} ref="msgBox">
          <p>{this.props.message.content}</p>
          <button className="close-button" onClick={this.handleClose.bind(this)}>
            <span>&times;</span>
          </button>
        </div>
      );
    }

    return null;
  }
}

MessageBox.propTypes = {
  message: object.isRequired
}
