/* eslint one-var: 0 */
import React from 'react';
import BaseTemplate from './Base';

/**
 * Letter template
 */
export default class Letter extends BaseTemplate {

  getDefaultData() {
    return {
      date: '[date]',
      location: '[location]',
      addressFrom: {
        name: '[addressFrom/name]',
        street: '[addressFrom/street]',
        zipCode: '[addressFrom/zipcode]',
        city: '[addressFrom/city]',
      },
      addressTo: {
        name: '[addressTo/name]',
        street: '[addressTo/street]',
        zipCode: '[addressTo/zipcode]',
        city: '[addressTo/city]',
      },
      signature: '[signature]',
    };
  }

  render() {
    const data = this.getData();
    const
      letterStyle = {
        fontSize: '12pt',
        fontFamily: 'Palatino, "Times New Roman", Times, serif',
      },
      addressFromStyle = {
        marginTop: '0',
      },
      addressToStyle = {
        marginTop: '1cm',
        paddingLeft: '60%',
      },
      locationDateStyle = {
        marginTop: '1cm',
        paddingLeft: '60%',
      },
      contentStyle = {
        marginTop: '1cm',
        color: '#333',
      },
      signatureStyle = {
        marginTop: '1cm',
        fontStyle: 'italic',
        textAlign: 'right',
      };

    return (
      <article style={letterStyle}>
        <header>
          <address style={addressFromStyle}>
            <strong>{data.addressFrom.name}</strong><br />
            {data.addressFrom.street}<br />
            {data.addressFrom.zipCode}&nbsp;
            {data.addressFrom.city}<br />
            {data.addressFrom.country}
          </address>
          <address style={addressToStyle}>
            <strong>{data.addressTo.name}</strong><br />
            {data.addressTo.street}<br />
            {data.addressTo.zipCode}&nbsp;
            {data.addressTo.city}<br />
            {data.addressTo.country}
          </address>
          <div style={locationDateStyle}>
            {data.date}, {data.location}
          </div>
        </header>
        <section style={contentStyle}>
          {this.props.content}
        </section>
        <footer style={signatureStyle}>
          <div>
            {data.signature}
          </div>
        </footer>
      </article>
    );
  }
}
