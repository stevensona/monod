import React, { PropTypes, Component } from 'react';

const { string } = PropTypes;


export default class Footer extends Component {

  render() {
    return (
      <footer className="main">
        <div className="version">
          <span className="git-ref">
              <i className="fa fa-code-fork"></i>&nbsp;
              {this.props.version}
          </span>
        </div>
        <div className="credits">
          By the good folks at <a href="https://tailordev.fr" title="Read more about us" target="_blank">TailorDev</a>, 2016.
        </div>
      </footer>
    )
  }
}

Footer.propTypes = {
  version: string.isRequired
}
