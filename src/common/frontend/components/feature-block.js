
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {articleHeading} from '../helpers/article';
import moment from 'moment';
import {htmlPreview} from '../helpers/format';
import ArticleGroup from './article-group';

class FeatureThumb extends Component {
  render() {
    var article = this.props.article;
    return (
      <div 
          className={this.props.response ? 'feature-response' : 'featured'}
          style={this.props.single ? {width: '100%'} : null}>

          <div className={this.props.response ? 'feature-response-aspect' : this.props.single ? 'featured-block-aspect' : 'featured-aspect'}>
              <div className="content">
                  <a href={`/articles/${article.slug}`}>
                      <div className="bg-img" style={{backgroundImage: `url("/files/${article.thumb}")`}}></div>
                      <div className="title-box">
                          <div className="title-img" style={{backgroundImage: `url("/files/${article.thumb}")`}}></div>
                          <div className="title-bg-darken"></div>
                          <div className="title-content">
                              <h2 className="title" dangerouslySetInnerHTML={{__html: article.title}} />
                              <p className="author-date h6">
                                  <span className="author" dangerouslySetInnerHTML={{__html: article.author + '&nbsp;&#8212;&nbsp;'}}></span>
                                  <span className="date">{moment(article.date).format('MMM, DD YYYY')}</span>
                                  <br />
                                  {this.props.response ? null : 
                                  <span className="preview p" dangerouslySetInnerHTML={{__html: htmlPreview(article.content, 140)}}></span>
                                  }
                              </p>
                          </div>
                      </div>
                  </a>
              </div>
          </div>
      </div>
    );
  }
}

FeatureThumb.propTypes = {
  article: PropTypes.object.isRequired,
};

export default class FeatureBlock extends Component {
  render() {
    var article = this.props.article;
    return (
      <div className="featured-block">
          <div className="feature-month-bar">
              <h2 className="strong feature-month">{articleHeading(article)}</h2>
          </div>
          <div className="feature-block-aspect">
              <div className="content">
                  <ArticleGroup name={`response.${article._id}`} query={{
                    sort: 'date',
                    limit: 2,
                    is_published: true,
                    parent: article._id,
                  }}>
                      {articles => {
                        if (articles.length == 2) {
                          return (
                            <div>
                                <FeatureThumb article={article} />
                                <FeatureThumb article={articles[0]} response />
                                <FeatureThumb article={articles[1]} response />
                            </div>
                          );
                        } else {
                          return (
                            <div>
                                <FeatureThumb article={article} single />
                            </div>
                          );
                        } 
                      }} 
                  </ArticleGroup>
              </div>
          </div>
      </div>
    );
  }
}

FeatureBlock.propTypes = {
  article: PropTypes.object.isRequired,
};
