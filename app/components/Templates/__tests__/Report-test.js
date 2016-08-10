import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Report from '../Report';


describe('<Report />', () => {

  it('renders a report template without contextual data', () => {
    const wrapper = shallow(
      <Report
        content={['this is content']}
        data={{}}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('<td>[project]</td>');
    expect(html).to.contain('<td>[reporter]</td>');
    expect(html).to.contain('<td>[date]</td>');
    expect(html).to.contain('<td>[location]</td>');
    expect(html).to.contain('<td>[reference]</td>');
    expect(html).to.contain('<td>[version]</td>');
    expect(html).to.contain('this is content');
  });

  it('renders a report template with contextual data', () => {
    const wrapper = shallow(
      <Report
        content={['this is content']}
        data={{
          project: 'Regulation of transcription',
          reporter: 'François Jacob',
          date: '1965',
          location: 'Paris',
          reference: 'NOBELPRIZE',
          version: '0.1'
        }}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('<td>Regulation of transcription</td>');
    expect(html).to.contain('<td>François Jacob</td>');
    expect(html).to.contain('<td>1965</td>');
    expect(html).to.contain('<td>Paris</td>');
    expect(html).to.contain('<td>NOBELPRIZE</td>');
    expect(html).to.contain('<td>0.1</td>');
    expect(html).to.contain('this is content');
  });
});
