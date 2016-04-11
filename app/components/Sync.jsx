import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';

const DEFAULT_DURATION = 5;
const MAX_VISIBLE_COUNTER = 60;
const MAX_DURATION = 600;

export default class Sync extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      duration: DEFAULT_DURATION,
      counter: DEFAULT_DURATION,
      offline: false
    };
  }

  componentWillMount() {
    this.interval = setInterval(() => {
      let counter = this.state.counter;

      if (0 < counter) {
        counter--;
        this.setState({ counter: counter });

        if (0 === counter) {
          this.context.controller.dispatch('action:sync');
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.context.controller.on(Events.APP_IS_ONLINE, () => {
      this.setState({
        counter: DEFAULT_DURATION,
        duration: DEFAULT_DURATION,
        offline: false
      });
    });

    this.context.controller.on(Events.APP_IS_OFFLINE, () => {
      let duration = Math.round(this.state.duration * 2);

      if (duration >= MAX_DURATION) {
        duration = DEFAULT_DURATION;
      }

      this.setState({
        counter: duration,
        duration: duration,
        offline: true
      });
    });
  }

  render() {
    let title = 'No Internet connection or server is unreachable';
    let offlineStatus = '';

    if (false === this.state.offline) {
      title = 'Connected to the Internets™';
    } else {
      offlineStatus = (<span>&nbsp;Retrying in {this.state.counter} seconds</span>);

      if (this.state.counter > MAX_VISIBLE_COUNTER) {
        offlineStatus = (<span>&nbsp;Offline</span>);
      }
    }

    return (
      <div className="sync">
        <span className={this.state.offline ? 'status is-offline' : 'status is-online'}>
          <i
            title={title}
            className={this.state.offline ? 'fa fa-toggle-off' : 'fa fa-toggle-on'}
          ></i>
          {offlineStatus}
        </span>
      </div>
    );
  }
}

Sync.contextTypes = {
  controller: PropTypes.object.isRequired
};
