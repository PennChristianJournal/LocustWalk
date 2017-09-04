'use strict';

import React from 'react';
import { render } from 'react-dom';
import nconf from 'nconf';
import urljoin from 'url-join';
import { print as printGraphQL } from 'graphql/language/printer';
import objectPath from 'object-path';

import {
  ApolloClient,
  ApolloProvider,
  IntrospectionFragmentMatcher,
} from 'react-apollo';
export function mount(Page) {
  if (typeof document !== 'undefined') {

    const networkInterface = {
      query(request) {
        const formData  = new FormData();

        // search for File objects on the request and set it as formData
        (function visit(node, path) {
          if (node instanceof File) {
            const id = Math.random().toString(36);
            formData.append(id, node);
            objectPath.set(request.variables, path.join('.'), id);
          } else if (typeof node === 'object') {
            Object.keys(node).forEach(key => {
              visit(node[key], path.concat(key));
            });
          }
        })(request.variables, []);

        formData.append('query', printGraphQL(request.query));
        formData.append('variables', JSON.stringify(request.variables || {}));
        formData.append('debugName', request.debugName || '');
        formData.append('operationName', request.operationName || '');

        return fetch(urljoin(nconf.get('SERVER_ROOT'), 'graphql'), {
          credentials: 'same-origin',
          body: formData,
          method: 'POST',
        }).then(result => result.json());
      },
    };

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

