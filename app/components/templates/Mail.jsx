import React, { PropTypes, Component } from 'react';
import merge from 'deepmerge';

const { array, object } = PropTypes;

/**
 * Mail template
 */
export default class Mail extends Component {

  getDefaultData() {
    return {
      date: '<date>',
      location: '<location>',
      addressFrom: {
        name: '<from: name>',
        street: '<from: street>',
        zipCode: '<from: zipcode>',
        city: '<from: city>'
      },
      addressTo: {
        name: '<to: name>',
        street: '<to: street>',
        zipCode: '<to: zipcode>',
        city: '<to: city>'
      },
      signature: '<signature>'
    }
  }

  cleanData(data) {
    // clean input data to avoid undefined or null object properties
    // that could crash preview when trying to access null.<property>
    for (let p in data) {
      if (data.hasOwnProperty(p) && data[p] === null) {
        delete data[p];
      }
    }
    return data;
  }

  getData() {
    return merge(
      this.getDefaultData(),
      this.cleanData(this.props.data)
    );
  }

  render() {
    const data = this.getData();
    const
      letterStyle = {
        fontSize: '12pt',
        fontFamily: 'Palatino, "Times New Roman", Times, serif'
      },
      addressFromStyle = {
        marginTop: '0'
      },
      addressToStyle = {
        marginTop: '1cm',
        paddingLeft: '60%'
      },
      locationDateStyle = {
        marginTop: '1cm',
        paddingLeft: '60%'
      },
      contentStyle = {
        marginTop: '1cm',
        color: '#333'
      },
      signatureStyle = {
        marginTop: '1cm',
        fontStyle: 'italic',
        textAlign: 'right'
      };

    return (
      <article style={letterStyle}>
        <header>
          <address style={addressFromStyle}>
            <strong>{data.addressFrom.name}</strong><br/>
            {data.addressFrom.street}<br/>
            {data.addressFrom.zipCode}&nbsp;
            {data.addressFrom.city}<br/>
            {data.addressFrom.country}
          </address>
          <address style={addressToStyle}>
            <strong>{data.addressTo.name}</strong><br/>
            {data.addressTo.street}<br/>
            {data.addressTo.zipCode}&nbsp;
            {data.addressTo.city}<br/>
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
    )
  }
}

Mail.propTypes = {
  data: object.isRequired,
  content: array.isRequired
}
