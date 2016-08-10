import React, { Component, PropTypes } from 'react';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';
import Notifications from './Notifications';


export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { messages: [] };
  }

  componentDidMount() {
    /*
    this.props.controller.on(Events.NO_DOCUMENT_ID, (state) => {
      this.setState({
        loaded: true,
        document: state.document
      });
    });

    this.props.controller.on(Events.DECRYPTION_FAILED, (state) => {
      const message = {
        content: [
          'We were unable to decrypt the document. Either the secret has not',
          'been supplied or it is invalid.',
          'We have redirected you to a new document.'
        ].join(' '),
        type: 'error'
      };

      this.loadAndRedirect(state.document, '/', message);
    });

    this.props.controller.on(Events.DOCUMENT_NOT_FOUND, (state) => {
      const message = {
        content: [
          'We could not find the document you were trying to load, so we have',
          'redirected you to a new document.'
        ].join(' '),
        type: 'error'
      };

      this.loadAndRedirect(state.document, '/', message);
    });

    this.props.controller.on(Events.CONFLICT, (state) => {
      const message = {
        content: (
          <span>
            <i>Snap!</i>&nbsp;
            The document you were working on has been updated by a third,
            and you are now working on a fork. You can still find the original
            (and updated) document:&nbsp;
            <a href={`/${state.document.uuid}#${state.secret}`}>here</a>.
          </span>
        ),
        type: 'warning'
      };

      this.loadAndRedirect(
        state.fork.document,
        `/${state.fork.document.uuid}#${state.fork.secret}`,
        message
      );
    });

    this.props.controller.on(Events.UPDATE_WITHOUT_CONFLICT, (state) => {
      const message = {
        content: [
          'We have updated the document you are viewing to its latest revision.',
          'Happy reading/working!'
        ].join(' '),
        type: 'info'
      };

      this.setState({
        document: state.document,
        messages: this.state.messages.push(message)
      });
    });

    this.props.controller.on(`${Events.SYNCHRONIZE}, ${Events.CHANGE}`, (state) => {
      this.loadAndRedirect(
        state.document,
        `/${state.document.uuid}#${state.secret}`
      );
    });

    this.props.controller.dispatch('action:init', {
      id: window.location.pathname.slice(1),
      secret: window.location.hash.slice(1)
    });
    */
  }

  togglePresentationMode() {
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

  loadAndRedirect(doc, uri, message) {
    if (message) {
      this.state.messages.push(message);
    }

    this.setState({
      loaded: true,
      document: doc,
      messages: this.state.messages,
    });

    if (!window.history.state || !window.history.state.uuid ||
        (window.history.state && window.history.state.uuid &&
        doc.get('uuid') !== window.history.state.uuid)
    ) {
      window.history.pushState({ uuid: doc.get('uuid') }, `Monod - ${doc.get('uuid')}`, uri);
    }
  }

  render() {
    return (
      <div className="layout">
        <Header />

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
