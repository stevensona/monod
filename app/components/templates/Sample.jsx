import React, { PropTypes, Component } from 'react';

const { array, object } = PropTypes;

/**
 * Basic template sample
 */
export default class Sample extends Component {
  render() {

    return (
      <article className="sample">
        <header className="sample-header">
          <h1 className="sample-title">{this.props.context.title}</h1>
        </header>
        <section className="sample-content">
          {this.props.content}
        </section>
        <footer className="sample-footer">
          <div className="sample-author">
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
