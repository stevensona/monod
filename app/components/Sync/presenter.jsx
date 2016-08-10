import React, { Component, PropTypes } from 'react';


const DEFAULT_DURATION = 5;
const MAX_DURATION = 600;

class Sync extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      duration: DEFAULT_DURATION,
      counter: DEFAULT_DURATION,
    };

    this.intervalId = false;
    this.counter = this.counter.bind(this);
  }


  componentWillMount() {
    this.intervalId = setInterval(this.counter, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    this.intervalId = false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.offline !== nextProps.offline) {
      this.setState({
        duration: DEFAULT_DURATION,
        counter: DEFAULT_DURATION,
      });
    }
  }

  counter() {
    if (!this.props.offline) {
      return;
    }

    let counter = this.state.counter;

    if (0 < counter) {
      counter--;
      this.setState({ counter });

      if (0 === counter) {
        this.props.onRequestSync();

        let duration = Math.round(this.state.duration * 1.5);

        if (duration >= MAX_DURATION) {
          duration = DEFAULT_DURATION + 1;
        }

        this.setState({
          counter: duration,
          duration,
        });
      }
    }
  }

  render() {
    let title = 'Connected to the Internets™';
    let message = '';

    if (this.props.offline) {
      title = 'No Internet connection or server is unreachable';
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
