import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Letter from '../Letter';


describe('<Letter />', () => {

  it('renders a letter template without contextual data', () => {
    const wrapper = shallow(
      <Letter
        content={['this is content']}
        data={{}}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('<strong>[addressFrom/name]</strong>');
    expect(html).to.contain('<strong>[addressTo/name]</strong>');
    expect(html).to.contain('[date], [location]');
    expect(html).to.contain('this is content');
    expect(html).to.contain('<div>[signature]</div>');
  });

  it('renders a letter template with contextual data', () => {
    const wrapper = shallow(
      <Letter
        content={['this is content']}
        data={{
          addressFrom: { name: 'John Doe' },
          addressTo: { name: 'Jane Doe' },
          date: '2016/04/01',
          location: 'Clermont-Ferrand',
          signature: 'Max Planck'
        }}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('<strong>John Doe</strong>');
    expect(html).to.contain('<strong>Jane Doe</strong>');
    expect(html).to.contain('2016/04/01, Clermont-Ferrand');
    expect(html).to.contain('this is content');
    expect(html).to.contain('<div>Max Planck</div>');
  });
});
