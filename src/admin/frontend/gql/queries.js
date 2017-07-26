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
      is_featured
      cover
      thumb
      parent
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
