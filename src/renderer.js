'use strict';

import nconf from 'nconf';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { htmlPreview } from '~/common/frontend/helpers/format';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
const logger = nconf.get('NODE_ENV') === 'development' ? createLogger({
  actionTransformer: function(action) {
    if (action.articles) {
      return Object.assign({}, action, {
        articles: action.articles.map(article => {
          return Object.assign({}, article, {
            content: htmlPreview(article.content, 100),
          });
        }),
      });
    } else {
      return action;
    }
  },
}) : undefined;
const middlewares = [thunk, logger].filter(v => v);

import Head from '~/common/frontend/components/head';
import rootReducer from '~/common/frontend/reducers';

import { fetchArticles, invalidateArticles } from '~/common/frontend/actions/articles';
import Article from '~/common/models/article';

export function makeStore(state) {
  return createStore(rootReducer, applyMiddleware(...middlewares), state);
}

function render(req, res, view) {
  const Component = require(view.file).default;
  const store = req.store || makeStore();
  
  const loaded = req._preloadArticles ? 
    Promise.all(Object.keys(req._preloadArticles).map(name => {
      const query = (Component.articleQueries || {})[name] || {};
      const {limit, overrides, partial} = req._preloadArticles[name];
      const newQuery = Object.assign(query, { limit }, overrides || {});

      let promise = store.dispatch(fetchArticles(name, 0, newQuery, Article.queryPaginatedPromise.bind(Article)));
      if (partial) {
        // the client will need to refetch partial queries
        promise.then(() => {
          store.dispatch(invalidateArticles(name, 0));
        });
      }
      return promise;
    })) 
    : Promise.resolve();
    
  loaded.then(() => {
    const page = <Provider store={store}><Component /></Provider>;
    const head = <Provider store={store}><Head metadata={Component.metadata}/></Provider>;

    res.send(`
      <!doctype html>
      <html>
        ${renderToStaticMarkup(head)}
        <body>
          <script id="__STATE__">window.__STATE__ = ${JSON.stringify(store.getState())};</script>
          <div id="root">${renderToString(page)}</div>
          <script type="text/javascript" src="/js/manifest.js"></script>
          <script type="text/javascript" src="/js/react.js"></script>
          <script type="text/javascript" src="/js/${view.group}.js"></script>
          <script type="text/javascript" src="/js/${view.target}.js"></script>
        </body>
      </html>
    `);
  });
}

function preloadArticles(req, name, limit, overrides, partial = true) {
  req._preloadArticles = req._preloadArticles || {};
  req._preloadArticles[name] = {
    limit,
    overrides,
    partial,
  };
}

export default {
  render,
  preloadArticles,
};