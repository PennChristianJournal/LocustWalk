import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import nconf from 'nconf';
import urljoin from 'url-join';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: createHttpLink({
    uri: urljoin(nconf.get('SERVER_HOST'), 'graphql'),
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache({
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
  }).restore(window.__STATE__),
});

function AppRouter({ routes }) {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        { renderRoutes(routes) }
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default function App(routes) {
  render(<AppRouter routes={routes} />, document.querySelector('#root'), function() {
    const scriptTag = document.getElementById('__STATE__');
    if (scriptTag) {
      scriptTag.parentElement.removeChild(scriptTag);
    }
    delete window.__STATE__;
  });
}
