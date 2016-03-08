import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Footer from '../Footer';


describe('<Footer />', () => {

  it('renders a footer element', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper.find('footer')).to.have.length(1);
  });
});
