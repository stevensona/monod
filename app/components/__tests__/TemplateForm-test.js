import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import TemplateForm from '../TemplateForm';


describe('<TemplateForm />', () => {

  it('renders a select element', () => {
    const wrapper = shallow(
      <TemplateForm
        template={''}
        doUpdateTemplate={() => {}}
      />);

    expect(wrapper.find('select')).to.have.length(1);
  });
});
