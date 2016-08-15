import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Toolbar from '../presenter';


describe('<Toolbar />', () => {

  it('renders the application\'s toolbar', () => {
    const wrapper = shallow(
      <Toolbar
        template={''}
        onTogglePresentationMode={() => {}}
        onUpdateTemplate={() => {}}
        onToggleShareModal={() => {}}
        enableShareModalButton
      />);

    expect(wrapper.find('#toolbar')).to.have.length(1);
  });
});
