import React from 'react';
import { describe, it } from 'mocha';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';

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
});
