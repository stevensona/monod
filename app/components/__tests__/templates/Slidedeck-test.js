import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Slidedeck from '../../templates/Slidedeck';
import { PreviewChunk } from '../../Preview';


describe('<Slidedeck />', () => {

  let key = 0;
  const mockPreviewChunk = (content) => {
    return (
      <PreviewChunk
        key={key++}
        markdownIt={{}}
        emojione={{}}
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

    expect(wrapper.find('section')).to.have.length(1);
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

    expect(wrapper.find('section')).to.have.length(2);
  });
});
