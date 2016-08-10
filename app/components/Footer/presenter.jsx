import React, { PropTypes } from 'react';


const Footer = (props) =>
  <footer className="main">
    <div className="version">
      <span className="git-ref">
        <i className="fa fa-code-fork"></i>&nbsp;{props.version}
      </span>
    </div>

    {props.children ? props.children : null}

    <div className="credits">
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
  </footer>
;

Footer.propTypes = {
  version: PropTypes.string.isRequired,
  children: PropTypes.object,
};

export default Footer;
