
import React from 'react';
import ArticleGroup from '../components/article-group';
import ArticleMain from '../components/article-main';
import ArticleLayout from '../templates/article-layout';

const ArticlePage = () => 
  <ArticleLayout>
    <ArticleGroup name="main" query={ArticlePage.articleQueries.main}>
      { articles => <ArticleMain article={articles[0]} /> }
    </ArticleGroup>
  </ArticleLayout>
;

ArticlePage.articleQueries = {
  main: {
    limit: 1,
    is_published: true,
  },
};

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

import {mount} from '../helpers/page';
mount(ArticlePage);
