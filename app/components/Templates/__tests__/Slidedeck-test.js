import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Slidedeck from '../Slidedeck';
import PreviewChunk from '../../Preview/PreviewChunk';


describe('<Slidedeck />', () => {

  let id = 0;
  const mockPreviewChunk = (content) => {
    id++;
    return (
      <PreviewChunk
        id={`${id}`}
        key={`${id}`}
        markdownIt={{
          renderer: {
            render: (content) => content
          },
          options: {},
        }}
        emojione={{
          toImage: (content) => content,
        }}
        chunk={[ { markup: content } ]}
        markdownItEnv={{}}
      />
    );
  };

  it('renders a Reveal slide deck', () => {
    const wrapper = shallow(
      <Slidedeck
        content={['this is content']}
        data={{}}
      />
    );

    expect(wrapper.find('.reveal')).to.have.length(1);
  });

  it('converts a preview chunk into a section', () => {
    const wrapper = shallow(
      <Slidedeck
        content={[
          mockPreviewChunk('this is content')
        ]}
        data={{}}
      />
    );

    expect(wrapper.find('Section')).to.have.length(1);
  });

  it('creates a new section after a separator', () => {
    const wrapper = shallow(
      <Slidedeck
        content={[
          mockPreviewChunk('this is content'),
          mockPreviewChunk('---'),
          mockPreviewChunk('this is content')
        ]}
        data={{}}
      />
    );

    expect(wrapper.find('Section')).to.have.length(2);
  });

  it('configures transitions based on YAML front matter', () => {
    const wrapper = shallow(
      <Slidedeck
        content={[
          mockPreviewChunk('this is content')
        ]}
        data={{
          transition: 'concave'
        }}
      />
    );

    const section = wrapper.find('Section');

    expect(section).to.have.length(1);
    expect(section.prop('transition')).to.equal('concave');
  });

  it('supports vertical slides', () => {
    const wrapper = shallow(
      <Slidedeck
        content={[
          mockPreviewChunk('this is content'),
          mockPreviewChunk('----'),
          mockPreviewChunk('this is content')
        ]}
        data={{}}
      />
    );

    expect(wrapper.find('Section')).to.have.length(1);
    expect(wrapper.html()).to.contain(
      '<section data-transition="default"><section data-transition="default">'
    );
  });

  it('supports mixed horizontal and vertical slides', () => {
    const wrapper = shallow(
      <Slidedeck
        content={[
          mockPreviewChunk('Slide 1'),
          mockPreviewChunk('---'),
          mockPreviewChunk('Slide 2'),
          mockPreviewChunk('----'),
          mockPreviewChunk('Slide 2.1'),
          mockPreviewChunk('---'),
          mockPreviewChunk('Slide 3'),
        ]}
        data={{}}
      />
    );

    expect(wrapper.find('Section')).to.have.length(3);
    expect(wrapper.find('Section').at(0).html()).not.to.contain(
      '</section></section>'
    );
    expect(wrapper.find('Section').at(1).html()).to.contain(
      '</section></section>'
    );
    expect(wrapper.find('Section').at(2).html()).not.to.contain(
      '</section></section>'
    );
  });
});
