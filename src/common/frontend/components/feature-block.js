
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {articleHeading} from '../helpers/article';
import moment from 'moment';
import {getFileURL} from '../helpers/file';
import Optional from './optional';
import {graphql, gql} from 'react-apollo';

class FeatureThumb extends Component {
  render() {
    const article = this.props.article;
    return (
      <div 
          className={this.props.response ? 'feature-response' : 'featured'}
          style={this.props.single ? {width: '100%'} : null}>

          <div className={this.props.response ? 'feature-response-aspect' : this.props.single ? 'featured-block-aspect' : 'featured-aspect'}>
              <div className="content">
                  <a href={`/articles/${article.slug}`}>
                      <div className="bg-img" style={{backgroundImage: `url(${getFileURL(article.thumb, article.thumb_preview_img)})`}}></div>
                      <div className="title-box">
                          <div className="title-img" style={{backgroundImage: `url(${getFileURL(article.thumb, article.thumb_preview_img)})`}}></div>
                          <div className="title-bg-darken"></div>
                          <div className="title-content">
                              <h2 className="title">{article.title}</h2>
                              <p className="author-date h6">
                                  <span className="author" dangerouslySetInnerHTML={{__html: article.author + '&nbsp;&#8212;&nbsp;'}}></span>
                                  <span className="date">{moment(article.date).format('MMM, DD YYYY')}</span>
                                  <br />
                                  <Optional test={!this.props.response}>
                                    <span className="preview p">{article.preview}</span>
                                  </Optional>
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

class FeatureBlock extends Component {
  render() {
    return (
      <div className="featured-block">
          <div className="feature-month-bar">
              <h2 className="strong feature-month">{articleHeading(this.props.article)}</h2>
          </div>
          <div className="feature-block-aspect">
              <div className="content">
                  <Optional test={this.props.articleResponses.length === 2}>
                      <div>
                          <FeatureThumb article={this.props.article} />
                          <FeatureThumb article={this.props.articleResponses[0] || {}} response />
                          <FeatureThumb article={this.props.articleResponses[1] || {}} response />
                      </div>
                  </Optional>
                  <Optional test={this.props.articleResponses.length !== 2}>
                      <div>
                          <FeatureThumb article={this.props.article} single />
                      </div>
                  </Optional>
              </div>
          </div>
      </div>
    );
  }
}

FeatureBlock.propTypes = {
  article: PropTypes.object.isRequired,
  articleResponses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const RESPONSE_ARTICLES_QUERY = gql`
  query ArticleResponses($parent: ObjectID!) {
    articleResponses(limit: 2, parent: $parent) {
      title
      slug
      date
      thumb
      author
      preview(length: 140)
    }
  }
`;

export default graphql(RESPONSE_ARTICLES_QUERY, {
  options(props) {
    return {
      variables: {
        parent: props.article._id,
      },
    };
  },
  props({ ownProps: { article }, data: { loading, articleResponses } }) {
    return {
      article,
      loading,
      articleResponses,
    };
  },
})( ({ article, loading, articleResponses }) => {
  return loading ? null : <FeatureBlock article={article} articleResponses={articleResponses || []} />;
});

