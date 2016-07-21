import React, { PropTypes } from 'react';
import Sync from './Sync';

const { string } = PropTypes;


const Footer = (props) =>
  <footer className="main">
    <div className="version">
      <span className="git-ref">
        <i className="fa fa-code-fork"></i>&nbsp;&nbsp;{props.version}
      </span>
    </div>

    <div className="help">
      <span className="help-link">
        <i className="fa fa-book"></i>
        &nbsp;&nbsp;
        <a
          href="https://github.com/TailorDev/monod/blob/master/doc/writing.md"
          title="The Monod documentation"
          target="_blank"
        >
          Documentation
        </a>
      </span>
    </div>

    <Sync />

    <div className="credits">
      By the good folks at <a href="https://tailordev.fr" title="Read more about us" target="_blank">TailorDev</a>, 2016.
    </div>
  </footer>
;

Footer.propTypes = {
  version: string.isRequired
};

export default Footer;
