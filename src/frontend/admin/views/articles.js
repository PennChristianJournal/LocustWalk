import React, {Component, Fragment} from 'react';
import {withRouter, Link} from 'react-router-dom';
import pluralize from 'pluralize';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import classnames from 'classnames';
import moment from 'moment';
import fetch from 'isomorphic-fetch';
import {defaultValue} from '../../common/helpers';
import {getFileURL} from '../../common/helpers/file';
import ModelPage from '../components/model-page';
import BooleanField from '../components/form/boolean-field';
import TextField from '../components/form/text-field';
import ImageField from '../components/form/image-field';
import MediumField from '../components/form/medium-field';
import TypeaheadField from '../components/form/typeahead-field';
import DatetimeField from '../components/form/datetime-field';
import AdminCard from '../components/admin-card';
import EditPanel from '../components/edit-panel';
import {ARTICLES_LOAD_QUERY, ARTICLE_RESPONSES_QUERY, ARTICLE_QUERY} from '../gql/queries';
import {ARTICLE_NEW, ARTICLE_UPDATE, ARTICLE_DELETE, ARTICLE_SYNC} from '../gql/mutations';

export const ArticleDisplay = compose(
  graphql(ARTICLE_RESPONSES_QUERY, {
    skip: ({depth}) => depth && depth > 2,
    options({document}) {
      return {
        variables: {
          parent: document._id,
        },
      };
    },
    props({ data: { articleResponses }}) {
      articleResponses = articleResponses || [];
      return {
        articleResponses,
      }
    }
  }),
  withRouter,
)(({ location, document, articleResponses, className, depth }) => {
  return (
    <AdminCard
        className={className}
        title={document.title}
        img={document.thumb && `/files/${document.thumb}`}
        disabled={!document.is_published}
        subcards={(articleResponses || []).map(article => (
          <ArticleDisplay depth={(depth || 0) + 1} document={article} key={article._id} className="admin-subcard" />
        ))}
    >
      <h6 className="card-subtitle mb-2">{document.author} &#8212; {moment(document.date).format('MMM, DD YYYY')}</h6>
      <p className="card-text">{document.preview}</p>
      <p className="card-text"><a className="card-link" href={document.url}>{document.url}</a></p>
      <p className="card-text">
        <Link to={`/admin/articles/${document._id}/edit${location.search}`} className="btn btn-outline-primary">Edit</Link>
      </p>
    </AdminCard>
  );
});

