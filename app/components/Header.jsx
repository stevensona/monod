import React from 'react';
import TemplateForm from './TemplateForm';

const templates = [
    {templateKey: 'mail', 'templateName': 'Mail'},
    {templateKey: 'report', 'templateName': 'Report'},
    {templateKey: 'notebook', 'templateName': 'Notebook'}
]

export default () => (
  <header className="main">
    <h1>Monod <small>The Markdown Editor</small></h1>
    <TemplateForm components={templates} />
  </header>
);