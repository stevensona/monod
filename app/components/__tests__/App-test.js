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

  it('calls loadRaw() when mounted', () => {
    sinon.spy(App.prototype, 'loadRaw');
    mount(<App version={version} />);

    expect(App.prototype.loadRaw.calledOnce).to.be.true;
    App.prototype.loadRaw.restore();
  });
});
