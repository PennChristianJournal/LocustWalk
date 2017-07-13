
import React from 'react';
import ArticleMain from '~/common/frontend/components/article-main';
import ArticleLayout from '~/common/frontend/templates/article-layout';
import {graphql, gql} from 'react-apollo';

const ARTICLE_QUERY = gql`
  query Article($idOrSlug: String, $_id: ObjectID, $slug: String) {
    article(idOrSlug: $idOrSlug, _id: $_id, slug: $slug) {
      _id
      title
      date
      cover
      author
      content
      parent
    }
  }
`;

const ArticlePage = graphql(ARTICLE_QUERY, {
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
})( ({article}) => {
  return (
    <ArticleLayout>
      <ArticleMain article={article} />
    </ArticleLayout>
  );
});

export default ArticlePage;


ArticlePage.metadata = Object.assign({}, ArticleLayout.metadata, {
  link: [
    {
      href: '/bower_components/medium-editor/dist/css/themes/default.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/bower_components/medium-editor-insert-plugin/dist/css/medium-editor-insert-plugin.min.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article-thumb.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
    {
      href: '/css/article-discussion.css',
      rel: 'stylesheet',
      type: 'text/css',
    },
  ],
});
