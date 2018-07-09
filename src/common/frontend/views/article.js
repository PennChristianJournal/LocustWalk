
import React from 'react';
import ArticleMain from '~/common/frontend/components/article-main';
import ArticleLayout from '~/common/frontend/templates/article-layout';
import {compose, graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { headData } from '~/common/frontend/head';

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
    }
  }
`;

const ArticlePage = compose(
  graphql(ARTICLE_QUERY, {
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
    props({ data: {article}} ) {
      return {
        article,
      };
    },
  }),
  headData((head, {article}) => {
    if (article) {
      head.setTitle(article.title);
      head.setMetadata('description', article.metaDescription);
    }
  })
)( ({article}) => {
  return (
    <ArticleLayout>
      <ArticleMain article={article} />
    </ArticleLayout>
  );
});

export default ArticlePage;
