import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Markdown from '../Markdown';


describe('<Markdown />', () => {

  it('renders a block with markdown css class', () => {
    const wrapper = shallow(<Markdown raw={""} onChange={() => {}} />);
    expect(wrapper.find('.markdown')).to.have.length(1);
  });

  it('calls onChange when text is entered', () => {
    const spy = sinon.spy();
    const wrapper = shallow(<Markdown raw={""} onChange={spy} />);
    const content = 'Hello, World';

    wrapper.find('textarea').simulate('change', { value: content });

    expect(spy.calledOnce).to.be.true;
  });
});
