
import React from 'react';
import TopicMain from '~/common/frontend/components/topic-main';
import ArticleLayout from '~/common/frontend/templates/article-layout';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { headData } from '~/common/frontend/head';

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
    options({idOrSlug, _id, slug}) {
      idOrSlug = idOrSlug || (typeof window !== 'undefined' && (segments => segments[segments.length - 1])(window.location.pathname.split('/')));
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
  headData((head, {topic}) => {
    if (topic) {
      head.setTitle(topic.title);
      head.setMetadata('description', topic.metaDescription);
    }
  })
)( ({topic}) => {
  return (
    <ArticleLayout>
      <TopicMain topic={topic} />
    </ArticleLayout>
  );
});

export default TopicPage;
