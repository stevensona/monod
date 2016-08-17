import React, { Component, PropTypes } from 'react';

import config from '../../config';


class Sync extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      duration: config.SYNC_COUNTER_DURATION,
      counter: config.SYNC_COUNTER_DURATION,
    };

    this.intervalId = false;
    this.counter = this.counter.bind(this);
  }


  componentWillMount() {
    this.intervalId = setInterval(this.counter, 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.offline !== nextProps.offline) {
      this.setState({
        duration: config.SYNC_COUNTER_DURATION,
        counter: config.SYNC_COUNTER_DURATION,
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.intervalId = false;
  }

  counter() {
    let counter = this.state.counter;

    if (0 < counter) {
      counter--;
      this.setState({ counter });

      if (0 === counter) {
        this.props.onRequestSync();

        let duration = config.SYNC_COUNTER_DURATION;

        if (this.props.offline) {
          duration = Math.round(this.state.duration * 1.5);

          if (duration >= config.SYNC_COUNTER_THRESHOLD) {
            duration = config.SYNC_COUNTER_DURATION;
          }
        }

        this.setState({
          counter: duration,
          duration,
        });
      }
    }
  }

  render() {
    let title = config.SYNC_ONLINE_MESSAGE;
    let message = '';

    if (this.props.offline) {
      title = config.SYNC_OFFLINE_MESSAGE;
      message = (<span>&nbsp;Offline</span>);
    }

    return (
      <div className="sync">
        <span className={this.props.offline ? 'status is-offline' : 'status is-online'}>
          <i
            title={title}
            className={this.props.offline ? 'fa fa-toggle-off' : 'fa fa-toggle-on'}
          />
          {message}
        </span>
      </div>
    );
  }
}

Sync.propTypes = {
  offline: PropTypes.bool.isRequired,
  onRequestSync: PropTypes.func.isRequired,
};

export default Sync;
