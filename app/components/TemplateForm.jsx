import React, { PropTypes } from 'react';
import Letter from './templates/Letter';
import Invoice from './templates/Invoice';
import Report from './templates/Report';
import Slidedeck from './templates/Slidedeck';

const { string, func } = PropTypes;


export const Templates = [
  { id: '', name: 'No template', component: {} },
  { id: 'letter', name: 'Letter', component: Letter },
  { id: 'invoice', name: 'Invoice', component: Invoice },
  { id: 'report', name: 'Report', component: Report },
  { id: 'slidedeck', name: 'Slide deck', component: Slidedeck },
];

const TemplateForm = (props) =>
  <form id="templateForm">
    <select
      name="template"
      onChange={props.doUpdateTemplate}
      value={props.template}
    >
      {Templates.map((component, key) => {
        return (
          <option
            value={component.id}
            key={key}
          >
            {component.name}
          </option>
        );
      })}
    </select>
  </form>
;

TemplateForm.propTypes = {
  template: string.isRequired,
  doUpdateTemplate: func.isRequired
};

export default TemplateForm;
