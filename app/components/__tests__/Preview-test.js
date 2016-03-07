import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Preview from '../Preview';


describe('<Preview />', () => {

    it('renders a block with preview css class', () => {
        const wrapper = shallow(<Preview />);
        expect(wrapper.find('.preview')).to.have.length(1);
    });
});
