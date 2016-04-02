import React, { Component, PropTypes } from 'react';
import { Events } from '../Store';
import moment from 'moment';

const DEFAULT_DURATION = 5;

export default class Sync extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      date: null,
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
          this.setState({
            counter: this.state.duration
          });
          this.context.controller.dispatch('action:sync');
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.context.controller.on(Events.SYNCHRONIZE, (state) => {
      this.setState({
        date: state.date,
        duration: DEFAULT_DURATION
      });
    });

    this.context.controller.on(Events.APP_IS_ONLINE, () => {
      this.setState({
        duration: DEFAULT_DURATION,
        offline: false
      });
    });

    this.context.controller.on(Events.APP_IS_OFFLINE, () => {
      this.setState({
        duration: Math.round(this.state.duration * 2),
        offline: true
      });
    });
  }

  render() {
    let title = 'No Internet connection or server is unreachable';

    if (false === this.state.offline) {
      title = [
        'Connected to the Internets™ ',
        '(Last synchronization to the server: ',
        moment(this.state.date).fromNow(),
        ')'
      ].join('')
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
