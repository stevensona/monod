import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Invoice from '../../templates/Invoice';


describe('<Invoice />', () => {

  it('renders an invoice template without contextual data', () => {
    const wrapper = shallow(
      <Invoice
        content={['this is content']}
        data={{}}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('FACTURE N°[reference]')
    expect(html).to.contain('<strong>[companyAddress/name]</strong>');
    expect(html).to.contain('<strong>[customerAddress/name]</strong>');
    expect(html).to.contain('Facture n°[reference] du [date]');
    expect(html).to.contain('this is content');
    expect(html).to.contain('Montant : <strong>[amount]</strong>');
  });

  it('renders an invoice template with contextual data', () => {
    const wrapper = shallow(
      <Invoice
        content={['this is content']}
        data={{
          reference: 'DUMMY',
          companyAddress: { name: 'John Doe' },
          customerAddress: { name: 'Jane Doe' },
          date: '01/04/2016',
          amount: '42 euros'
        }}
      />
    );
    const html = wrapper.html();

    expect(html).to.contain('FACTURE N°DUMMY')
    expect(html).to.contain('<strong>John Doe</strong>');
    expect(html).to.contain('<strong>Jane Doe</strong>');
    expect(html).to.contain('Facture n°DUMMY du 01/04/2016');
    expect(html).to.contain('this is content');
    expect(html).to.contain('Montant : <strong>42 euros</strong>');
  });
});
