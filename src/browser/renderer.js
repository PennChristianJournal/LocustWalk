'use strict';

import React from 'react';
import { render } from 'react-dom';
import nconf from 'nconf';
import urljoin from 'url-join';

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  IntrospectionFragmentMatcher,
} from 'react-apollo';
export function mount(Page) {
  if (typeof document !== 'undefined') {

    const networkInterface = createNetworkInterface({
      uri: urljoin(nconf.get('SERVER_ROOT'), 'graphql'),
      opts: {
        credentials: 'same-origin',
      },
    });

    const client = new ApolloClient({
      networkInterface,
      initialState: window.__STATE__,
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

    render(
      <ApolloProvider client={client}>
        <Page />
      </ApolloProvider>,
      document.getElementById('root'),
      function() {
        const scriptTag = document.getElementById('__STATE__');
        if (scriptTag) {
          scriptTag.parentElement.removeChild(scriptTag);
        }
        delete window.__STATE__;
      }
    );

    return function(NewPage) {
      render(<ApolloProvider client={client}><NewPage /></ApolloProvider>, document.getElementById('root'));
    };
  }
}

