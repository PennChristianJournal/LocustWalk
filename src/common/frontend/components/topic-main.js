
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArticleThumb from './article-thumb';
import Optional from './optional';
import {getFileURL} from '../helpers/file';
import {graphql, gql} from 'react-apollo';
import {headData} from '~/common/frontend/head';

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
  options(props) {
    return {
      variables: {
        skip: 0,
        topic: props.topic._id,
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

export default headData(head => {
  head.addLink([
    {
      href: '/bower_components/medium-editor/dist/css/themes/default.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article-discussion.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ]);
})(TopicMain);
