import React, { Component, PropTypes } from 'react';

const { func } = PropTypes;

export const monodTemplates = [
  {id: 'mail', 'name': 'Mail'},
  {id: 'report', 'name': 'Report'},
  {id: 'notebook', 'name': 'Notebook'}
]

export default class TemplateForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      template: ''
    };
  }

  handleTemplateChange(event) {
    this.setState({template: event.target.value});
    this.props.doUpdateTemplate(this.state.template);
  }

  render() {
    console.log('template form state', this.state);

    const optionNodes = monodTemplates.map((component, key) => {
      return (
        <option value={component.id} key={key}>{component.name}</option>
      )
    });

    return (
      <form id="templateForm">
        <select name="template" onChange={this.handleTemplateChange.bind(this)}>
          <option defaultValue>Select a template to render</option>
          {optionNodes}
        </select>
      </form>
    );
  }
}

TemplateForm.propTypes = {
  doUpdateTemplate: func.isRequired
}
