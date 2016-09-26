import React, { PropTypes } from 'react';


const ShareModalButton = props =>
  <button
    className={`action share${props.enableShareModalButton ? '' : ' disabled'}`}
    title="Share this document"
    onClick={props.onToggleShareModal}
    disabled={!props.enableShareModalButton}
  >
    <i className="fa fa-share-alt" aria-hidden="true" />
  </button>
;

ShareModalButton.propTypes = {
  onToggleShareModal: PropTypes.func.isRequired,
  enableShareModalButton: PropTypes.bool.isRequired,
};

export default ShareModalButton;
