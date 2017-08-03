'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notificationConnect} from '~/admin/frontend/components/notification-context';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';

class ContentEditor extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.contentEditor = this.contentEditor && this.contentEditor.destroy();

    const MediumEditor = require('medium-editor');

    this.contentEditor = new MediumEditor($(this.refs.container), {
      placeholder: {
        text: 'Topic content...',
        hideOnClick: false,
      },
      toolbar: {
        buttons: [
          'bold',
          'italic',
          'underline',
          'anchor',
          'h2',
          'h3',
          'quote',
          'superscript',
          'justifyLeft',
          'justifyCenter',
          'justifyRight',
          'justifyFull',
        ],
      },
    });

    this.contentEditor.subscribe('blur', (event, editable) => {
      this.props.onChange(this.contentEditor.serialize()['element-0'].value);
    });
  }

  componentWillUnmount() {
    this.contentEditor = this.contentEditor && this.contentEditor.destroy();
  }

  render() {
    return <div ref="container" dangerouslySetInnerHTML={{__html: this.props.content}}></div>;
  }
}

class TopicEditPanel extends Component {

  constructor(props) {
    super(props);
  }

  handleImageChange(prop, event) {
    var file = event.target.files[0];
    var blob = '';
    if (file) {
      blob = URL.createObjectURL(file);
    }
    this.props.stage.update(`${prop}_preview_img`, blob);
    var reader = new FileReader();
    reader.onload = () => {
      this.props.stage.update(`${prop}_buffer`, reader.result);
    };
    reader.readAsDataURL(file);
  }

  handleSubmit(event) {
    event.preventDefault();
    const title = this.props.stage.values.title;
    const closeNotification = this.props.pushNotification('warning', `Saving "${title}"...`);

    this.props.submit().then(() => {
      setTimeout(this.props.pushNotification('success', `Successfully saved "${title}"`), 5000);
    }).then(this.props.onSubmit).catch(error => {
      this.props.pushNotification('danger', error.toString());
    }).then(closeNotification);
  }

  handleCancel(event) {
    if (!this.props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${this.props.stage.values.title}"? Unsaved changes will be lost!`)) {
      this.props.cancel(this.props.onCancel);
    }
  }

  handleDelete(event) {
    const title = this.props.stage.values.title;
    if (confirm(`Are you sure you want to delete "${title}?"`)) {
      const closeNotification = this.props.pushNotification('warning', `Deleting "${title}"...`);

      this.props.delete().then(() => {
        setTimeout(this.props.pushNotification('success', `Successfully deleted "${title}"`), 5000);
      }).then(this.props.onDelete).catch(error => {
        this.props.pushNotification('danger', error.toString());
      }).then(closeNotification);
    }
  }

  render() {
    const topic = this.props.stage.values;

    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="form" key={topic._id}>
          <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" placeholder="Topic Title"
                value={topic.title || undefined}
                onChange={ e => { this.props.stage.update('title', e.target.value); } } />
          </div>

          <div className="form-group">
              <label>Cover Photo</label>
              <img
                style={{maxWidth: '200px', display: 'block'}}
                src={(topic.cover || topic.cover_preview_img) ? getFileURL(topic.cover, topic.cover_preview_img) : ''}
              />
              <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'cover')} />
          </div>

          <div className="form-group">
              <label>Thumbnail</label>
              <img
                style={{maxWidth: '200px', display: 'block'}}
                src={(topic.thumb || topic.thumb_preview_img) ? getFileURL(topic.thumb, topic.thumb_preview_img) : ''} />
              <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'thumb')} />
          </div>

          <div className="form-group">
              <label>Slug</label>
              <input type="text" className="form-control" placeholder="Slug"
                value={topic.slug || undefined}
                onChange={ e => { this.props.stage.update('slug', e.target.value); } } />
          </div>

          <ContentEditor content={topic.content} onChange={content => { this.props.stage.update('content', content); } } />

          <div className="btn-toolbar">
            <button className="btn btn-primary" type="submit">Save</button>
            <a className="btn btn-default" onClick={this.handleCancel.bind(this)}>Cancel</a>
            <a className="btn btn-danger pull-right" onClick={this.handleDelete.bind(this)}>Delete</a>
          </div>
      </form>
    );
  }
}

TopicEditPanel.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

export default notificationConnect('notifications')(TopicEditPanel);
