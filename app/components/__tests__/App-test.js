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

  it('renders Header component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Header)).to.have.length(1);
  });

  it('renders Editor component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Editor)).to.have.length(1);
  });

  it('renders Footer component', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Footer)).to.have.length(1);
  });

  it('calls doLoad() when mounted', () => {
    sinon.spy(App.prototype, 'doLoad');
    mount(<App />);

    expect(App.prototype.doLoad.calledOnce).to.be.true;
    App.prototype.doLoad.restore();
  });
});
