'use strict';

import React, {Component} from 'react';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';
import {graphql, gql, compose} from 'react-apollo';

const editableTopicFields = [
  'title',
  'content',
  'slug',
  'cover',
  'thumb',
];

const topicFields = [
  ...editableTopicFields,
  '_id',
  'preview',
];

export const TOPIC_QUERY = gql`
  query FullTopic($_id: ObjectID!) {
    topic(_id: $_id) {
      ${topicFields.join('\n')}
    }
  }
`;

const TOPIC_NEW = gql`
  mutation newTopic($topic: TopicInput!) {
    newTopic(topic: $topic) {
      ${topicFields.join('\n')}
    }
  }
`;

const TOPIC_UPDATE = gql`
  mutation updateTopic($_id: ObjectID!, $topic: TopicInput) {
    updateTopic(_id: $_id, topic: $topic) {
      ${topicFields.join('\n')}
    }
  }
`;

const TOPIC_DELETE = gql`
  mutation deleteTopic($_id: ObjectID!) {
    deleteTopic(_id: $_id) {
      ${topicFields.join('\n')}
    }
  }
`;

class TopicEditPanel extends Component {
  
  constructor(props) {
    super(props);
    this.contentEditor = undefined;
    this.state = Object.assign({}, props.topic);
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
    this.setState({
      [prop]: blob,
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    this.doSubmit().then(() => {
      if (this.props.onSubmit) {
        this.props.onSubmit(event);
      }
    });
  }
  
  doSubmit() {
    var isNew = !this.state._id;
    
    var params = Object.keys(this.state).filter(key => editableTopicFields.includes(key));
    
    if (isNew) {
      params = params.reduce((obj, key) => {
        obj[key] = this.state[key];
        return obj;
      }, {});
        
      return this.props.newTopic(params);
    } else {
      params = params.filter(key => this.state[key] != this.props.article[key])
        .reduce((obj, key) => {
          obj[key] = this.state[key];
          return obj;
        }, {});
      return this.props.updateTopic(params);
    }
  }
  
  handleCancel(event) {
    if (confirm(`Are you sure you want to cancel editing "${this.state.title}"? Unsaved changes will be lost!`)) {
      this.setState(this.props.topic, () => {
        if (this.props.onCancel) {
          this.props.onCancel(event);
        }
      });
    }
  }
  
  handleDelete(event) {
    if (confirm(`Are you sure you want to delete "${this.state.title}?"`)) {
      this.props.deleteTopic().then(() => {
        if (this.props.onDelete) {
          this.props.onDelete(event);
        }
      });
    }
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} className="form" key={this.state._id}>
          <div className="form-group">
              <label htmlFor="title-input">Title</label>
              <input id="title-type" name="title" type="text" className="form-control" placeholder="Topic Title"
                  value={this.state.title}
                  onChange={ e => { this.setState({title: e.target.value}); } } />
          </div>
          
          <div className="form-group">
              <label htmlFor="cover-photo-input">Cover Photo</label>
              <img style={{maxWidth: '200px', display: 'block'}} src={this.state.cover ? getFileURL(this.state.cover, this.state.cover_preview_img) : ''} />
              <input id="cover-photo-input" name="cover" type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'cover_preview_img')} />
          </div>
          
          <div className="form-group">
              <label htmlFor="thumbnail-input">Thumbnail</label>
              <img style={{maxWidth: '200px', display: 'block'}} src={this.state.thumb ? getFileURL(this.state.thumb, this.state.thumb_preview_img) : ''} />
              <input id="thumbnail-input" name="thumb" type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'thumb_preview_img')} />
          </div>
          
          <div className="form-group">
              <label htmlFor="slug-input">Slug</label>
              <input id="slug-input" name="slug" type="text" className="form-control" placeholder="Slug"
                  value={this.state.slug}
                  onChange={ e => { this.setState({slug: e.target.value}); } } />
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

export default compose(
  graphql(TOPIC_NEW, {
    name: 'newTopic',
    props({newTopic}) {
      return {
        newTopic: (topic) => newTopic({
          variables: {
            topic,
          },
        }),
      };
    },
  }),
  graphql(TOPIC_UPDATE, {
    skip(props) {
      return !props._id;
    },
    name: 'udpateTopic',
    props({ownProps, updateTopic}) {
      return {
        updateTopic: (topic) => updateTopic({
          variables: {
            _id: ownProps._id,
            topic,
          },
        }),
      };
    },
  }),
  graphql(TOPIC_DELETE, {
    skip(props) {
      return !props._id;
    },
    name: 'deleteTopic',
    props({ownProps, deleteTopic}) {
      return {
        deleteTopic: () => deleteTopic({
          variables: {
            _id: ownProps._id,
          },
        }),
      };
    },
  }),
  graphql(TOPIC_QUERY, {
    skip(props) {
      return !props._id;
    },
    options(props) {
      return {
        variables: {
          _id: props._id,
        },
      };
    },
    props({ data: { loading, topic }}) {
      return {
        topic,
        loading,
      };
    },
  })
)(TopicEditPanel);
