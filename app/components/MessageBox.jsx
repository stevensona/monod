import React, { Component } from 'react';


export default class MessageBox extends Component {

  render() {
    if (this.props.message) {
      return (
        <div className="message-box">
          <p>{this.props.message}</p>
        </div>
      );
    }

    return null;
  }
}
