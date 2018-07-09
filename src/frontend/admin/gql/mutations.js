'use strict';
import gql from 'graphql-tag';
import {ArticleFields, TopicFields, FeatureFields} from './fragments';

export const ARTICLE_NEW = gql`
  mutation newArticle($article: ArticleInput!) {
    newArticle(article: $article) {
      ...ArticleFields
    }
  }
  ${ArticleFields}
`;

export const ARTICLE_UPDATE = gql`
  mutation updateArticle($_id: ObjectID!, $article: ArticleInput) {
    updateArticle(_id: $_id, article: $article) {
      ...ArticleFields
    }
  }
  ${ArticleFields}
`;

export const ARTICLE_DELETE = gql`
  mutation deleteArticle($_id: ObjectID!) {
    deleteArticle(_id: $_id) {
      ...ArticleFields
    }
  }
  ${ArticleFields}
`;

export const TOPIC_NEW = gql`
  mutation newTopic($topic: TopicInput!) {
    newTopic(topic: $topic) {
      ...TopicFields
    }
  }
  ${TopicFields}
`;

export const TOPIC_UPDATE = gql`
  mutation updateTopic($_id: ObjectID!, $topic: TopicInput) {
    updateTopic(_id: $_id, topic: $topic) {
      ...TopicFields
    }
  }
  ${TopicFields}
`;

export const TOPIC_DELETE = gql`
  mutation deleteTopic($_id: ObjectID!) {
    deleteTopic(_id: $_id) {
      ...TopicFields
    }
  }
  ${TopicFields}
`;

export const FEATURE_NEW = gql`
  mutation newFeature($feature: FeatureInput!) {
    newFeature(feature: $feature) {
      ...FeatureFields
    }
  }
  ${FeatureFields}
`;

export const FEATURE_UPDATE = gql`
  mutation updateFeature($_id: ObjectID!, $feature: FeatureInput) {
    updateFeature(_id: $_id, feature: $feature) {
      ...FeatureFields
    }
  }
  ${FeatureFields}
`;

export const FEATURE_DELETE = gql`
  mutation deleteFeature($_id: ObjectID!) {
    deleteFeature(_id: $_id) {
      ...FeatureFields
    }
  }
  ${FeatureFields}
`;
