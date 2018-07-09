
import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getFileURL } from '../../common/helpers/file';

class ArticleThumb extends Component {
  render() {
    const article = this.props.article;
    return (
      <div className="article-thumb-block">
          <div className="thumb">
              <Link to={`/articles/${article.slug}`}>
                  <div className="thumb-aspect" style={{
                    backgroundImage: `url(${getFileURL(article.thumb, article.thumb_preview_img)})`,
                  }}></div>
              </Link>
          </div>
          <div className="article-thumb-content">
              <Link to={`/articles/${article.slug}`}>
                  <h2 className="title">{article.title}</h2>
              </Link>
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

export default ArticleThumb;
