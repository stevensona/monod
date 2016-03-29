import React, { Component, PropTypes } from 'react';
import Sample from './templates/Sample';

const { func } = PropTypes;

export const monodTemplates = [
  {id: '', name: 'No template', component: {}},
  {id: 'sample', name: 'Sample', component: Sample}
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
    const optionNodes = monodTemplates.map((component, key) => {
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
