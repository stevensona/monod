import React, { Component, PropTypes } from 'react';
import Codemirror from 'react-codemirror';

import 'codemirror/mode/gfm/gfm';
import 'codemirror/mode/css/css';
import 'codemirror/mode/dockerfile/dockerfile';
import 'codemirror/mode/elm/elm';
import 'codemirror/mode/gherkin/gherkin';
import 'codemirror/mode/go/go';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/perl/perl';
import 'codemirror/mode/php/php';
import 'codemirror/mode/properties/properties';
import 'codemirror/mode/python/python';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/twig/twig';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/lib/codemirror.css';

const { func, string } = PropTypes;

export default class Markdown extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.raw !== nextProps.raw;
  }

  getCodeMirror() {
    return this.refs.markdownTextarea.getCodeMirror();
  }

  handleOnScroll() {
    const { top, height, clientHeight } = this.getCodeMirror().getScrollInfo();

    if (top <= clientHeight / 10) {
      this.props.doUpdatePosition(top / height);
    } else {
      this.props.doUpdatePosition((top + clientHeight) / height);
    }
  }

  render() {
    var options = {
      autofocus: true,
      lineNumbers: true,
      lineWrapping: true,
      mode: 'gfm',
      scrollbarStyle: null,
      theme: 'monod'
    };

    return (
      <div className="markdown" onScroll={this.handleOnScroll.bind(this)}>
        <Codemirror
          ref="markdownTextarea"
          placeholder="Type your *markdown* content here"
          onChange={this.props.onChange}
          value={this.props.raw}
          options={options}
        />
      </div>
    );
  }
}

Markdown.propTypes = {
  raw: string.isRequired,
  onChange: func.isRequired,
  doUpdatePosition: func.isRequired
}
