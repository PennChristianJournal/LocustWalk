import { Router } from 'express';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const cache = new InMemoryCache({
  fragmentMatcher: new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [
          // {
          //   kind: 'UNION',
          //   name: 'FeatureItem',
          //   possibleTypes: [
          //     { name: 'Topic' },
          //     { name: 'Article' },
          //   ],
          // },
        ],
      },
    },
  }),
});

export default function PageRouter(routes, base) {
  const router = Router();

  router.get('*', (req, res) => {

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
      const initialState = client.extract();
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
  });
  return router;
}
