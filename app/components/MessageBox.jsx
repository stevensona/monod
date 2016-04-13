import React, { Component, PropTypes } from 'react';

const { array, func, object } = PropTypes;


export const MessageBox = (props) => {

  if (props.message && props.message.content) {
    return (
      <div className={'message-box ' + props.message.type}>
        <p>{props.message.content}</p>
        <button
          className="close-button"
          onClick={props.doClose}>
          <span>&times;</span>
        </button>
      </div>
    );
  }

  return (<noscript />);
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
