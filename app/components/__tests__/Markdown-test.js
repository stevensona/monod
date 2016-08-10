import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it } = global;

import Markdown from '../Markdown';


describe('<Markdown />', () => {

  it('renders a block with markdown css class', () => {
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={() => {}}
        onUpdatePosition={() => {}}
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
      />
    );

    setTimeout(() => {
      expect(wrapper.render().find('.CodeMirror')).to.have.length(1);
    });
  });

  it('calls onChange when a default value is provided', () => {
    const spy = sinon.spy();
    mount(
      <Markdown
        content={"foo"}
        onChange={spy}
        onUpdatePosition={() => {}}
      />
    );

    setTimeout(() => {
      expect(spy.calledOnce).to.be.true;
    });
  });

  it('calls onChange when a text is entered', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={spy}
        onUpdatePosition={() => {}}
      />
    );

    setTimeout(() => {
      wrapper.instance().getCodeMirror().getDoc().setValue('hello');
      expect(spy.calledOnce).to.be.true;
    });
  });

  it('calls onUpdatePosition when scrolling', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Markdown
        content={""}
        onChange={() => {}}
        onUpdatePosition={spy}
      />
    );

    setTimeout(() => {
      const codeMirror = wrapper.instance().getCodeMirror();

      // CodeMirror won't scroll if it has no value
      codeMirror.getDoc().setValue('hello world!');
      codeMirror.scrollTo(0, 10);

      expect(spy.called).to.be.true;
    });
  });
});
