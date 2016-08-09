/* eslint one-var: 0 */
import React from 'react';
import Reveal from 'reveal.js';
import BaseTemplate from './Base';

import '../../scss/reveal.css';
import '../../scss/reveal-theme.css';

const { number, array, string } = React.PropTypes;

// transforms a chunk set into subsets for Reveal sections
const splitContentIntoSections = (content, separator) => {
  const sections = [];

  let chunks = [];
  content.forEach((chunk) => {
    if ('preview-loader' === chunk.key) {
      return;
    }

    if (chunk.props && separator === chunk.props.chunk[0].markup) {
      if (0 < chunks.length) {
        sections.push(chunks);
        chunks = [];
      }
    } else {
      chunks.push(chunk);
    }
  });
  sections.push(chunks);

  return sections;
};

/**
 * Slidedeck template
 */
export default class Slidedeck extends BaseTemplate {

  getDefaultData() {
    return {
      transition: 'default',
    };
  }

  componentDidMount() {
    Reveal.initialize({
      embedded: true,
      slideNumber: true,
      progress: false,
      help: false,
      margin: 0,
      keyboard: {
        70: null,
      },
    });

    window.Reveal = Reveal;
  }

  componentDidUpdate() {
    Reveal.layout();
  }

  render() {
    const data = this.getData();
    const slides = splitContentIntoSections(this.props.content, '---');

    return (
      <div className="reveal">
        <div className="slides">
          {slides.map((section, index) =>
            <Section
              key={`section-${index}`}
              id={index}
              transition={data.transition}
              content={section}
            />
          )}
        </div>
      </div>
    );
  }
}

const Section = (props) => {
  const slides = splitContentIntoSections(props.content, '----');

  return (
    <section
      data-transition={props.transition}
    >
      {1 < slides.length ? slides.map((slide, index) =>
        <section
          key={`section-${props.id}-${index}`}
          data-transition={props.transition}
        >
          {slide}
        </section>
      ) : slides}
    </section>
  );
};

Section.propTypes = {
  content: array.isRequired,
  transition: string.isRequired,
  id: number.isRequired,
};
