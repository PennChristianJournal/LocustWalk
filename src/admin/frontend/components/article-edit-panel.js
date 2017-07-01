
import React, {Component} from 'react';
import {connect} from 'react-redux';
import ArticleGroup from '~/common/frontend/components/article-group';
import Optional from '~/common/frontend/components/optional';
import TypeaheadInput from './typeahead-input';
import { updateArticle } from '~/common/frontend/actions/articles';
import { invalidateArticles } from '~/common/frontend/actions/articles';
import moment from 'moment';
import {getFileURL} from '~/common/frontend/helpers/file';
import $ from 'jquery';

class ArticleSidebar extends Component {
  constructor(props) {
    super(props);
    const article = props.article || {};

    this.originalDate = article.date;

    this.state = {
      dateNow: !article.is_published,
      date: new Date(),
    };
  }

  componentWillReceiveProps(nextProps) {
    const article = nextProps.article || {};
    this.state = {
      dateNow: !article.is_published,
      date: new Date(),
    };
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
    this.props.updateArticle(prop, blob);
  }

  handleSubmit(event) {
    if (this.props.getArticleContent) {
      const articleContent = this.props.getArticleContent();
      if (articleContent) {
        event.target.content.value = articleContent;
      }
    }
  }

  render() {
    const article = this.props.article || {};
    return (
      <div className="admin-sidebar">
          <Optional test={this.props.gdriveSync}>
            <form className="form" action="sync" method="POST" onSubmit={this.props.syncArticle}>
                <style dangerouslySetInnerHTML={{__html: `
                  .twitter-typeahead {
                    display: block!important;
                  }

                  .tt-dropdown-menu {
                    width: 100%;
                    & > div {
                      padding: 5px;
                      border-radius: 5px;
                      box-shadow: 0 0 10px 0 black;
                      background-color: white;
                    }
                  }
                  .tt-suggestion {
                    padding: 2px 10px;
                    line-height: 24px;
                    color: #333;
                    p {
                      margin: 0;
                    }
                  }

                  .tt-suggestion.tt-cursor,.tt-suggestion:hover {
                    color: #fff;
                    background-color: #0097cf;
                  }

                  .tt-hint {
                    color: #999
                  }

                  .tt-menu {
                    width: 100%;
                    background-color: white;
                    border: 1px solid gray;
                  }
                `}} />

                <div className="form-group">
                    <label>Pull from Google Drive</label>
                    <TypeaheadInput
                      className="form-control" placeholder="Document Title"

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
                            url: '/admin/articles/docs/search?name=%QUERY',
                            wildcard: '%QUERY',
                          },
                        });
                      }}

                      target="#doc-id-input"
                      targetField="id"
                    />
                    <input className="form-control" id="doc-id-input" name="doc_id" placeholder="Document ID" readOnly />
                </div>
                <div className="form-group">
                    <button className="btn btn-default" type="submit">Sync</button>
                </div>
            </form>
          </Optional>
          <form onSubmit={this.handleSubmit.bind(this)} className="form" key={article._id} action={`/admin/articles/${article._id}/edit`} method="post" encType="multipart/form-data">
              {this.props.contentEdit ? <input type="hidden" name="content" /> : null }
              <div className="form-group">
                  <label htmlFor="cover-photo-input">Cover Photo</label>
                  { this.props.imagePreviews ? <img src={article.cover ? getFileURL(article.cover, article.cover_preview_img) : ''} /> : null }
                  <input id="cover-photo-input" name="cover" type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'cover_preview_img')} />
              </div>
              <div className="form-group">
                  <label htmlFor="thumbnail-input">Thumbnail</label>
                  { this.props.imagePreviews ? <img src={article.thumb ? getFileURL(article.thumb, article.thumb_preview_img) : ''} /> : null }
                  <input id="thumbnail-input" name="thumb" type="file" accept="image/*" onChange={this.handleImageChange.bind(this, 'thumb_preview_img')} />
              </div>
              <div className="form-group">
                  <div className="checkbox">
                      <label htmlFor="is_featured-input" className="checkbox-inline">
                          <input id="is_featured-input" name="is_featured" type="checkbox"
                            defaultChecked={article.is_featured || false}
                            onChange={e => this.props.updateArticle('is_featured', e.target.checked) }
                           />
                          Featured
                      </label>
                      <label htmlFor="is_published-input" className="checkbox-inline">
                          <input id="is_published-input" name="is_published" type="checkbox" defaultChecked={article.is_published || false} />
                          Published
                      </label>
                  </div>
              </div>
              <div className="form-group">
                  <label htmlFor="title-input">Title</label>
                  <input id="title-type" name="title" type="text" className="form-control" placeholder="Article Title"
                      defaultValue={article.title}
                      onChange={ e => this.props.updateArticle('title', e.target.value) } />
              </div>
              <div className="form-group">
                  <label htmlFor="author-input">Author</label>
                  <input id="author-input" name="author" type="text" className="form-control" placeholder="Author"
                      defaultValue={article.author}
                      onChange={ e => this.props.updateArticle('author', e.target.value) } />
              </div>
              <div className="form-group">
                  <label htmlFor="slug-input">Slug</label>
                  <input id="slug-input" name="slug" type="text" className="form-control" placeholder="Slug"
                      defaultValue={article.slug}
                      onChange={ e => this.props.updateArticle('slug', e.target.value) } />
              </div>
              <div className="form-group">
                  <label htmlFor="response-to-input">Response To</label>
                  <ArticleGroup name="parent" query={{
                    _id: article.parent,
                    limit: 1,
                  }}>
                      { articles => {
                        const parent = articles[0] || {};
                        return (
                          <TypeaheadInput
                            key={parent._id} type="text" className="form-control" placeholder="Response To..." defaultValue={parent.title}

                            typeaheadConfig={{
                              hint: true,
                              highlight: true,
                              minLength: 1,
                              display: 'title',
                            }}

                            createBloodhoundConfig={function(Bloodhound) {
                              return new Bloodhound({
                                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
                                queryTokenizer: Bloodhound.tokenizers.whitespace,
                                remote: {
                                  url: '/admin/articles/search?title=%QUERY',
                                  wildcard: '%QUERY',
                                },
                              });
                            }}

                            target={this.refs['response-id-field']}
                            targetField="_id"
                          />
                        );
                      }}
                  </ArticleGroup>

                  <input ref="response-id-field" name="parent" type="text" readOnly className="form-control" placeholder="Article ID"
                      defaultValue={article.parent || ''}
                      onChange={ e => {
                        this.props.updateArticle('parent', e.target.value);
                        this.props.refreshParent();
                      } }
                  />

              </div>
              <div className="form-group">
                  <label htmlFor="date-input">Post Date</label>
                  <input type="text" className="form-control"
                    disabled={this.state.dateNow}
                    onChange={ e => this.props.updateArticle('date', moment(e.target.value || this.originalDate))}
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
              <div className="form-group">
                  <label htmlFor="heading-input">Heading Override</label>
                  <input id="heading-input" name="heading_override" type="text" className="form-control" placeholder="Jun 2016 Special Feature"
                      defaultValue={article.heading_override || moment(this.state.dateNow ? this.state.date : article.date).format('MMM YYYY [Feature Article]')}
                      onChange={ e => this.props.updateArticle('heading_override', e.target.value) }
                  />
              </div>
              <button className="btn btn-primary" type="submit">Save</button>
          </form>
      </div>
    );
  }
}

export default connect(null, function(dispatch, ownProps) {
  return {
    refreshParent: function() {
      dispatch(invalidateArticles('parent', 0));
    },

    updateArticle: function(property, value) {
      dispatch(updateArticle(ownProps.article._id, property, value));
    },

    syncArticle: function(event) {
      event.preventDefault();
      const docId = event.target.elements['doc-id-input'].value;
      if (docId && confirm('Content on this page will be replaced. Are you sure?')) {
        $.post(`/admin/articles/docs/sync/${docId}`, function(content) {
          dispatch(updateArticle(ownProps.article._id, 'content', content));
        });
      }
    },
  };
})(ArticleSidebar);
