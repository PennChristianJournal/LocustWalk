'use strict';
import {gql} from 'react-apollo';

export const ARTICLE_NEW = gql`
  mutation newArticle($article: ArticleInput!) {
    newArticle(article: $article) {
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
    }
  }
`;
