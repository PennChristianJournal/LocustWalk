import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import { renderRoutes } from 'react-router-config';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { Helmet } from 'react-helmet';
import { schema } from '~/graphql';
import * as graphql from 'graphql';

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [
          {
            kind: 'UNION',
            name: 'FeatureItem',
            possibleTypes: [
              { name: 'Topic' },
              { name: 'Article' },
            ],
          },
        ],
      },
    },
  }),
});

export default function PageRouter(routes, base) {
  return function(req, res) {
    const client = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({ schema, context: req }),
      cache,
    });

    const context = {};
    const page = (
      <ApolloProvider client={client}>
        <StaticRouter location={`${base|| ''}${req.url}`} context={context}>
          <div id="root">{ renderRoutes(routes) }</div>
        </StaticRouter>
      </ApolloProvider>
    );

    getDataFromTree(page).then(() => {
      const initialState = {
        apollo: client.extract(),
      };

      const pageContent = renderToStaticMarkup(page);
      const helmet = Helmet.renderStatic();

      if (context.status === 404) {
        res.status(404);
      }
      if (context.status === 302) {
        return res.redirect(302, context.url);
      } else {
        res.send(`
          <!doctype html>
          <html ${helmet.htmlAttributes.toString()}>
            <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
              <script id="__STATE__">window.__STATE__ = ${JSON.stringify(initialState)};</script>
              ${pageContent}
            </body>
          </html>
        `);
      }
    });
  }
}
