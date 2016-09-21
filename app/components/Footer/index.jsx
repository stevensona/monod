import React, { PropTypes } from 'react';

import DefaultFooter from './presenter';
import Sync from '../Sync';

const Footer = (props) =>
  <DefaultFooter version={props.version}>
    {props.locked ?
      <div className="lock">
        <span title="This document is locked and cannot be modified">
          <i className="fa fa-lock" />
        </span>
      </div>
      : null
    }

    <Sync />

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
  </DefaultFooter>
;

Footer.propTypes = {
  version: PropTypes.string.isRequired,
  locked: PropTypes.bool.isRequired,
};

Footer.defaultProps = {
  locked: false,
};

export default Footer;
