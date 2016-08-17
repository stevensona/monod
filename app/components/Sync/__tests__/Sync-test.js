import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Sync from '../presenter';
import config from '../../../config';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


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
    expect(wrapper.html()).to.contain(config.SYNC_ONLINE_MESSAGE);
  });

  it('has an offline status', () => {
    const wrapper = shallow(
      <Sync
        offline
        onRequestSync={() => {}}
      />
    );

    wrapper.setState({ offline: true });

    expect(wrapper.html()).to.contain(config.SYNC_OFFLINE_MESSAGE);
  });

  it('calls onRequestSync prop and increase duration by 1.5 when app is offline', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Sync
        offline
        onRequestSync={spy}
      />
    );

    // force state + call to hit counter == 0
    wrapper.setState({ duration: 10, counter: 1 });
    wrapper.instance().counter();

    expect(spy.called).to.be.true;
    expect(wrapper.state('duration')).to.equal(15);
  });

  it('calls onRequestSync prop and reset counter when app is online', () => {
    const spy = sinon.spy();
    const wrapper = mount(
      <Sync
        offline={false}
        onRequestSync={spy}
      />
    );

    // force state + call to hit counter == 0
    wrapper.setState({ duration: 10, counter: 1 });
    wrapper.instance().counter();

    expect(spy.called).to.be.true;
    expect(wrapper.state('duration')).to.equal(config.SYNC_COUNTER_DURATION);
  });
});
