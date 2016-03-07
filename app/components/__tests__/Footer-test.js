import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Footer from '../Footer';


describe('<Footer />', () => {

    it('renders a footer element', () => {
        const wrapper = shallow(<Footer />);
        expect(wrapper.find('footer')).to.have.length(1);
    });
});
