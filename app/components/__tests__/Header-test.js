import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Header from '../Header';


describe('<Header />', () => {

  it('renders a header element', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('header')).to.have.length(1);
  });
});
