import React, { PropTypes } from 'react';
import Modal from 'react-modal';

import CopiableUrlInput from './CopiableUrlInput';


const ShareModal = props =>
  <Modal
    isOpen={props.isOpen}
    onRequestClose={props.onRequestClose}
    shouldCloseOnOverlayClick
    className="share-modal"
    style={{ overlay: { zIndex: 5 } }}
  >
    <div className="share-modal-content">
      <button
        className="close-button"
        aria-label="Close this modal"
        type="button"
        onClick={props.onRequestClose}
      >
        <span aria-hidden="true">&times;</span>
      </button>

      <h2>Share your work!</h2>

      <h4>Full Access</h4>
      <p>
        Anyone with the link below is able to read
        &nbsp;<strong>and edit</strong> your Monod document:
      </p>
      <CopiableUrlInput
        name="monod-full-access"
        value={props.fullAccessURL}
      />
    </div>
  </Modal>
;

ShareModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  fullAccessURL: PropTypes.string.isRequired,
};

export default ShareModal;
