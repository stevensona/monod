import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Markdown from '../Markdown';


describe('<Markdown />', () => {

  it('renders a block with markdown css class', () => {
    const wrapper = mount(<Markdown raw={""} onChange={() => {}} doUpdatePosition={() => {}} />);
    expect(wrapper.find('.markdown')).to.have.length(1);
  });

  it('calls onChange when a default value is provided', () => {
    const spy = sinon.spy();
    const wrapper = mount(<Markdown raw={"foo"} onChange={spy} doUpdatePosition={() => {}} />);

    expect(spy.calledOnce).to.be.true;
  });

  it('calls onChange when a text is entered', () => {
    const spy = sinon.spy();
    const wrapper = mount(<Markdown raw={""} onChange={spy} doUpdatePosition={() => {}} />);

    wrapper.instance().getCodeMirror().getDoc().setValue('hello');

    expect(spy.calledOnce).to.be.true;
  });

  it('calls doUpdatePosition when scrolling', () => {
    const spy = sinon.spy();
    const wrapper = mount(<Markdown raw={""} onChange={() => {}} doUpdatePosition={spy} />);

    (new Promise(() => { wrapper.simulate('scroll') })).then(() => {
      expect(spy.called).to.be.true;
    });
  });
});
