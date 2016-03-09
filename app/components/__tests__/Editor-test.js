import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Loader from 'react-loader';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it, Promise } = global;

import Editor from '../Editor';
import Markdown from '../Markdown';
import Preview from '../Preview';


describe('<Editor />', () => {

  const dummyLoadRaw = Promise.resolve();

  it('renders Markdown component', () => {
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={() => {}} />);
    expect(wrapper.find(Markdown)).to.have.length(1);
  });

  it('renders Preview component', () => {
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={() => {}} />);
    expect(wrapper.find(Preview)).to.have.length(1);
  });

  it('updates its state when text is entered in Markdown component', () => {
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={() => {}} />);
    const content = 'Hello, World';

    wrapper.find('Markdown').simulate('change', content);

    expect(wrapper.state('raw')).to.equal(content);
  });

  it('renders a Loader component', () => {
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={() => {}} />);

    expect(wrapper.find(Loader)).to.have.length(1);
  });

  it('does not display the editor until content is loaded', () => {
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={() => {}} />);

    expect(wrapper.state('loaded')).to.be.false;
    expect(wrapper.find('.editor')).to.have.length(0);
  });

  it('removes loader once content is loaded', (done) => {
    const content = 'some content';
    const loadRaw = Promise.resolve(content);
    const wrapper = mount(<Editor loadRaw={loadRaw} onSave={() => {}} />);

    setTimeout(() => {
      expect(wrapper.find('.editor')).to.have.length(1);
      expect(wrapper.state('raw')).to.equal(content);
      done();
    });
  });

  it('handles rejected Promise', (done) => {
    const loadRaw = Promise.reject();
    const wrapper = mount(<Editor loadRaw={loadRaw} onSave={() => {}} />);

    setTimeout(() => {
      expect(wrapper.find('.editor')).to.have.length(1);
      done();
    });
  });

  it('calls onSave prop on change', () => {
    const spy = sinon.spy();
    const wrapper = shallow(<Editor loadRaw={dummyLoadRaw} onSave={spy} />);

    wrapper.find('Markdown').simulate('change');

    expect(spy.called).to.be.true;
  });
});
