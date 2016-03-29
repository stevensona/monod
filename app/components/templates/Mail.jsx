import React, { PropTypes, Component } from 'react';

const { array, object } = PropTypes;

/**
 * Basic template sample
 */
export default class Mail extends Component {

  render() {

    const context = this.props.context;
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
            <strong>{context.addressFrom.name}</strong><br/>
            {context.addressFrom.street}<br/>
            {context.addressFrom.zipCode}&nbsp;
            {context.addressFrom.city}<br/>
            {context.addressFrom.country}
          </address>
          <address style={addressToStyle}>
            <strong>{context.addressTo.name}</strong><br/>
            {context.addressTo.street}<br/>
            {context.addressTo.zipCode}&nbsp;
            {context.addressTo.city}<br/>
            {context.addressTo.country}
          </address>
          <div style={locationDateStyle}>
            {context.date}, {context.location}
          </div>
        </header>
        <section style={contentStyle}>
          {this.props.content}
        </section>
        <footer style={signatureStyle}>
          <div>
            {context.signature}
          </div>
        </footer>
      </article>
    )
  }
}

Mail.propTypes = {
  context: object.isRequired,
  content: array.isRequired
}
