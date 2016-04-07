import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Loader from 'react-loader';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Editor, {EditorModes} from '../Editor';
import Markdown from '../Markdown';
import Preview from '../Preview';


describe('<Editor />', () => {

  it('renders Markdown component', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    expect(wrapper.find(Markdown)).to.have.length(1);
  });

  it('renders Preview component', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    expect(wrapper.find(Preview)).to.have.length(1);
  });

  it('calls onContentUpdate() when text is entered in Markdown component', () => {
    const spy = sinon.spy();

    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={spy}
      />
    );
    const content = 'Hello, World';

    wrapper.find('Markdown').simulate('change', content);

    expect(spy.calledOnce).to.be.true;
  });

  it('renders a Loader component', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );

    expect(wrapper.find(Loader)).to.have.length(1);
  });

  it('does not display the editor until content is loaded', () => {
    const wrapper = mount(
      <Editor
        loaded={false}
        content={''}
        onContentUpdate={() => {}}
      />
    );

    expect(wrapper.find('.editor')).to.have.length(0);
  });

  it('removes loader once content is loaded', () => {
    // this test triggers a warning message because it is currently not
    // possible to pass a context to child components :-(
    const wrapper = mount(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );

    expect(wrapper.find('.editor')).to.have.length(1);
  });

  it('calls onContentUpdate prop on change', () => {
    const spy = sinon.spy();
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={spy}
        />
    );

    wrapper.find('Markdown').simulate('change');

    expect(spy.called).to.be.true;
  });

  it('switches from preview to reading mode', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    const verticalHandlerWrapper = wrapper.find('VerticalHandler').shallow();

    // Mock the click event
    verticalHandlerWrapper
      .find('.left')
      .simulate('click', {target: {className: 'left'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.READING);
  });

  it('switches from preview to reading mode and then back to preview mode', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    const verticalHandlerWrapper = wrapper.find('VerticalHandler').shallow();

    // Mock the click event
    verticalHandlerWrapper
      .find('.left')
      .simulate('click', {target: {className: 'left'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.READING);

    verticalHandlerWrapper
      .find('.right')
      .simulate('click', {target: {className: 'right'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.PREVIEW);
  });

  it('switches from preview to focus mode', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    const verticalHandlerWrapper = wrapper.find('VerticalHandler').shallow();

    // Mock the click event
    verticalHandlerWrapper
      .find('.right')
      .simulate('click', {target: {className: 'right'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.FOCUS);
  });

  it('switches from preview to focus mode and then back to preview mode', () => {
    const wrapper = shallow(
      <Editor
        loaded={true}
        content={''}
        onContentUpdate={() => {}}
      />
    );
    const verticalHandlerWrapper = wrapper.find('VerticalHandler').shallow();

    // Mock the click event
    verticalHandlerWrapper
      .find('.right')
      .simulate('click', {target: {className: 'right'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.FOCUS);

    verticalHandlerWrapper
      .find('.left')
      .simulate('click', {target: {className: 'left'}});

    expect(wrapper.state('mode')).to.be.equal(EditorModes.PREVIEW);
  });
});
