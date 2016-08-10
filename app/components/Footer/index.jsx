import React, { PropTypes } from 'react';

import DefaultFooter from './presenter';
import Sync from '../Sync';

const Footer = (props) =>
  <DefaultFooter version={props.version}>
    <div className="help">
      <span className="help-link">
        <i className="fa fa-book" />
        &nbsp;&nbsp;
        <a
          href="https://github.com/TailorDev/monod/blob/master/doc/writing.md"
          title="The Monod documentation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
      </span>
    </div>

    <Sync />

  </DefaultFooter>
;

Footer.propTypes = {
  version: PropTypes.string.isRequired,
};

export default Footer;
