
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getFileURL } from '../helpers/file';
import { headData } from '~/common/frontend/head';

class ArticleThumb extends Component {
  render() {
    const article = this.props.article;
    return (
      <div className="article-thumb-block">
          <div className="thumb">
              <a href={`/articles/${article.slug}`}>
                  <div className="thumb-aspect" style={{
                    backgroundImage: `url(${getFileURL(article.thumb, article.thumb_preview_img)})`,
                  }}></div>
              </a>
          </div>
          <div className="article-thumb-content">
              <a href={`/articles/${article.slug}`}>
                  <h2 className="title">{article.title}</h2>
              </a>
              <p className="author-date h6">
                  <span className="author">{article.author}&#8212;&nbsp;</span>
                  <span className="date">{moment(article.date).format('MMM, DD YYYY')}</span>
              </p>
              <p className="preview">{article.preview}</p>
          </div>
      </div>
    );
  }
}

ArticleThumb.propTypes = {
  article: PropTypes.object.isRequired,
};

export default headData(head => {
  head.addLink({
    href: '/css/article-thumb.css',
    rel: 'stylesheet',
    type: 'text/css',
  });
})(ArticleThumb);