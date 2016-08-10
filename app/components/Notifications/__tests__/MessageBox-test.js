import Immutable from 'immutable';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import MessageBoxes, { MessageBox } from '../MessageBox';


describe('<MessageBox />', () => {

  it('renders nothing if no props', () => {
    const wrapper = shallow(<MessageBox message={{}} doClose={() => {}} index={0} />);

    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('renders a message', () => {
    const message = {
      content: 'hello.'
    };
    const wrapper = shallow(<MessageBox message={message} doClose={() => {}} index={0} />);

    expect(wrapper.find('.message-box')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });

  it('renders a typed message', () => {
    const message = {
      content: 'hello.',
      type: 'info'
    };
    const wrapper = shallow(<MessageBox message={message} doClose={() => {}} index={0} />);

    expect(wrapper.find('.message-box.info')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });
});


describe('<MessageBoxes />', () => {

  it('renders nothing if no messages', () => {
    const wrapper = shallow(<MessageBoxes messages={Immutable.List()} closeMessageBox={() => {}} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('wraps a typed message box', () => {
    const messages = Immutable.List([
      {
        content: 'foo',
        type: 'error'
      }
    ]);
    const wrapper = mount(<MessageBoxes messages={messages} closeMessageBox={() => {}} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find(MessageBox)).to.have.length(1);
    expect(wrapper.find('.message-box.error')).to.have.length(1);
    expect(wrapper.find('.message-box.error').html()).to.contain('<p>foo</p>');
  });

  it('wraps many typed message boxes', () => {
    const messages = Immutable.List([
      {
        content: 'foo',
        type: 'warning'
      },
      {
        content: 'bar',
        type: 'success'
      },
      {
        content: 'lol',
        type: 'info'
      }
    ]);
    const wrapper = mount(<MessageBoxes messages={messages} closeMessageBox={() => {}} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find(MessageBox)).to.have.length(3);
    expect(wrapper.find('.message-box.warning')).to.have.length(1);
    expect(wrapper.find('.message-box.success')).to.have.length(1);
    expect(wrapper.find('.message-box.info')).to.have.length(1);
    expect(wrapper.find('.message-box.warning').html()).to.contain('<p>foo</p>');
    expect(wrapper.find('.message-box.success').html()).to.contain('<p>bar</p>');
    expect(wrapper.find('.message-box.info').html()).to.contain('<p>lol</p>');
  });

  it('calls close message box handler', () => {
    const spy = sinon.spy();

    const messages = Immutable.List([
      {
        content: 'foo',
        type: 'warning'
      },
      {
        content: 'bar',
        type: 'success'
      },
      {
        content: 'lol',
        type: 'info'
      }
    ]);
    const wrapper = mount(<MessageBoxes messages={messages} closeMessageBox={spy} />);

    // Close the info message
    wrapper.find('.message-box.info').children('.close-button').simulate('click');
    expect(spy.calledOnce).to.be.true;

    // Close the warning message
    wrapper.find('.message-box.warning').children('.close-button').simulate('click');
    expect(spy.calledTwice).to.be.true;

    // Close the success message
    wrapper.find('.message-box.success').children('.close-button').simulate('click');
    expect(spy.calledThrice).to.be.true;

    // Check that the handler is called with proper arguments
    expect(spy.withArgs(0).calledOnce).to.be.true;
    expect(spy.withArgs(1).calledOnce).to.be.true;
    expect(spy.withArgs(2).calledOnce).to.be.true;
  });
});
