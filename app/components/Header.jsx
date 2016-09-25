import React, { PropTypes } from 'react';

import Toolbar from './Toolbar';


const Header = props =>
  <header className="main">
    <h1>Monod <small>The Markdown Editor</small></h1>
    <Toolbar {...props} />
  </header>
;

Header.propTypes = {
  onTogglePresentationMode: PropTypes.func.isRequired,
  onToggleShareModal: PropTypes.func.isRequired,
};

export default Header;
