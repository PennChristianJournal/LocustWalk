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

import Head, { makeHeadContext } from '~/common/frontend/head';

function render(req, res, view, props = {}) {
  const Component = require(view.file).default;
  
  const client = new ApolloClient({
    ssrMode: true,
    networkInterface: createLocalInterface(graphql, schema, {
      context: req,
    }),
  });
  
  const HeadContext = makeHeadContext();
  const page = (
    <ApolloProvider client={client}>
      <HeadContext>
        <Component {...props} />
      </HeadContext>
    </ApolloProvider>
  );
  
  getDataFromTree(page).then(() => {
    const initialState = {
      apollo: client.getInitialState(),
    };

    const pageContent = renderToString(page);
    const head = <Head {...HeadContext.data} />;

    res.send(`
      <!doctype html>
      <html>
        ${renderToStaticMarkup(head)}
        <body>
          <script id="__STATE__">window.__STATE__ = ${JSON.stringify(initialState)};</script>
          <div id="root">${pageContent}</div>
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

