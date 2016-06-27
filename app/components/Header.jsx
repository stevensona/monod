import React, { PropTypes } from 'react';

import Toolbar from './Toolbar';

const { func, string } = PropTypes;

const Header = (props) =>
  <header className="main">
    <h1>Monod <small>The Markdown Editor</small></h1>
    <Toolbar
      template={props.template}
      onUpdateTemplate={props.onUpdateTemplate}
    />
  </header>
;

Header.propTypes = {
  template: string.isRequired,
  onUpdateTemplate: func.isRequired
};

export default Header;
