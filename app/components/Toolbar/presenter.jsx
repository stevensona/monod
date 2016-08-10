import React, { PropTypes } from 'react';

import TemplateForm from './TemplateForm';
import FullscreenButton from './FullscreenButton';


const Toolbar = (props) =>
  <div id="toolbar">
    <div className="actions">
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
};

export default Toolbar;
