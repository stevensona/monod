import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';
import debounce from 'lodash.debounce';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';
import MessageBox from './MessageBox';

const { string } = PropTypes;


export default class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      document: { content: '' },
      loaded: false
    };

    this.updateContent = debounce(this.updateContent, 150);
  }

  getChildContext() {
    // Pass the controller to child components.
    return {
      controller: this.props.controller
    };
  }

  loadAndRedirect(document, uri, message) {
    this.setState({
      loaded: true,
      document: document,
      message: message || false
    });

    window.history.pushState({}, '', uri);
  }

  componentDidMount() {
    this.props.controller.on(Events.NO_DOCUMENT_ID, (state) => {
      this.setState({
        loaded: true,
        document: state.document
      });
    });

    this.props.controller.on(Events.DECRYPTION_FAILED, (state) => {
      const message = [
        'We were unable to decrypt the document. Either the secret has not',
        'been supplied or it is invalid.',
        'We have redirected you to a new document.'
      ].join(' ');

      this.loadAndRedirect(state.document, '/', message);
    });

    this.props.controller.on(Events.DOCUMENT_NOT_FOUND, (state) => {
      const message = [
        'We could not find the document you were trying to load, so we have',
        'redirected you to a new document.'
      ].join(' ');

      this.loadAndRedirect(state.document, '/', message);
    });

    this.props.controller.on(Events.CONFLICT, (state) => {
      const message = [
        'Snap! The document you were working on has been updated, so we have',
        ' forked it for you; You can find the original (and updated) content',
        ' at:',
        <a href={'/' + state.new.document.uuid + '#' + state.new.secret}>
          {'/' + state.new.document.uuid + '#' + state.new.secret}
        </a>
      ];

      this.loadAndRedirect(
        state.old.document,
        `/${state.old.document.uuid}#${state.old.secret}`,
        message
      );
    });

    this.props.controller.on(Events.UPDATE_WITHOUT_CONFLICT, () => {
      this.setState({
        message: [
          'We have updated the document you are viewing to its latest revision.',
          'Happy reading/working!'
        ].join(' ')
      });
    });

    this.props.controller.on(Events.CHANGE, (state) => {
      this.loadAndRedirect(state.document, `/${state.document.uuid}#${state.secret}`);
    });

    this.props.controller.dispatch('action:init', {
      id: window.location.pathname.slice(1),
      secret: window.location.hash.slice(1)
    });
  }

  updateContent(content) {
    const document = Object.assign({}, this.state.document);

    if (document.content !== content) {
      document.content = content;

      this.props.controller.dispatch('action:update', document);
    }
  }

  render() {
    return (
      <div className="layout">
        <Header />
        <MessageBox message={this.state.message || false} />
        <Editor
          loaded={this.state.loaded}
          content={this.state.document.content}
          onContentUpdate={this.updateContent.bind(this)}
        />
        <Footer version={this.props.version} />
      </div>
    );
  }
}

App.propTypes = {
  version: string.isRequired
};

App.childContextTypes = {
  controller: PropTypes.object
};
