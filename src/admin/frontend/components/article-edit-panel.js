'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Optional from '~/common/frontend/components/optional';
import TypeaheadInput from './typeahead-input';
import moment from 'moment';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';
import EditForm from './edit-form';

class ArticleEditPanel extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const article = this.props.article || {};
    this.originalDate = article.date;

    this.setState({
      dateNow: !article.is_published,
      date: new Date(),
    });
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  dateNowToggled(event) {
    this.setState({
      dateNow: event.target.checked,
    });
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

  syncArticle(event) {
    event.preventDefault();
    const docId = event.target.elements['doc-id-input'].value;
    if (docId && confirm('Content on this page will be replaced. Are you sure?')) {
      $.post(`/admin/articles/docs/sync/${docId}`, (content) => {
        this.props.stage.update('content', content);
      });
    }
  }

  render() {
    const article = this.props.stage.values;

    return (
      <div className="admin-sidebar">
          <Optional test={this.props.gdriveSync}>
            <form className="form" action="sync" method="POST" onSubmit={this.syncArticle.bind(this)}>
                <div className="form-group">
                    <label>Pull from Google Drive</label>
                    <TypeaheadInput
                      labelKey="name"
                      query={`
                        query DocumentsQuery($title: String!) {
                          searchDocuments(title: $title) {
                            id
                            name
                          }
                        }
                      `}
                      getVariables={query => {
                        return {
                          title: query,
                        };
                      }}
                      onChange={selectedItems => {
                        const selected = selectedItems[0];
                        if (selected) {
                          var el = document.getElementById('doc-id-input');
                          el.value = selected.id;
                        }
                      }}
                      minLength={1}
                    />
                    <input className="form-control" id="doc-id-input" name="doc_id" placeholder="Document ID" readOnly />
                </div>
                <div className="form-group">
                    <button className="btn btn-default" type="submit">Sync</button>
                </div>
            </form>
          </Optional>
          <EditForm {...this.props} key={article._id} getName={values => values.title} preSubmit={() => {
            if (this.props.getArticleContent) {
              return this.props.stage.update('content', this.props.getArticleContent());
            } else {
              return Promise.resolve();
            }
          }} >
              <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-control"
                    placeholder="Article Title"
                    value={article.title || ''}
                    onChange={e => this.props.stage.update('title', e.target.value)}
                  />
              </div>

              <div className="form-group">
                  <label>Author</label>
                  <input type="text" className="form-control"
                    placeholder="Author"
                    value={article.author || ''}
                    onChange={e => this.props.stage.update('author', e.target.value)}
                  />
              </div>

              <div className="form-group">
                  <div className="checkbox">
                      <label className="checkbox-inline">
                          <input type="checkbox"
                            checked={article.is_published || false}
                            onChange={e => this.props.stage.update('is_published', e.target.checked) }
                          />
                          Published
                      </label>
                  </div>
              </div>

              <div className="form-group">
                  <label>Cover Photo</label>
                  <Optional test={this.props.imagePreviews}>
                      <img
                        style={{maxWidth: '200px', display: 'block'}}
                        src={(article.cover || article.cover_preview_img) ? getFileURL(article.cover, article.cover_preview_img) : ''}
                      />
                  </Optional>
                  <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'cover')} />
              </div>

              <div className="form-group">
                  <label>Thumbnail</label>
                  <Optional test={this.props.imagePreviews}>
                      <img
                        style={{maxWidth: '200px', display: 'block'}}
                        src={(article.thumb || article.thumb_preview_img) ? getFileURL(article.thumb, article.thumb_preview_img) : ''}
                      />
                  </Optional>
                  <input type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'thumb')} />
              </div>

              <div className="form-group">
                  <label htmlFor="slug-input">Slug</label>
                  <input id="slug-input" name="slug" type="text" className="form-control" placeholder="Slug"
                      value={article.slug || ''}
                      onChange={ e => this.props.stage.update('slug', e.target.value) } />
              </div>

              <div className="form-group">
                <label>Response To</label>
                <TypeaheadInput
                  labelKey="title"
                  query={`
                    query ArticlesQuery($title: String!) {
                      searchArticles(title: $title) {
                        _id
                        title
                      }
                    }
                  `}
                  getVariables={query => {
                    return {
                      title: query,
                    };
                  }}
                  onChange={selectedItems => {
                    const selected = selectedItems[0];
                    if (selected) {
                      this.props.stage.update('parentID', selected._id);
                      this.props.stage.update('parent', selected);
                    }
                  }}
                  minLength={1}
                  defaultSelected={(article.parent && article.parent._id) ? [article.parent] : undefined}
                />
                <input type="text" readOnly className="form-control" placeholder="Article ID" value={article.parentID || (article.parent && article.parent._id) || ''} />
              </div>

              <div className="form-group">
                <label>Topic</label>
                <TypeaheadInput
                  labelKey="title"
                  query={`
                    query TopicsQuery($title: String!) {
                      searchTopics(title: $title) {
                        _id
                        title
                      }
                    }
                  `}
                  getVariables={query => {
                    return {
                      title: query,
                    };
                  }}
                  onChange={selectedItems => {
                    const selected = selectedItems[0];
                    if (selected) {
                      this.props.stage.update('topicID', selected._id);
                      this.props.stage.update('topic', selected);
                    }
                  }}
                  minLength={1}
                  defaultSelected={(article.topic && article.topic._id) ? [article.topic] : undefined}
                />
                <input type="text" readOnly className="form-control" placeholder="Topic ID" value={article.topicID || (article.topic && article.topic._id) || ''} />
              </div>

              <div className="form-group">
                  <label>Post Date</label>
                  <input type="text" className="form-control"
                    disabled={this.state.dateNow}
                    onChange={ e => this.props.stage.update('date', moment(e.target.value || this.originalDate))}
                    placeholder={moment(this.state.dateNow ? this.state.date : article.date).format('MMM DD, YYYY [at] H:mm:ss')}
                  />
                  <div>
                    <span>{moment(this.state.dateNow ? this.state.date : article.date).format('MMM DD, YYYY [at] H:mm:ss')}</span>
                    <span className="pull-right">
                      <span className="checkbox" style={{margin: 0}}>
                          <label className="checkbox-inline">
                              <input type="checkbox" checked={this.state.dateNow} onChange={this.dateNowToggled.bind(this)} /> Now
                          </label>
                      </span>
                    </span>
                  </div>
                  <input id="date-input" name="date" type="hidden" className="form-control"
                      value={moment(this.state.dateNow ? this.state.date : article.date).format('MMM DD, YYYY [at] H:mm:ss')} />

              </div>
          </EditForm>
      </div>
    );
  }
}

ArticleEditPanel.propTypes = {
  stage: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

export default ArticleEditPanel;
