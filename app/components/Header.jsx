import React, { PropTypes } from 'react';

import Toolbar from './Toolbar';

const { func, string } = PropTypes;

const Header = (props) =>
  <header className="main">
    <h1>Monod <small>The Markdown Editor</small></h1>
    <Toolbar
      onTogglePresentationMode={props.onTogglePresentationMode}
      template={props.template}
      onUpdateTemplate={props.onUpdateTemplate}
    />
  </header>
;

Header.propTypes = {
  onTogglePresentationMode: func.isRequired,
  template: string.isRequired,
  onUpdateTemplate: func.isRequired
};

export default Header;
