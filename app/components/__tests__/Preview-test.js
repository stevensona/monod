import React from 'react';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Preview from '../Preview';


describe('<Preview />', () => {

  it('renders a block with preview css class', () => {
    const wrapper = shallow(<Preview raw={""} />);
    expect(wrapper.find('.preview')).to.have.length(1);
  });

  it('renders content', () => {
    const wrapper = render(<Preview raw={"foo"} />);
    expect(wrapper.find('.rendered').text()).to.contain('foo');
  });

  it('converts markdown into HTML', () => {
    const wrapper = render(<Preview raw={"*italic*"} />);
    expect(wrapper.find('.rendered').html()).to.contain('<em>italic</em>');
  });

  it('converts Emoji', () => {
    const wrapper = render(<Preview raw={" :)"} />);
    expect(wrapper.find('.rendered').html()).to.contain(
      '<span class="emoji emoji-smile" title=":smile:"></span>'
    );
  });
});
