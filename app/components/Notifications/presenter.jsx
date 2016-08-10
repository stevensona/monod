import React, { PropTypes } from 'react';
import MessageBox from './MessageBox';


const Notifications = (props) => (
  <div className="message-boxes">
    {props.messages.map((message, index) =>
      <MessageBox
        index={index}
        key={index}
        message={message}
        onClose={props.onMessageBoxClose}
      />
    )}
  </div>
);

Notifications.propTypes = {
  messages: PropTypes.object.isRequired,
  onMessageBoxClose: PropTypes.func.isRequired,
};

export default Notifications;
