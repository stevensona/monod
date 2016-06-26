/* eslint one-var: 0 */
import React from 'react';
import BaseTemplate from './Base';
import Reveal from 'reveal.js';

import '../../scss/reveal.css';
import '../../scss/reveal-theme.css';

/**
 * Slidedeck template
 */
export default class Slidedeck extends BaseTemplate {

  getDefaultData() {
    return {};
  }

  componentDidMount() {
    Reveal.initialize({
      embedded: true,
      fragments: false,
      slideNumber: true,
      progress: false,
      help: false,
    });
  }

  render() {
    const sections = [];
    let itemsInSection = [];
    this.props.content.forEach((c) => {
      if ('preview-loader' === c.key) {
        return;
      }

      if (c.props && '---' === c.props.chunk[0].markup) {
        if (itemsInSection.length > 0) {
          sections.push(itemsInSection);
          itemsInSection = [];
        }
      } else {
        itemsInSection.push(c);
      }
    });
    sections.push(itemsInSection);

    return (
      <div className="reveal">
        <div className="slides">
          {sections.map((section, index) =>
            <section key={`section-${index}`}>
              {section}
            </section>
          )}
        </div>
      </div>
    );
  }
}
