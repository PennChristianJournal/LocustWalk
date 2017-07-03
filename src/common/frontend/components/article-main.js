
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleGroup from './article-group';
import ArticleThumb from './article-thumb';
import Optional from './optional';
import moment from 'moment';
import {getFileURL} from '../helpers/file';

const ResponseTo = (article = {}) => (
  <Optional test={article.title}>
      <div className="response-to" data-article-id={article._id}>
          <h2>In Response To:&nbsp;
              <a className="response-title" href={`/articles/${article.slug}`} dangerouslySetInnerHTML={{__html: article.title}}></a>
          </h2>
      </div>
  </Optional>
);

export default class ArticleMain extends Component {
  render() {
    const article = this.props.article || {};
    return (
      <div className="article" data-article-id={article._id}>
          <Optional test={article.cover}>
              <div>
                  <div className="article-cover" style={{backgroundImage: `url(${getFileURL(article.cover, article.cover_preview_img)})`}} />
                  <div className="nav-mask">
                      <div className="article-cover-blur" style={{backgroundImage: `url(${getFileURL(article.cover, article.cover_preview_img)})`}}></div>
                      <div className="nav-mask-bg" />
                  </div>
              </div>
          </Optional>
          <Optional test={!article.cover}>
              <div>
                  <style>{`
                      nav.navbar {
                          background-color: #222;
                      }
                  `}</style>
                  <div style={{marginTop: '80px'}} />
              </div>
          </Optional>

          <div className="container">
              <Optional test={article.parent}>
                  <ArticleGroup name="parent" query={{
                    _id: article.parent,
                    is_published: true,
                    limit: 1,
                  }}>
                      { articles => ResponseTo(articles[0]) }
                  </ArticleGroup>
              </Optional>

              <h1 className="article-title strong">{article.title}</h1>
              <h4 className="article-author-date thin">{article.author} &#8212; {moment(article.date).format('MMM, DD YYYY')}</h4>
              <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}}></div>

          </div>
          <ArticleGroup name="responses" query={{
            parent: article._id,
<<<<<<< HEAD:src/react/components/article-main.js
            published: true,
=======
            is_published: true,
>>>>>>> 7c692e3fae7931c0d10e34f7d6c0598187169792:src/common/frontend/components/article-main.js
          }}>
              { responses =>
                <Optional test={responses && responses.length}>
                    <div className="container-fluid white-theme discussion">
                        <div className="container">
                            <h1 className="strong">Discussion</h1>
                            <div className="tile tile-vertical">
                                {responses.map((response, i) => 
                                    <ArticleThumb article={response} key={i} />
                                )}
                            </div>
                        </div>
                    </div>
                </Optional>
              }
          </ArticleGroup>
      </div>
    );
  }
}

ArticleMain.propTypes = {
  article: PropTypes.object.isRequired,
};
