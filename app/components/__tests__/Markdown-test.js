import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Markdown from '../Markdown';


describe('<Markdown />', () => {

    it('renders a block with markdown css class', () => {
        const wrapper = shallow(<Markdown />);
        expect(wrapper.find('.markdown')).to.have.length(1);
    });
});
