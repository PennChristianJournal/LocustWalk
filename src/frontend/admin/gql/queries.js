'use strict';
import gql from 'graphql-tag';
import {ArticleFields, TopicFields, FeatureFields} from './fragments';

export const ARTICLE_QUERY = gql`
  query ArticleQuery($_id: ObjectID!) {
    article(_id: $_id) {
      ...ArticleFields
      content
    }
  }
  ${ArticleFields}
`;

export const ARTICLES_LOAD_QUERY = gql`
  query LoadArticles($limit: Int!, $skip: Int!, $search: String) {
    documents: articles(limit: $limit, skip: $skip, search: $search) {
      ...ArticleFields
    }
    documentCount: articleCount(search: $search)
  }
  ${ArticleFields}
`;

export const ARTICLE_RESPONSES_QUERY = gql`
  query ResponseArticles($parent: ObjectID!) {
    articleResponses(parent: $parent) {
      ...ArticleFields
    }
  }
  ${ArticleFields}
`;

export const TOPICS_LOAD_QUERY = gql`
  query LoadTopics($limit: Int!, $skip: Int!, $search: String) {
    documents: topics(limit: $limit, skip: $skip, search: $search) {
      ...TopicFields
    }
    documentCount: topicCount(search: $search)
  }
  ${TopicFields}
`;

export const TOPIC_QUERY = gql`
  query TopicQuery($_id: ObjectID!) {
    topic(_id: $_id) {
      ...TopicFields
      content
    }
  }
  ${TopicFields}
`;

export const FEATURE_QUERY = gql`
  query FeatureQuery($_id: ObjectID!) {
    feature(_id: $_id) {
      ...FeatureFields
    }
  }
  ${FeatureFields}
`;

export const FEATURES_LOAD_QUERY = gql`
  query LoadFeatures($limit: Int!, $skip: Int!, $search: String) {
    documents: features(limit: $limit, skip: $skip, search: $search) {
      ...FeatureFields
    }
    documentCount: featureCount(search: $search)
  }
  ${FeatureFields}
`;
