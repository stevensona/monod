import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import App from '../App'

describe('<App />', () => {

    it('renders a header element', () => {
        const wrapper = shallow(<App />);
        expect(wrapper.find('header')).to.have.length(1);
    });
});
