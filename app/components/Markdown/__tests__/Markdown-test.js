import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Markdown from '../index';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('<Markdown />', () => {

  it('renders a block with markdown css class', () => {
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={() => {}}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    expect(wrapper.find('.markdown')).to.have.length(1);
  });

  it('renders a CodeMirror block', () => {
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={() => {}}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    expect(wrapper.render().find('.CodeMirror')).to.have.length(1);
  });

  it('should not onChange when a default value is provided', () => {
    const spy = sinon.spy();
    mount(
      <Markdown
        content={"foo"}
        onChange={spy}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    expect(spy.called).to.be.false;
  });

  it('should not force content update when the same value is provided', (done) => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={"hello"}
        onChange={spy}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    try {
      wrapper.setProps({
        forceUpdate: false,
        content: "hello",
      });
    } catch (e) {
      return done(e);
    }

    done();
  });

  it('should force content update when specified', (done) => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={spy}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    try {
      wrapper.setProps({
        forceUpdate: true,
        content: "hello",
      });
    } catch (e) {
      return done();
    }

    done(new Error('Expected to trigger codeMirror, but did not.'));
  });

  it('should not call onChange if content is the same', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={"foo"}
        onChange={spy}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    wrapper.instance().onChange({ getValue: () => "foo" }, { origin: '' });

    expect(spy.called).to.be.false;
  });

  it('calls onChange when a text is entered', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={spy}
        onUpdatePosition={() => {}}
        forceUpdate={false}
      />
    );

    wrapper.instance().onChange({ getValue: () => "foo" }, { origin: '' });

    expect(spy.calledOnce).to.be.true;
  });

  it('calls onUpdatePosition when scrolling', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={"Hello world"}
        onChange={() => {}}
        onUpdatePosition={spy}
        forceUpdate={false}
      />
    );

    // cannot do better since we rely on jsdom
    const codeMirror = wrapper.instance().onScroll();

    expect(spy.called).to.be.true;
  });
});
