
import React from 'react';
import TopicMain from '../components/topic-main';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';

const TOPIC_QUERY = gql`
  query Topic($idOrSlug: String, $_id: ObjectID, $slug: String) {
    topic(idOrSlug: $idOrSlug, _id: $_id, slug: $slug) {
      _id
      title
      cover
      content
      metaDescription: preview(length: 160)
    }
  }
`;

const TopicPage = compose(
  graphql(TOPIC_QUERY, {
    options({_id, slug, match: { params: { idOrSlug } } }) {
      return {
        variables: {
          idOrSlug,
          _id,
          slug,
        },
      };
    },
    props({ data: {topic}} ) {
      return {
        topic,
      };
    },
  }),
)( ({topic}) => topic ? <TopicMain topic={topic} /> : null);

export default TopicPage;
