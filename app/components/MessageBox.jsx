import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';


export default class MessageBox extends Component {

  onClose(e) {
    e.preventDefault();
    this.refs.messageBox.remove();
  }

  render() {
    if (this.props.message) {
      return (
        <div className="message-box callout" ref="messageBox">
          <p>{this.props.message}</p>

          <button
            className="close-button"
            aria-label="Dismiss alert"
            onClick={this.onClose.bind(this)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return <span />;
  }
}
