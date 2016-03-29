import React, { PropTypes, Component } from 'react';

const { array } = PropTypes;


export default class TemplateForm extends Component {

  render() {
    const optionNodes = this.props.components.map(function(component) {
      return (
        <option value="{component.templateKey}">{component.templateName}</option>
      )
    });
    return (
      <form id="templateForm">
        <select name="template">
          <option selected="selected">Select a template to render</option>
          {optionNodes}
        </select>
      </form>
    );
  }
}

TemplateForm.propTypes = {
  components: array.isRequired
}
