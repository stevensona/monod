import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import CopiableUrlInput from '../CopiableUrlInput';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('<CopiableUrlInput />', () => {

  it('renders itself', () => {
    const wrapper = shallow(
      <CopiableUrlInput
        name={'some-url'}
        value={'https://example.org'}
      />
    );

    expect(wrapper.find('.copiable-url-input')).to.have.length(1);
  });
});
