import React, {Component, Fragment} from 'react';
import { Helmet } from 'react-helmet';
import Switch from 'react-router/Switch';
import Route from 'react-router/Route';
import {Link, withRouter} from 'react-router-dom';
import pluralize from 'pluralize';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import classnames from 'classnames';
import {defaultValue} from '../../common/helpers';
import {getFileURL} from '../../common/helpers/file';
import Modal from '../components/modal';
import ModelPage from '../components/model-page';
import BooleanField from '../components/form/boolean-field';
import TextField from '../components/form/text-field';
import ImageField from '../components/form/image-field';
import MediumField from '../components/form/medium-field';
import EditPanel from '../components/edit-panel';
import AdminCard from '../components/admin-card';
import {TOPICS_LOAD_QUERY, TOPIC_QUERY} from '../gql/queries';
import {TOPIC_NEW, TOPIC_UPDATE, TOPIC_DELETE} from '../gql/mutations';
import {ArticleDisplay} from './articles';

export const TopicDisplay = withRouter(({location, document, className}) => (
  <AdminCard
      className={className}
      title={document.title}
      img={document.thumb && `/files/${document.thumb}`}
      disabled={!document.is_published}
      subcards={(document.articles || []).map(article => (
        <ArticleDisplay document={article} key={article._id} className="admin-subcard"/>
      ))}
  >
    <p className="card-text">{document.preview}</p>
    <p className="card-text"><a className="card-link" href={document.url}>{document.url}</a></p>
    <p className="card-text">
      <Link to={`/admin/topics/${document._id}/edit${location.search}`} className="btn btn-outline-primary">Edit</Link>
    </p>
  </AdminCard>
));

export const TopicEdit = compose(
  graphql(TOPIC_QUERY, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    options({id}) {
      return {
        variables: {
          _id: id,
        }
      };
    },
    props({data: { loading, topic }}) {
      return {
        topic
      };
    }
  }),
  graphql(TOPIC_NEW, {
    withRef: true,
    skip({isNew}) {
      return !isNew;
    },
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
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'updateTopic',
    props({ownProps, updateTopic}) {
      return {
        updateTopic: (topic) => updateTopic({
          variables: {
            _id: ownProps.id,
            topic,
          },
        }),
      };
    },
  }),
  graphql(TOPIC_DELETE, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'deleteTopic',
    props({ownProps, deleteTopic}) {
      return {
        deleteTopic: () => deleteTopic({
          variables: {
            _id: ownProps.id,
          },
        }),
      };
    },
  }),
)(class TopicPanel extends EditPanel {
  constructor(props) {
    super(props);
    this.editableFields = [
      'title',
      'is_published',
      'content',
      'slug',
      'cover_buffer',
      'thumb_buffer',
    ];
  }

  submit() {
    if (this.props.isNew) {
      return this.props.newTopic(this.getChanges());
    } else {
      return this.props.updateTopic(this.getChanges());
    }
  }

  delete() {
    return this.props.deleteTopic();
  }

  render() {
    const topic = (!this.props.isNew && this.props.topic) || {
      is_published: false,
      title: '',
      content: '',
      slug: '',
      thumb: '',
      cover: '',
    };

    if (!topic) {
      return null;
    }

    return (
      <Fragment key={topic._id}>
        <BooleanField
          label="Published"
          name="is_published"
          checked={defaultValue(this.state.is_published, topic.is_published)}
          onChange={this._handleChange}
        />

        <TextField
          label="Title"
          name="title"
          value={defaultValue(this.state.title, topic.title)}
          onChange={this._handleChange}
        />

        <MediumField
          label="Edit Content"
          name="content"
          content={defaultValue(this.state.content, topic.content)}
          onChange={(content) => this.setState({ content, })}
        />

        <ImageField
          label="Cover Photo"
          name="cover"
          src={topic.cover}
          preview={this.state.cover_preview_img}
          onChange={this._handleImageChange}
        />

        <ImageField
          label="Thumbnail"
          name="thumb"
          src={topic.thumb}
          preview={this.state.thumb_preview_img}
          onChange={this._handleImageChange}
        />

        <TextField
          label="Slug"
          name="slug"
          value={defaultValue(this.state.slug, topic.slug)}
          onChange={this._handleChange}
        />
      </Fragment>
    );
  }
});

export default () => (
  <ModelPage
    loadQuery={TOPICS_LOAD_QUERY}
    modelName="Topic"
    displayComponent={TopicDisplay}
    editorComponent={TopicEdit}
  />
);
