
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { htmlPreview } from '../helpers/format';
import {getFileURL} from '../helpers/file';

export default class ArticleThumb extends Component {
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
              <p className="preview" dangerouslySetInnerHTML={{__html: htmlPreview(article.content, 300)}}/>
          </div>
      </div>
    );
  }
}

ArticleThumb.propTypes = {
<<<<<<< HEAD
  article: PropTypes.object.isRequired,
=======
  article: React.PropTypes.object.isRequired,
>>>>>>> e3f14e90773abed4084ef3c4b55de6d4f2c81eb0
};
