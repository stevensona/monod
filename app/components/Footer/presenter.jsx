import React, { PropTypes } from 'react';


const Footer = (props) =>
  <footer className="main">
    <div className="credits" title="Well, no there is nothing special here">
      By the good folks at&nbsp;
      <a
        href="https://tailordev.fr"
        title="Read more about us"
        target="_blank"
        rel="noopener noreferrer"
      >
        TailorDev
      </a>, 2016.
    </div>

    <div className="info-bar">
      {props.children ? props.children : null}

      <div className="version">
        <span className="git-ref" title="This is the current version of Monod">
          <i className="fa fa-code-fork" />&nbsp;{props.version}
        </span>
      </div>
    </div>
  </footer>
;

Footer.propTypes = {
  version: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default Footer;
