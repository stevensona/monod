import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

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
});
