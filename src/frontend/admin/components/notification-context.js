'use strict';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

var contextMap = {};

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      in: false,
    };
  }

  componentDidMount() {
    process.nextTick(() => {
      this.setState({
        in: true,
      });
    });
  }

  render() {
    return (
      <div className={`alert alert-${this.props.status} alert-dismissible fade show ${this.state.in ? 'in' : ''}`}>
        <button type="button" className="close" onClick={this.props.onClose}>
          <span aria-hidden="true">&times;</span>
        </button>
        {this.props.message}
      </div>
    );
  }
}

export default class NotificationContext extends Component {
  constructor(props) {
    super(props);
    contextMap[props.name] = this;
    this.state = {
      notifications: [],
    };
  }

  pushNotification(status, message) {
    const notification = { status, message };
    this.setState({
      notifications: this.state.notifications.concat(notification),
    });
    return this.popNotification.bind(this, notification);
  }

  popNotification(notification) {
    this.setState({
      notifications: this.state.notifications.filter(item => {
        return item !== notification;
      }),
    });
  }

  render() {
    const {children, ...props} = this.props;
    return (
      <div className="notification-container" {...props}>
        <div className="notifications col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1">
          {this.state.notifications.map((notification, index, arr) => {
            return <Notification key={index + notification.message} {...notification} onClose={() => { this.popNotification(notification); }} />;
          })}
        </div>
        {children}
      </div>
    );
  }
}

NotificationContext.propTypes = {
  name: PropTypes.string.isRequired,
};

export function notificationConnect(contextName) {

  return function(WrappedComponent) {
    return class extends Component {
      componentDidMount() {
        this.notificationContext = contextMap[contextName];
      }

      render() {
        const pushNotification = this.notificationContext ? this.notificationContext.pushNotification.bind(this.notificationContext) : () => {};
        return <WrappedComponent pushNotification={pushNotification} {...this.props} />;
      }
    };
  };
}
