import React from 'react';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

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

  it('updates its state when text is entered in Markdown component', () => {
    const wrapper = shallow(<Editor />);
    const content = 'Hello, World';
    const event = { target: { value: content } };

    wrapper.find('Markdown').simulate('change', event);

    expect(wrapper.state('raw')).to.equal(content);
  });
});
