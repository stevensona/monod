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
  constructor(props, context) {
    super(props, context);

    this.state = { messages: props.messages };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ messages: nextProps.messages });
  }

  closeMessageBox(index) {
    this.state.messages.splice(index, 1);
    this.setState({ messages: this.state.messages });
  }

  render() {

    const messageBoxNodes = this.state.messages.map((message, index) => {
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
