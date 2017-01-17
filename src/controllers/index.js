
import { Router } from 'express'
const router = Router();
import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
const logger = createLogger();
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import Head from '../react/views/head'
import reducer from '../react/reducers/index'

import browserify from 'browserify-middleware'
import babelify from 'babelify'

import { fetchArticles } from '../react/actions/articles'

browserify.settings({
    transform: [
        function(file) { return babelify(file, {presets: ['es2015', 'react']})}
    ],
    extensions: ['.js', '.jsx'],
    grep: /\.jsx?$/
});

export function generatePage(Page, store) {
    const page = <Provider store={store}><Page /></Provider>;
    const head = <Provider store={store}><Head /></Provider>;
    return `
        <!doctype html>
        <html>
            ${renderToStaticMarkup(head)}
            <body>
                <script>window.__STATE__ = ${JSON.stringify(store.getState())};</script>
                <div id="root">${renderToString(page)}</div>
                <script src="js/bundle.js"></script>
            </body>
        </html>
    `
}

import HomePage from '../react/views/index'
router.get('/js/bundle.js', browserify(`${__dirname}/../react/views/index.js`));
router.get('/', function(req, res) {
    const store = createStore(reducer, {
        metadata: {
            title: 'Locust Walk - Penn Christian Journal',
            description: 'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.',
            image: '/img/social-share.png',
            imageWidth: 1280,
            imageHeight: 667
        }
    }, applyMiddleware(thunk, logger));

    // store.dispatch(fetchArticles('recent', 1, {
    //     sort: 'date',
    //     limit: 20,
    //     published: true
    // })).then(() => {
        res.send(generatePage(HomePage, store));
    // });
});

import api from './api'
router.use('/api', api);

export default router;