import React, { Component, PropTypes } from 'react';
import Letter from './templates/Letter';
import Invoice from './templates/Invoice';
import Report from './templates/Report';

const { func } = PropTypes;


export const Templates = [
  {id: '', name: 'No template', component: {}},
  {id: 'letter', name: 'Letter', component: Letter},
  {id: 'invoice', name: 'Invoice', component: Invoice},
  {id: 'report', name: 'Report', component: Report}
]

export default class TemplateForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      template: ''
    };
  }

  handleTemplateChange(event) {
    const newTemplate = event.target.value;
    this.setState({template: newTemplate});
    this.props.doUpdateTemplate(newTemplate);
  }

  render() {
    const optionNodes = Templates.map((component, key) => {
      return (
        <option value={component.id} key={key}>{component.name}</option>
      )
    });

    return (
      <form id="templateForm">
        <select name="template" onChange={this.handleTemplateChange.bind(this)}>
          {optionNodes}
        </select>
      </form>
    );
  }
}

TemplateForm.propTypes = {
  doUpdateTemplate: func.isRequired
}
