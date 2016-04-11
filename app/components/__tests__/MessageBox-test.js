import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import {MessageBox} from '../MessageBox';


describe('<MessageBox />', () => {

  it('renders nothing if no props', () => {
    const wrapper = shallow(<MessageBox />);

    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('renders a message', () => {
    const message = {
      content: 'hello.'
    };
    const wrapper = shallow(<MessageBox message={message} />);

    expect(wrapper.find('.message-box')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });

it('renders a typed message', () => {
    const message = {
      content: 'hello.',
      type: 'info'
    };
    const wrapper = shallow(<MessageBox message={message} />);

    expect(wrapper.find('.message-box.info')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });
});
