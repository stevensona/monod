import React, { PropTypes } from 'react';


const FullscreenButton = (props) =>
  <button
    className="action fullscreen"
    title="Presentation mode"
    onClick={props.onTogglePresentationMode}
  >
    <i className="fa fa-play-circle" aria-hidden="true" />
  </button>
;

FullscreenButton.propTypes = {
  onTogglePresentationMode: PropTypes.func.isRequired,
};

export default FullscreenButton;
