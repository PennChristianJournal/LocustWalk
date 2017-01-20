
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
    const store = createStore(reducer, applyMiddleware(thunk));

    store.dispatch(fetchArticles('featured', 1, {
        sort: 'date',
        limit: 12,
        published: true,
        featured: true
    })).then(() => {
        res.send(generatePage(HomePage, store));
    });
});

import api from './api'
router.use('/api', api);


import File from '../models/file'
import mkdirp from 'mkdirp'
import fs from 'fs'
router.get('/files/:id', function(req, res, next) {
  var assetPath = `${__dirname}/../../public/files/${req.params.id}`
  fs.exists(assetPath, (exists) => {
    if (exists) {
      return next()
    } else {
      File.findOne({_id: req.params.id}, function(err, file, stream) {
        if (err) console.log(err)
        if (file) {
          process.nextTick(function() {
            mkdirp(`${__dirname}/../../public/files`, function(err) {
              if (err) console.log(err)
              var wstream = fs.createWriteStream(assetPath)
              stream.pipe(wstream)
            })
          })
          res.writeHead(200, {'Content-Type': file.contentType })
          stream.pipe(res)
        } else {
          res.status(404)
          res.type('txt').send('Not found')
        }
      })
    }
  })
})

export default router;