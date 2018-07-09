
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Optional from '../../common/components/optional';
import {getFileURL} from '../../common/helpers/file';
import ArticleThumb from './article-thumb';

const TOPIC_ARTICLES_QUERY = gql`
query TopicArticles($skip: Int!, $topic: ObjectID!) {
  topicArticles(limit: 10, skip: $skip, topic: $topic) {
    title
    slug
    preview(length: 300)
    date
    author
    thumb
  }
}
`;

const TopicArticles = graphql(gql`
  query TopicArticlesWithCount($skip: Int!, $topic: ObjectID!) {
    topicArticles(limit: 10, skip: $skip, topic: $topic) {
      title
      slug
      preview(length: 300)
      date
      author
      thumb
    }
    topicArticlesCount
  }
`, {
  options({topic}) {
    return {
      variables: {
        skip: 0,
        topic: topic._id,
      },
    };
  },
  props({ data: {loading, topicArticles, topicArticlesCount, fetchMore } }) {
    return {
      loading,
      topicArticles,
      loadMore() {
        return fetchMore({
          query: TOPIC_ARTICLES_QUERY,
          variables: {
            skip: topicArticles.length,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return previousResult;
            }
            return Object.assign({}, previousResult, {
              topicArticles: [...previousResult.topicArticles, ...fetchMoreResult.topicArticles],
            });
          },
        });
      },
      hasMore() {
        return topicArticles && topicArticles.length < topicArticlesCount;
      },
    };
  },
})( ({topic, loading, topicArticles, loadMore, hasMore}) => {
  topicArticles = topicArticles || [];
  return (
    <div className="container-fluid white-theme discussion">
        <div className="container">
            <h1 className="strong">{topic.title}</h1>
            <Optional test={topic.content}>
                <div className="article-content" dangerouslySetInnerHTML={{__html: topic.content}}></div>
            </Optional>
            <div className="tile tile-vertical">
                {topicArticles.map((response, i) =>
                    <ArticleThumb article={response} key={i} />
                )}
            </div>
        </div>
    </div>
  );
});

class TopicMain extends Component {
  render() {
    const topic = this.props.topic || {};
    return (
      <div className="article" data-article-id={topic._id}>
          <Helmet>
              <meta name="description" content={topic.metaDescription} />
          </Helmet>
          <Optional test={topic.cover}>
              <div>
                  <div className="article-cover" style={{backgroundImage: `url(${getFileURL(topic.cover, topic.cover_preview_img)})`}} />
                  <div className="nav-mask">
                      <div className="article-cover-blur" style={{backgroundImage: `url(${getFileURL(topic.cover, topic.cover_preview_img)})`}}></div>
                      <div className="nav-mask-bg" />
                  </div>
              </div>
          </Optional>
          <Optional test={!topic.cover}>
              <div>
                  <style>{`
                      nav.navbar {
                          background-color: #222;
                      }
                  `}</style>
                  <div style={{marginTop: '80px'}} />
              </div>
          </Optional>
          <TopicArticles topic={topic} />
      </div>
    );
  }
}

TopicMain.propTypes = {
  topic: PropTypes.object.isRequired,
};

export default TopicMain;
