import React, { PropTypes } from 'react';

import TemplateForm from './TemplateForm';

const { func, string } = PropTypes;

const Toolbar = (props) =>
  <div id="toolbar">
    <TemplateForm
      template={props.template}
      doUpdateTemplate={props.onUpdateTemplate}
    />
  </div>
;

Toolbar.propTypes = {
  template: string.isRequired,
  onUpdateTemplate: func.isRequired
};

export default Toolbar;
