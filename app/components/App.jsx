import React, { Component, PropTypes } from 'react';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';
import Notifications from './Notifications';
import ShareModal from './ShareModal';


export default class App extends Component {

  static togglePresentationMode() {
    if (
      (!document.fullscreenElement) &&
      (!document.webkitFullscreenElement) &&
      (!document.mozFullScreenElement) &&
      (!document.msFullscreenElement)
    ) {
      const element = document.getElementsByClassName('preview')[0];

      // Switch to fullscreen
      const requestMethod = element.requestFullScreen ||
                            element.webkitRequestFullscreen ||
                            element.webkitRequestFullScreen ||
                            element.mozRequestFullScreen ||
                            element.msRequestFullscreen;

      if (requestMethod) {
        requestMethod.apply(element);
      }
    }
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: [],
      displayShareModal: false,
    };

    this.toggleShareModal = this.toggleShareModal.bind(this);
  }

  toggleShareModal() {
    this.setState({ displayShareModal: !this.state.displayShareModal });
  }

  render() {
    return (
      <div className="layout">
        <Header
          onToggleShareModal={this.toggleShareModal}
          onTogglePresentationMode={App.togglePresentationMode}
        />

        <ShareModal
          isOpen={this.state.displayShareModal}
          onRequestClose={this.toggleShareModal}
          fullAccessURL={window.location.toString()}
        />

        <Notifications />

        <Editor />

        <Footer version={this.props.version} />
      </div>
    );
  }
}

App.propTypes = {
  version: PropTypes.string.isRequired,
};
