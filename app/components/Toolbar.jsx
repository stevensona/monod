import React, { PropTypes } from 'react';

import TemplateForm from './TemplateForm';

const { bool, func, string } = PropTypes;

const Toolbar = (props) =>
  <div id="toolbar">
    <div className="actions">
      {false === props.readOnly ?
        <button
          className={`action share${props.enableShareModalButton ? '' : ' disabled'}`}
          title="Share this document"
          onClick={props.onToggleShareModal}
          disabled={!props.enableShareModalButton}
        >
          <i className="fa fa-share-alt" aria-hidden="true" />
        </button> : null
      }
      <button
        className="action fullscreen"
        title="Presentation mode"
        onClick={props.onTogglePresentationMode}
      >
        <i className="fa fa-play-circle" aria-hidden="true" />
      </button>
    </div>
    {false === props.readOnly ?
      <TemplateForm
        template={props.template}
        doUpdateTemplate={props.onUpdateTemplate}
      /> : null
    }
  </div>
;

Toolbar.propTypes = {
  onTogglePresentationMode: func.isRequired,
  template: string.isRequired,
  onUpdateTemplate: func.isRequired,
  onToggleShareModal: func.isRequired,
  enableShareModalButton: bool.isRequired,
  readOnly: bool.isRequired,
};

export default Toolbar;
