
import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import { Helmet } from 'react-helmet';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import moment from 'moment';
import Optional from '../../common/components/optional';
import {getFileURL} from '../../common/helpers/file';
import ArticleThumb from './article-thumb';

const RESPONSE_ARTICLES_QUERY = gql`
query ReponseArticles($skip: Int!, $parent: ObjectID!) {
  articleResponses(limit: 10, skip: $skip, parent: $parent) {
    title
    slug
    preview(length: 300)
    date
    author
    thumb
  }
}
`;

const ResponseArticles = graphql(gql`
  query ResponseArticlesWithCount($skip: Int!, $parent: ObjectID!) {
    articleResponses(limit: 10, skip: $skip, parent: $parent) {
      title
      slug
      preview(length: 300)
      date
      author
      thumb
    }
    articleResponsesCount
  }
`, {
  skip(props) {
    return !props._id;
  },
  options(props) {
    return {
      variables: {
        skip: 0,
        parent: props._id,
      },
    };
  },
  props({ data: {loading, articleResponses, articleResponsesCount, fetchMore } }) {
    return {
      loading,
      articleResponses,
      loadMore() {
        return fetchMore({
          query: RESPONSE_ARTICLES_QUERY,
          variables: {
            skip: articleResponses.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              articleResponses: [...previousResult.articleResponses, ...fetchMoreResult.articleResponses],
            });
          },
        });
      },
      hasMore() {
        return articleResponses && articleResponses.length < articleResponsesCount;
      },
    };
  },
})( ({loading, articleResponses, loadMore, hasMore}) => {
  articleResponses = articleResponses || [];
  return (
    <Optional test={articleResponses.length}>
        <div className="container-fluid white-theme discussion">
            <div className="container">
                <h1 className="strong">Discussion</h1>
                <div className="tile tile-vertical">
                    {articleResponses.map((response, i) =>
                        <ArticleThumb article={response} key={i} />
                    )}
                </div>
            </div>
        </div>
    </Optional>
  );
});

const ResponseTo = ({parent}) => (
  <div className="response-to" data-article-id={parent._id}>
      <h2>In Response To:&nbsp;
          <Link className="response-title" to={`/articles/${parent.slug}`} dangerouslySetInnerHTML={{__html: parent.title}}></Link>
      </h2>
  </div>
);

class ArticleMain extends Component {
  render() {
    const article = this.props.article || {};
    return (
      <div className="article" data-article-id={article._id}>
          <Helmet>
              <meta name="description" content={article.metaDescription} />
          </Helmet>
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
              <Optional test={article.parent && article.parent._id}>
                  <ResponseTo parent={article.parent || {}} />
              </Optional>

              <h1 className="article-title strong">{article.title}</h1>
              <h4 className="article-author-date thin">{article.author} &#8212; {moment(article.date).format('MMM, DD YYYY')}</h4>
              <div className="article-content" dangerouslySetInnerHTML={{__html: article.content}}></div>

          </div>

          <ResponseArticles _id={article._id} />
      </div>
    );
  }
}

ArticleMain.propTypes = {
  article: PropTypes.object.isRequired,
};

export default ArticleMain;
