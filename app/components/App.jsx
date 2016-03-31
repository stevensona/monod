import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';
import debounce from 'lodash.debounce';

import Header from './Header';
import Editor from './Editor';
import Footer from './Footer';

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

  redirect(document, uri) {
    this.setState({
      loaded: true,
      document: document
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
      // mouhahaha
      alert([
        'We were unable to decrypt the document. Either the secret has not',
        'been supplied or it is invalid.',
        'We have redirected you to a new document.'
      ].join(' '));

      this.redirect(state.document, '/');
    });

    this.props.controller.on(Events.DOCUMENT_NOT_FOUND, (state) => {
      // mouhahaha (2)
      alert([
        'We could not find the document you were trying to load, so we have',
        'redirected you to a new document.'
      ].join(' '));

      this.redirect(state.document, '/');
    });

    this.props.controller.on(Events.CONFLICT, (state) => {
      this.setState({
        backupUrl: `/${state.old.document.uuid}#${state.old.secret}`
      });
    });

    this.props.controller.on(Events.CHANGE, (state) => {
      this.redirect(state.document, `/${state.document.uuid}#${state.secret}`);
    });

    this.props.controller.dispatch('action:init', {
      id: window.location.pathname.slice(1),
      secret: window.location.hash.slice(1)
    });
  }

  updateContent(content) {
    const doc = this.state.document;

    if (doc.content !== content) {
      doc.content = content;
      this.props.controller.dispatch('action:update', doc);
    }
  }

  render() {
    let oldDocument = '';
    if (this.state.backupUrl) {
      oldDocument = (
        <div>
          Snap! The document you are working on has been updated. We created a
          backup of your work <a href={this.state.backupUrl}>here</a>,
          and the current document has been updated with the up-to-date content.
        </div>
      );
    }

    return (
      <div className="layout">
        <Header />
        {oldDocument}
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
