import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Editor from '../Editor';
import Markdown from '../Markdown';
import Preview from '../Preview';


describe('<Editor />', () => {

  it('renders Markdown component', () => {
    const wrapper = shallow(<Editor loadRaw={() => {}} onSave={() => {}} />);
    expect(wrapper.find(Markdown)).to.have.length(1);
  });

  it('renders Preview component', () => {
    const wrapper = shallow(<Editor loadRaw={() => {}} onSave={() => {}} />);
    expect(wrapper.find(Preview)).to.have.length(1);
  });

  it('updates its state when text is entered in Markdown component', () => {
    const wrapper = shallow(<Editor loadRaw={() => {}} onSave={() => {}} />);
    const content = 'Hello, World';

    wrapper.find('Markdown').simulate('change', content);

    expect(wrapper.state('raw')).to.equal(content);
  });
});
