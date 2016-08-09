import React, { PropTypes } from 'react';

import Toolbar from './Toolbar';

const { bool, func, string } = PropTypes;

const Header = (props) =>
  <header className="main">
    <h1>Monod <small>The Markdown Editor</small></h1>
    <Toolbar
      {...props}
    />
  </header>
;

Header.propTypes = {
  onTogglePresentationMode: func.isRequired,
  template: string.isRequired,
  onUpdateTemplate: func.isRequired,
  onToggleShareModal: func.isRequired,
  enableShareModalButton: bool.isRequired,
};

export default Header;
