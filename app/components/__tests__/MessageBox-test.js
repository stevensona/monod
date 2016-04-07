import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import MessageBox from '../MessageBox';


describe('<MessageBox />', () => {

  it('renders nothing if no props', () => {
    const wrapper = shallow(<MessageBox />);

    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('renders a message', () => {
    const wrapper = shallow(<MessageBox message={'hello.'} />);

    expect(wrapper.find('.message-box')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.');
  });
});
