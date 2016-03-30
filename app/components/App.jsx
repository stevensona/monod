import React, { Component, PropTypes } from 'react';
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

  componentDidMount() {
    this.props.controller.on('store:notfound, store:invalid', (state) => {
      if (state) {
        this.setState({ document: state.document });
      }

      this.setState({ loaded: true });
    });

    this.props.controller.on('store:change', (state) => {
      this.setState({
        document: state.document,
        loaded: true
      });

      window.history.pushState(
        {}, '', `/${state.document.uuid}#${state.secret}`
      );
    });

    this.props.controller.dispatch('action:init', {
      id: window.location.pathname.slice(1),
      secret: window.location.hash.slice(1)
    });
  }

  updateContent(content) {
    const doc    = this.state.document;
    doc.content  = content;

    this.props.controller.dispatch('action:update', doc);
  }

  render() {
    return (
      <div className="layout">
        <Header />
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
