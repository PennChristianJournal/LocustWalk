'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notificationConnect} from '~/admin/frontend/components/notification-context';

class EditForm extends Component {
  constructor(props) {
    super(props);
    this.errorNotifications = [];
  }

  handleSubmit(event) {
    event.preventDefault();

    const name = this.props.getName(this.props.stage.values);

    const closeSavingNotification = this.props.pushNotification('warning', `Saving "${name}"...`);

    (this.props.preSubmit ? this.props.preSubmit() : Promise.resolve())
    .then(this.props.submit)
    .then(() => {
      setTimeout(this.props.pushNotification('success', `Successfully saved "${name}"`), 5000);
    })
    .then(this.props.onSubmit)
    .catch(error => {
      this.errorNotifications.push(this.props.pushNotification('danger', error.toString()));
    })
    .then(closeSavingNotification);
  }

  handleCancel(event) {
    event.preventDefault();

    const name = this.props.getName(this.props.stage.values);

    if (!this.props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${name}"? Unsaved changes will be lost!`)) {
      this.props.cancel(this.props.onCancel);
    }
  }

  handleDelete(event) {
    event.preventDefault();

    const name = this.props.getName(this.props.stage.values);

    if (confirm(`Are you sure you want to delete "${name}?"`)) {
      this.props.delete().then(this.props.onDelete);
    }
  }

  componentWillUnmount() {
    this.errorNotifications.forEach(closeNotification => closeNotification());
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="form">
        {this.props.children}
        <div className="btn-toolbar">
          <button className="btn btn-primary" type="submit">Save</button>
          <a className="btn btn-default" onClick={this.handleCancel.bind(this)}>Cancel</a>
          <a className="btn btn-danger pull-right" onClick={this.handleDelete.bind(this)}>Delete</a>
        </div>
      </form>
    );
  }
}

EditForm.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  getName: PropTypes.func.isRequired,
};

export default notificationConnect('notifications')(EditForm);
