import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Markdown from '../Markdown';


describe('<Markdown />', () => {

  let context;

  before(() => {
    context = {
      controller: {
        on: () => {}
      }
    };
  });

  it('renders a block with markdown css class', () => {
    const wrapper = mount(
      <Markdown
        raw={""}
        onChange={() => {}}
        doUpdatePosition={() => {}}
      />,
      { context }
    );
    expect(wrapper.find('.markdown')).to.have.length(1);
  });

  it('renders a CodeMirror block', () => {
    const wrapper = mount(
      <Markdown
        raw={""}
        onChange={() => {}}
        doUpdatePosition={() => {}}
      />,
      { context }
    );

    setTimeout(() => {
      expect(wrapper.render().find('.CodeMirror')).to.have.length(1);
    }, 5);
  });

  it('calls onChange when a default value is provided', () => {
    const spy = sinon.spy();
    mount(
      <Markdown
        raw={"foo"}
        onChange={spy}
        doUpdatePosition={() => {}}
      />,
      { context }
    );

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
    }, 5);
  });

  it('calls onChange when a text is entered', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        raw={""}
        onChange={spy}
        doUpdatePosition={() => {}}
      />,
      { context }
    );

    setTimeout(() => {
      wrapper.instance().getCodeMirror().getDoc().setValue('hello');
      expect(spy.calledOnce).to.be.true;
    }, 5);
  });

  it('calls doUpdatePosition when scrolling', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        raw={""}
        onChange={() => {}}
        doUpdatePosition={spy}
      />,
      { context }
    );

    setTimeout(() => {
      const codeMirror = wrapper.instance().getCodeMirror();

      // CodeMirror won't scroll if it has no value
      codeMirror.getDoc().setValue('hello world!');
      codeMirror.scrollTo(0, 10);

      expect(spy.called).to.be.true;
    }, 5);
  });
});
