import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import reducer from '../reducers';
import nconf from 'nconf';

const middleware = nconf.get('NODE_ENV') !== 'production' ? applyMiddleware(thunk, createLogger()) : applyMiddleware(thunk);

export function mount(Page, func) {
  if (typeof document !== 'undefined') {

    const state = window.__STATE__;
    const store = createStore(reducer, state, middleware);

    render(
      <Provider store={store}>
          <Page />
      </Provider>,
      document.getElementById('root'),
      function() {
        const scriptTag = document.getElementById('__STATE__');
        if (scriptTag) {
          scriptTag.parentElement.removeChild(scriptTag);
        }
        delete window.__STATE__;
      }
    );

    if (typeof func !== 'undefined' && func !== null) {
      func();
    }

  }
}
