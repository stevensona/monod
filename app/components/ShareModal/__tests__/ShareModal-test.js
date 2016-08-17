import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ShareModal from '../index';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('<ShareModal />', () => {

  it('renders itself', () => {
    const wrapper = shallow(
      <ShareModal
        isOpen
        onRequestClose={() => {}}
        fullAccessURL={"https://example.org"}
      />
    );

    expect(wrapper.find('.share-modal-content')).to.have.length(1);
  });

  it('should call onRequestClose prop when clicking on the close button', () => {
    const spy = sinon.spy();
    const wrapper = shallow(
      <ShareModal
        isOpen
        onRequestClose={spy}
        fullAccessURL={"https://example.org"}
      />
    );

    wrapper.find('.close-button').simulate('click');

    expect(spy.called).to.be.true;
  });
});
