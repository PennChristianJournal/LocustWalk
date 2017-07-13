'use strict';

import React from 'react';
import { 
  renderToString,
  renderToStaticMarkup,
} from 'react-dom/server';
import { 
  ApolloClient, 
  ApolloProvider,
  getDataFromTree,
} from 'react-apollo';
import { createLocalInterface } from 'apollo-local-query';
import { schema } from '~/graphql';
import * as graphql from 'graphql';

import Head from '~/common/frontend/components/head';

function render(req, res, view, props = {}) {
  const Component = require(view.file).default;
  
  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema, {
      context: req,
    }),
  });
  
  const page = <ApolloProvider client={client}><Component {...props} /></ApolloProvider>;
  const head = <ApolloProvider client={client}><Head metadata={Component.metadata}/></ApolloProvider>;
  
  getDataFromTree(page).then(() => {
    const initialState = {
      apollo: client.getInitialState(),
    };

    res.send(`
      <!doctype html>
      <html>
        ${renderToStaticMarkup(head)}
        <body>
          <script id="__STATE__">window.__STATE__ = ${JSON.stringify(initialState)};</script>
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

export default {
  render,
};
