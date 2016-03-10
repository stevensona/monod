import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import VerticalHandler from '../VerticalHandler';


describe('<VerticalHandler />', () => {

  it('renders a block with vertical-handler css class', () => {
    const wrapper = shallow(<VerticalHandler />);
    expect(wrapper.find('.vertical-handler')).to.have.length(1);
  });

  it('renders children blocks with left/right css class', () => {
    const wrapper = shallow(<VerticalHandler />);
    expect(wrapper.find('.left')).to.have.length(1);
    expect(wrapper.find('.right')).to.have.length(1);
  });
});
