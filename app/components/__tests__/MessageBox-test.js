import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import MessageBoxes, { MessageBox } from '../MessageBox';


describe('<MessageBox />', () => {

  it('renders nothing if no props', () => {
    const wrapper = shallow(<MessageBox message={{}} doClose={() => {}} />);

    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('renders a message', () => {
    const message = {
      content: 'hello.'
    };
    const wrapper = shallow(<MessageBox message={message} doClose={() => {}} />);

    expect(wrapper.find('.message-box')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });

it('renders a typed message', () => {
    const message = {
      content: 'hello.',
      type: 'info'
    };
    const wrapper = shallow(<MessageBox message={message} doClose={() => {}} />);

    expect(wrapper.find('.message-box.info')).to.have.length(1);
    expect(wrapper.text()).to.equal('hello.×');
  });
});


describe('<MessageBoxes />', () => {

  it('renders nothing if no messages', () => {
    const wrapper = shallow(<MessageBoxes messages={[]} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find('.message-box')).to.have.length(0);
  });

  it('wraps a typed message box', () => {
    const messages = [
      {
        content: 'foo',
        type: 'error'
      }
    ];
    const wrapper = mount(<MessageBoxes messages={messages} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find(MessageBox)).to.have.length(1);
    expect(wrapper.find('.message-box.error')).to.have.length(1);
    expect(wrapper.html()).to.have.contain('<p>foo</p>');
  });

  it('wraps many typed message boxes', () => {
    const messages = [
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
    ];
    const wrapper = mount(<MessageBoxes messages={messages} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find(MessageBox)).to.have.length(3);
    expect(wrapper.find('.message-box.warning')).to.have.length(1);
    expect(wrapper.find('.message-box.success')).to.have.length(1);
    expect(wrapper.find('.message-box.info')).to.have.length(1);
    expect(wrapper.html()).to.have.contain('<p>foo</p>');
    expect(wrapper.html()).to.have.contain('<p>bar</p>');
    expect(wrapper.html()).to.have.contain('<p>lol</p>');
  });

  it('closes message boxes', () => {
    const messages = [
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
    ];
    const wrapper = mount(<MessageBoxes messages={messages} />);

    expect(wrapper.find('.message-boxes')).to.have.length(1);
    expect(wrapper.find(MessageBox)).to.have.length(3);
    expect(wrapper.find('.message-box.warning')).to.have.length(1);
    expect(wrapper.find('.message-box.success')).to.have.length(1);
    expect(wrapper.find('.message-box.info')).to.have.length(1);

    // Close the warning message
    wrapper.find('.message-box.warning').children('.close-button').simulate('click');
    expect(wrapper.find(MessageBox)).to.have.length(2);
    expect(wrapper.find('.message-box.warning')).to.have.length(0);
    expect(wrapper.find('.message-box.success')).to.have.length(1);
    expect(wrapper.find('.message-box.info')).to.have.length(1);

    // Close the success message
    wrapper.find('.message-box.success').children('.close-button').simulate('click');
    expect(wrapper.find(MessageBox)).to.have.length(1);
    expect(wrapper.find('.message-box.warning')).to.have.length(0);
    expect(wrapper.find('.message-box.success')).to.have.length(0);
    expect(wrapper.find('.message-box.info')).to.have.length(1);

    // Close the info message
    wrapper.find('.message-box.info').children('.close-button').simulate('click');
    expect(wrapper.find(MessageBox)).to.have.length(0);
    expect(wrapper.find('.message-box.warning')).to.have.length(0);
    expect(wrapper.find('.message-box.success')).to.have.length(0);
    expect(wrapper.find('.message-box.info')).to.have.length(0);
  });
});
