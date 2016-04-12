import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import App from '../App';
import Header from '../Header';
import Editor from '../Editor';
import Footer from '../Footer';


describe('<App />', () => {

  const version = 'dummy';

  it('renders Header component', () => {
    const wrapper = shallow(<App version={version} />);
    expect(wrapper.find(Header)).to.have.length(1);
  });

  it('renders Editor component', () => {
    const wrapper = shallow(<App version={version} />);
    expect(wrapper.find(Editor)).to.have.length(1);
  });

  it('renders Footer component', () => {
    const wrapper = shallow(<App version={version} />);
    expect(wrapper.find(Footer)).to.have.length(1);
  });

  it('should create a document object', () => {
    const wrapper = shallow(<App version={version} />);
    expect(wrapper.state('document')).to.be.an('object');
  });

  it('calls the init action on mount', () => {
    const spy = sinon.spy();
    const controller = {
      on: () => {},
      dispatch: spy
    };

    const wrapper = mount(<App version={version} controller={controller} />);

    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith('action:init')).to.be.true;
  });
});
