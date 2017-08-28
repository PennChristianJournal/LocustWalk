'use strict';
import {gql} from 'react-apollo';

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

export const FEATURE_QUERY = gql`
  query FeatureQuery($_id: ObjectID!) {
    feature(_id: $_id) {
      _id
      title
      index
      mainItem {
        _id
        title
        __typename
      }
      secondaryItems {
        _id
        title
        __typename
      }
    }
  }
`;

