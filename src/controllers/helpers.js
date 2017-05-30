import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
const logger = createLogger();
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import path from 'path';
import Head from '../react/components/head';
import reducer from '../react/reducers/index';

export function generatePage(Page, store, clientScript, admin) {
  const page = <Provider store={store}><Page /></Provider>;
  const head = <Provider store={store}><Head metadata={Page.metadata}/></Provider>;

  return `
      <!doctype html>
      <html>
          ${renderToStaticMarkup(head)}
          <body>
              <script id="__STATE__">window.__STATE__ = ${JSON.stringify(store.getState())};</script>
              <div id="root">${renderToString(page)}</div>
              <script type="text/javascript" src="/js/manifest.js"></script>
              <script type="text/javascript" src="/js/react.js"></script>
              <script type="text/javascript" src="/js/${admin ? 'admin' : 'client'}.js"></script>
              <script type="text/javascript" src="/${clientScript}"></script>
          </body>
      </html>
  `;
}

function createPageRoute(router, route, page, clientScript, admin, callback) {
  var scriptPath = path.relative(path.join(__dirname, '../react'), clientScript);
  router.get(route, function(req, res) {
    const store = createStore(reducer, applyMiddleware(thunk));
    callback(req, res, store, function() {
      res.send(generatePage(page, store, scriptPath, admin));
    });
  });
}

export function definePageRoute(router, route, page, clientScript, callback) {
  createPageRoute(router, route, page, clientScript, false, callback);
}

export function defineAdminPageRoute(router, route, page, clientScript, callback) {
  createPageRoute(router, route, page, clientScript, true, callback);
}
