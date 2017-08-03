'use strict';
import {gql} from 'react-apollo';

export const ARTICLE_LIST_QUERY = gql`
  query ListArticles($skip: Int!) {
    articles: recentArticles(limit: 10, skip: $skip) {
      _id
      title
      slug
      date
      is_featured
      is_published
      topic {
        title
      }
    }
    articleCount
  }
`;

export const ARTICLE_QUERY = gql`
  query ArticleQuery($_id: ObjectID!) {
    article(_id: $_id) {
      _id
      title
      content
      preview
      slug
      author
      date
      is_published
      is_featured
      cover
      thumb
      parent {
        _id
        title
      }
      topic {
        _id
        title
      }
    }
  }
`;

export const TOPIC_LIST_QUERY = gql`
  query ListTopics($skip: Int!) {
    topics(limit: 10, skip: $skip) {
      _id
      title
      slug
    }
    topicCount
  }
`;

export const TOPIC_QUERY = gql`
  query TopicQuery($_id: ObjectID!) {
    topic(_id: $_id) {
      _id
      title
      slug
      content
      preview
      cover
      thumb
    }
  }
`;