export const ArticleEdit = compose(
  graphql(ARTICLE_QUERY, {
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
    props({data: { loading, article }}) {
      return {
        article
      };
    }
  }),
  graphql(ARTICLE_NEW, {
    withRef: true,
    skip({isNew}) {
      return !isNew;
    },
    name: 'newArticle',
    props({newArticle}) {
      return {
        newArticle: (article) => newArticle({
          variables: {
            article,
          },
        }),
      };
    },
  }),
  graphql(ARTICLE_UPDATE, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'updateArticle',
    props({ownProps, updateArticle}) {
      return {
        updateArticle: (article) => updateArticle({
          variables: {
            _id: ownProps.id,
            article,
          },
        }),
      };
    },
  }),
  graphql(ARTICLE_DELETE, {
    withRef: true,
    skip({isNew}) {
      return isNew;
    },
    name: 'deleteArticle',
    props({ownProps, deleteArticle}) {
      return {
        deleteArticle: () => deleteArticle({
          variables: {
            _id: ownProps.id,
          },
        }),
      };
    },
  }),
)(class ArticlePanel extends EditPanel {
  constructor(props) {
    super(props);
    this.editableFields = [
      'title',
      'is_published',
      'content',
      'slug',
      'author',
      'date',
      'cover_buffer',
      'thumb_buffer',
      'parent',
      'topic',
    ];
    this._handleFetch = this.handleFetch.bind(this);
  }

  submit() {
    if (this.props.isNew) {
      return this.props.newArticle(this.getChanges());
    } else {
      return this.props.updateArticle(this.getChanges());
    }
  }

  delete() {
    return this.props.deleteArticle();
  }

  handleFetch(e) {
    e.preventDefault();
    fetch(`/admin/docs/fetch/${this.state.docID}`, {
      credentials: 'same-origin',
    })
    .then(res => res.text())
    .then(text => {
      this.setState({
        content: text,
      });
    });
  }

  render() {
    // const article = (!this.props.isNew && this.props.article) || {
    //   is_published: false,
    //   title: '',
    //   content: '',
    //   author: '',
    //   date: Date.now(),
    //   slug: '',
    //   thumb: '',
    //   cover: '',
    // };

    // if (!article) {
    //   return null;
    // }
    if (!this.props.isNew && !this.props.article) {
      return null;
    }

    const article = Object.assign({}, this.props.article, this.state);
    const topic = defaultValue(this.state._topic, article.topic) || {};
    const parent = defaultValue(this.state._parent, article.parent) || {};

    return (
      <Fragment key={article._id}>
        <BooleanField
          label="Published"
          name="is_published"
          checked={article.is_published}
          onChange={this._handleChange}
        />

        <TextField
          label="Title"
          name="title"
          value={article.title || ''}
          onChange={this._handleChange}
        />

        <TextField
          label="Author"
          name="author"
          value={article.author || ''}
          onChange={this._handleChange}
        />

        <MediumField
          label="Edit Content"
          name="content"
          content={article.content || ''}
          onChange={(content) => this.setState({ content, })}
        />

        <div className="form-group">
          <TypeaheadField
            label="Pull from Google Drive"
            placeholder="Title"
            type="text"
            className="form-control"

            typeaheadConfig={{
              hint: true,
              highlight: true,
              minLength: 1,
              display: 'name',
            }}

            createBloodhoundConfig={function(Bloodhound) {
              return new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                  url: '/admin/docs/search?name=%QUERY',
                  wildcard: '%QUERY',
                },
              });
            }}

            onChange={(doc) => {
              if (doc) {
                this.setState({
                  docID: doc.id,
                });
              }
            }}
          />
        </div>

        <div className="form-group clearfix">
          <button className="float-right btn btn-outline-secondary" onClick={this._handleFetch}>Fetch</button>
        </div>

        <TypeaheadField
          label="Topic"
          placeholder="Topic"
          type="text"
          className="form-control"
          defaultValue={defaultValue(topic.title, '')}
          typeaheadConfig={{
            hint: true,
            highlight: true,
            minLength: 1,
            display: 'title',
          }}

          createBloodhoundConfig={function(Bloodhound, $) {
            return new Bloodhound({
              datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote: {
                url: '%QUERY',
                wildcard: '%QUERY',
                transport(options, onSuccess, onError) {
                  let data = {
                    operationName: 'TopicsQuery',
                    query: `
                      query TopicsQuery($title: String!) {
                        searchTopics(title: $title) {
                          _id
                          title
                        }
                      }
                    `,
                    variables: {
                      title: options.url,
                    },
                  };
                  $.ajax({
                    type: 'POST',
                    url: '/graphql',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                  })
                  .done(({data: { searchTopics } }) => {onSuccess(searchTopics); })
                  .fail((request, status, error) => {onError(error); });
                },
              },
            });
          }}

          onChange={(topic) => {
            topic = topic || {};
            this.setState({
              _topic: topic,
              topic: Object.assign({}, {
                _id: defaultValue(topic._id, null),
              }),
            });
          }}
        >
          <input type="text" readOnly className="form-control" placeholder="Topic ID"
            key={topic._id}
            value={defaultValue(topic._id, '')} />
        </TypeaheadField>

        <TypeaheadField
          label="Response To"
          placeholder="Article"
          type="text"
          className="form-control"
          defaultValue={defaultValue(parent.title, '')}
          typeaheadConfig={{
            hint: true,
            highlight: true,
            minLength: 1,
            display: 'title',
          }}

          createBloodhoundConfig={function(Bloodhound, $) {
            return new Bloodhound({
              datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote: {
                url: '%QUERY',
                wildcard: '%QUERY',
                transport(options, onSuccess, onError) {
                  let data = {
                    operationName: 'ArticlesQuery',
                    query: `
                      query ArticlesQuery($title: String!) {
                        searchArticles(title: $title) {
                          _id
                          title
                        }
                      }
                    `,
                    variables: {
                      title: options.url,
                    },
                  };
                  $.ajax({
                    type: 'POST',
                    url: '/graphql',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                  })
                  .done(({data: { searchArticles } }) => {onSuccess(searchArticles); })
                  .fail((request, status, error) => {onError(error); });
                },
              },
            });
          }}

          onChange={(parent) => {
            parent = parent || {};
            this.setState({
              _parent: parent,
              parent: Object.assign({}, {
                _id: defaultValue(parent._id, null),
              }),
            });
          }}
        >
          <input type="text" readOnly className="form-control" placeholder="Parent ID"
            key={parent._id}
            value={defaultValue(parent._id, '')} />
        </TypeaheadField>

        <DatetimeField
          label="Post Date"
          defaultNow
          value={article.date}
          dateFormat="MMM DD, YYYY"
          timeFormat="h:mm A"
          onChange={date => {
            this.setState({
              date: moment(date).isValid() ? date : undefined,
            });
          }}
        />

        <ImageField
          label="Cover Photo"
          name="cover"
          src={article.cover}
          preview={this.state.cover_preview_img}
          onChange={this._handleImageChange}
        />

        <ImageField
          label="Thumbnail"
          name="thumb"
          src={article.thumb}
          preview={this.state.thumb_preview_img}
          onChange={this._handleImageChange}
        />

        <TextField
          label="Slug"
          name="slug"
          value={article.slug || ''}
          onChange={this._handleChange}
        />
      </Fragment>
    );
  }
});

export default () => (
  <ModelPage
    loadQuery={ARTICLES_LOAD_QUERY}
    modelName="Article"
    displayComponent={ArticleDisplay}
    editorComponent={ArticleEdit}
  />
);
