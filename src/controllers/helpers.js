import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
const logger = createLogger();
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import path from 'path'
import browserify from 'browserify-middleware'
import babelify from 'babelify'

browserify.settings({
    transform: [
        function(file) { return babelify(file, {presets: ['es2015', 'react']})}
    ],
    extensions: ['.js', '.jsx'],
    grep: /\.jsx?$/
});

import Head from '../react/views/head'
import reducer from '../react/reducers/index'

export function generatePage(Page, store, clientScript) {
    const page = <Provider store={store}><Page /></Provider>;
    const head = <Provider store={store}><Head metadata={Page.metadata}/></Provider>;
    return `
        <!doctype html>
        <html>
            ${renderToStaticMarkup(head)}
            <body>
                <script>window.__STATE__ = ${JSON.stringify(store.getState())};</script>
                <div id="root">${renderToString(page)}</div>
                <script>
                (function() {
                    if (window.location.pathname.endsWith('/') === false) {
                        var re = new RegExp("\/?(#|$)");
                        var url = window.location.href.replace(re, '/$1');
                        window.history.replaceState(null, document.title, url);
                    }
                })();
                </script>
                <script src="js/bundle.js"></script>
            </body>
        </html>
    `
}

export function definePageRoute(router, route, page, clientScript, callback) {
    const script = browserify(clientScript);
    router.get(path.join(route, 'js/bundle.js'), script);
    router.get(route, function(req, res) {
        const store = createStore(reducer, applyMiddleware(thunk));
        callback(req, res, store, function() {
            res.send(generatePage(page, store));
        })
    });
}