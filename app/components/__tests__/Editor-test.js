import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Editor from '../Editor';
import Markdown from '../Markdown';
import Preview from '../Preview';


describe('<Editor />', () => {

    it('renders Markdown component', () => {
        const wrapper = shallow(<Editor />);
        expect(wrapper.find(Markdown)).to.have.length(1);
    });

    it('renders Preview component', () => {
        const wrapper = shallow(<Editor />);
        expect(wrapper.find(Preview)).to.have.length(1);
    });
});
