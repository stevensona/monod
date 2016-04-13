import React, { PropTypes } from 'react';

const { func, object } = PropTypes;


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


const MessageBoxes = (props) => {

  const messageBoxNodes = props.messages.map((message, index) => {
    return (
        <MessageBox
          message={message}
          key={index}
          doClose={props.closeMessageBox.bind(this, index)}
        />
    )
  });

  return (
    <div className="message-boxes">
      {messageBoxNodes}
    </div>
  );
}

MessageBoxes.propTypes = {
  messages: object.isRequired,
  closeMessageBox: func.isRequired
}

export default MessageBoxes;
