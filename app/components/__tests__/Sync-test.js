import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it } = global;

import Sync from '../Sync';


describe('<Sync />', () => {

  let context;

  before(() => {
    context = {
      controller: {
        on: () => {},
        dispatch: () => {}
      }
    };
  });

  it('renders an element', () => {
    const wrapper = shallow(<Sync />, { context });
    expect(wrapper.find('.sync')).to.have.length(1);
  });

  it('has an online status', () => {
    const wrapper = shallow(<Sync />, { context });

    expect(wrapper.html()).to.contain('Connected to the Internets');
  });

  it('has an offline status', () => {
    const wrapper = shallow(<Sync />, { context });

    wrapper.setState({ offline: true });

    expect(wrapper.html()).to.contain('No Internet connection');
  });
});
