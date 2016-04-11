import React, { Component, PropTypes } from 'react';

const { array, func, object } = PropTypes;


export class MessageBox extends Component {

  render() {
    if (this.props.message && this.props.message.content) {
      return (
        <div className={'message-box ' + this.props.message.type} ref="msgBox">
          <p>{this.props.message.content}</p>
          <button
            className="close-button"
            onClick={this.props.doClose}
            value={this.key} >
            <span>&times;</span>
          </button>
        </div>
      );
    }

    return null;
  }
}

MessageBox.propTypes = {
  message: object.isRequired,
  doClose: func.isRequired
}

export default class MessageBoxes extends Component {

  closeMessageBox(index) {
    this.props.messages.splice(index, 1);
    this.forceUpdate();
  }

  render() {

    var messageBoxNodes = this.props.messages.map((message, index) => {
      return (
          <MessageBox
            message={message}
            key={index}
            doClose={this.closeMessageBox.bind(this, index)}
          />
      )
    });

    return (
      <div className="message-boxes">
        {messageBoxNodes}
      </div>
    );
  }
}

MessageBoxes.propTypes = {
  messages: array.isRequired
}
