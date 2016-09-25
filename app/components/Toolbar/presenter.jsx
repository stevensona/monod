import React, { PropTypes } from 'react';

import TemplateForm from './TemplateForm';
import FullscreenButton from './FullscreenButton';
import ShareModalButton from './ShareModalButton';


const Toolbar = props =>
  <div id="toolbar">
    <div className="actions">
      <ShareModalButton
        onToggleShareModal={props.onToggleShareModal}
        enableShareModalButton={props.enableShareModalButton}
      />
      <FullscreenButton
        onTogglePresentationMode={props.onTogglePresentationMode}
      />
    </div>
    <TemplateForm
      template={props.template}
      onUpdateTemplate={props.onUpdateTemplate}
    />
  </div>
;

Toolbar.propTypes = {
  template: PropTypes.string.isRequired,
  onUpdateTemplate: PropTypes.func.isRequired,
  onTogglePresentationMode: PropTypes.func.isRequired,
  onToggleShareModal: PropTypes.func.isRequired,
  enableShareModalButton: PropTypes.bool.isRequired,
};

export default Toolbar;
