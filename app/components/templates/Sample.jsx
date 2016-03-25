import React, { PropTypes, Component } from 'react';

const { array, object } = PropTypes;

/**
 * Basic template sample
 */
export default class Sample extends Component {

  render() {

    const
      titleStyle = {
        marginBottom: '2rem',
        borderBottom: '3px solid #ccc',
        textAlign: 'center'
      },
      contentStyle = {
        color: '#333'
      },
      footerStyle = {
        marginTop: '1rem',
        borderTop: '1px solid #ccc',
        fontWeight: 'bold',
        textAlign: 'right'
      };

    return (
      <article>
        <header>
          <h1 style={titleStyle}>{this.props.context.title}</h1>
        </header>
        <section style={contentStyle}>
          {this.props.content}
        </section>
        <footer style={footerStyle}>
          <div>
            {this.props.context.author}
          </div>
        </footer>
      </article>
    )
  }
}

Sample.propTypes = {
  context: object.isRequired,
  content: array.isRequired
}
