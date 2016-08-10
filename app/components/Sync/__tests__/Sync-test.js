import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it } = global;

import Sync from '../presenter';


describe('<Sync />', () => {
  it('renders an element', () => {
    const wrapper = shallow(
      <Sync
        offline={false}
        onRequestSync={() => {}}
      />
    );
    expect(wrapper.find('.sync')).to.have.length(1);
  });

  it('has an online status', () => {
    const wrapper = shallow(
      <Sync
        offline={false}
        onRequestSync={() => {}}
      />
    );
    expect(wrapper.html()).to.contain('Connected to the Internets');
  });

  it('has an offline status', () => {
    const wrapper = shallow(
      <Sync
        offline
        onRequestSync={() => {}}
      />
    );

    wrapper.setState({ offline: true });

    expect(wrapper.html()).to.contain('No Internet connection');
  });
});
