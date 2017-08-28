'use strict';
import {gql} from 'react-apollo';

export const ARTICLE_UPDATE = gql`
  mutation updateArticle($_id: ObjectID!, $article: ArticleInput) {
    updateArticle(_id: $_id, article: $article) {
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

export const ARTICLE_DELETE = gql`
  mutation deleteArticle($_id: ObjectID!) {
    deleteArticle(_id: $_id) {
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

export const TOPIC_NEW = gql`
  mutation newTopic($topic: TopicInput!) {
    newTopic(topic: $topic) {
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

export const TOPIC_UPDATE = gql`
  mutation updateTopic($_id: ObjectID!, $topic: TopicInput) {
    updateTopic(_id: $_id, topic: $topic) {
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

export const TOPIC_DELETE = gql`
  mutation deleteTopic($_id: ObjectID!) {
    deleteTopic(_id: $_id) {
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

export const FEATURE_NEW = gql`
  mutation newFeature($feature: FeatureInput!) {
    newFeature(feature: $feature) {
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

export const FEATURE_UPDATE = gql`
  mutation updateFeature($_id: ObjectID!, $feature: FeatureInput) {
    updateFeature(_id: $_id, feature: $feature) {
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

export const FEATURE_DELETE = gql`
  mutation deleteFeature($_id: ObjectID!) {
    deleteFeature(_id: $_id) {
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
