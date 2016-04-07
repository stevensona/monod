import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';

const DEFAULT_DURATION = 5;

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
      const duration = Math.round(this.state.duration * 2);

      this.setState({
        counter: duration,
        duration: duration,
        offline: true
      });
    });
  }

  render() {
    let title = 'No Internet connection or server is unreachable';

    if (false === this.state.offline) {
      title = 'Connected to the Internets™';
    }

    return (
      <div className="sync">
        <span className={this.state.offline ? 'status is-offline' : 'status is-online'}>
          <i
            title={title}
            className={this.state.offline ? 'fa fa-toggle-off' : 'fa fa-toggle-on'}
          ></i>
          {this.state.offline ? <span>&nbsp;Retrying in {this.state.counter} seconds</span> : ''}
        </span>
      </div>
    );
  }
}

Sync.contextTypes = {
  controller: PropTypes.object.isRequired
};
