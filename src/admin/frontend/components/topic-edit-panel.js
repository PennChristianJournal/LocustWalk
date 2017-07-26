'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';
import {graphql, gql, compose} from 'react-apollo';

class TopicEditPanel extends Component {
  
  constructor(props) {
    super(props);
    this.contentEditor = undefined;
  }
  
  componentDidMount() {
    const MediumEditor = require('medium-editor');
    
    var contentDiv = $(this.refs.content);
    
    this.contentEditor = new MediumEditor(contentDiv, {
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
  }
  
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.topic || {});
  }

  handleImageChange(prop, event) {
    var file = event.target.files[0];
    var blob = '';
    if (file) {
      blob = URL.createObjectURL(file);
    }
    this.props.stage.update(prop, blob);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.submit().then(this.props.onSubmit);
  }

  handleCancel(event) {
    if (!this.props.stage.hasChangedFields() || confirm(`Are you sure you want to cancel editing "${this.props.stage.values.title}"? Unsaved changes will be lost!`)) {
      this.props.cancel(this.props.onCancel);
    }
  }

  handleDelete(event) {
    if (confirm(`Are you sure you want to delete "${this.props.stage.values.title}?"`)) {
      this.props.delete().then(this.props.onDelete);
    }
  }

  render() {
    const topic = this.props.stage.values;

    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="form" key={topic._id}>
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
                src={topic.cover ? getFileURL(topic.cover, topic.cover_preview_img) : ''}
              />
              <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'cover_preview_img')} />
          </div>

          <div className="form-group">
              <label>Thumbnail</label>
              <img
                style={{maxWidth: '200px', display: 'block'}}
                src={topic.thumb ? getFileURL(topic.thumb, topic.thumb_preview_img) : ''} />
              <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'thumb_preview_img')} />
          </div>

          <div className="form-group">
              <label>Slug</label>
              <input type="text" className="form-control" placeholder="Slug"
                value={topic.slug}
                onChange={ e => { this.props.stage.update('slug', e.target.value); } } />
          </div>
          
          <div ref="content" />
          
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