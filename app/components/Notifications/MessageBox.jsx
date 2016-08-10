import React, { PropTypes } from 'react';


const MessageBox = (props) => {
  const onClick = () => {
    props.onClose(props.index);
  };

  if (props.message && props.message.content) {
    return (
      <div className={`message-box ${props.message.level}`}>
        <p>{props.message.content}</p>
        <button
          className="close-button"
          onClick={onClick}
        >
          <span>&times;</span>
        </button>
      </div>
    );
  }

  return null;
};

MessageBox.propTypes = {
  index: PropTypes.number.isRequired,
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessageBox;
