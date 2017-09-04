'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getFileURL} from '~/common/frontend/helpers/file';
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
    this.props.stage.update(`${prop}_preview_img`, blob).then(() => {
      this.props.stage.update(`${prop}_file`, file);
    });
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
              <div className="checkbox">
                  <label className="checkbox-inline">
                      <input type="checkbox"
                        checked={topic.is_published || false}
                        onChange={e => this.props.stage.update('is_published', e.target.checked) }
                      />
                      Published
                  </label>
              </div>
          </div>

          <div className="form-group">
              <div className="checkbox">
                  <label className="checkbox-inline">
                      <input type="checkbox"
                        checked={topic.is_announcement || false}
                        onChange={e => this.props.stage.update('is_announcement', e.target.checked) }
                      />
                      Announcement
                  </label>
              </div>
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

          <ContentEditor placeholder="Topic content..." content={topic.content} onChange={content => { this.props.stage.update('content', content); } } />
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
