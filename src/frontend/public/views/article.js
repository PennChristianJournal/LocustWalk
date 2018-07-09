
import React from 'react';
import ArticleMain from '../components/article-main';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';

const ARTICLE_QUERY = gql`
  query Article($idOrSlug: String, $_id: ObjectID, $slug: String) {
    article(idOrSlug: $idOrSlug, _id: $_id, slug: $slug) {
      _id
      title
      date
      cover
      author
      content
      metaDescription: preview(length: 160)
      parent {
        _id
        title
        slug
      }
      topic {
        _id
        title
        slug
      }
    }
  }
`;

const ArticlePage = graphql(ARTICLE_QUERY, {
  options({_id, slug, match: { params: { idOrSlug } } }) {
    return {
      variables: {
        idOrSlug,
        _id,
        slug,
      },
    };
  },
  props({ data: {article}} ) {
    return {
      article,
    };
  },
})(({article}) => article ? <ArticleMain article={article} /> : null);

export default ArticlePage;
