'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {notificationConnect} from '~/admin/frontend/components/notification-context';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';
import EditForm from './edit-form';
import ContentEditor from './content-editor';

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

  render() {
    const topic = this.props.stage.values;

    return (
      <EditForm {...this.props} key={topic._id} getName={values => values.title} >
          <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" placeholder="Topic Title"
                value={topic.title}
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
                value={topic.slug}
                onChange={ e => { this.props.stage.update('slug', e.target.value); } } />
          </div>

          <ContentEditor placeholder='Topic content...' content={topic.content} onChange={content => { this.props.stage.update('content', content); } } />
      </EditForm>
    );
  }
}

TopicEditPanel.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

export default TopicEditPanel;
