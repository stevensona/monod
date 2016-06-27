import React, { PropTypes } from 'react';

import TemplateForm from './TemplateForm';

const { func, string } = PropTypes;

const Toolbar = (props) =>
  <div id="toolbar">
    <div className="actions">
      <button
        className="action fullscreen"
        title="Presentation mode"
        onClick={props.onTogglePresentationMode}
      >
        <i className="fa fa-play-circle" aria-hidden="true"></i>
      </button>
    </div>
    <TemplateForm
      template={props.template}
      doUpdateTemplate={props.onUpdateTemplate}
    />
  </div>
;

Toolbar.propTypes = {
  onTogglePresentationMode: func.isRequired,
  template: string.isRequired,
  onUpdateTemplate: func.isRequired
};

export default Toolbar;
