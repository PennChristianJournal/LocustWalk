'use strict';

import path from 'path';
import nconf from 'nconf';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import Promise from 'bluebird';

nconf.argv().env().file({file: path.join(__dirname, '../config.json')});
nconf.set('APP_ENV', 'server');
nconf.defaults({
  PORT: 3000,
  REDIS_URL: 'redis://127.0.0.1:6379',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/locustwalk',
});

process.on('unhandledRejection', r => console.error(r));

const NODE_ENV = nconf.get('NODE_ENV');

const app = express();

app.set('port', nconf.get('PORT'));

app.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'));

if (NODE_ENV !== 'production') {
  var compiler = require('webpack')(require('./webpack.config.js'));
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    noInfo: true,
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

import sassMiddleware from 'node-sass-middleware';
app.use(sassMiddleware({
  src: path.join(__dirname, ''),
  dest: path.join(__dirname, '../public'),
  outputStyle: 'compressed',
}), express.static(path.join(__dirname, '../public/css')));
app.use(express.static(`${__dirname}/../public`));

app.use('/', require('./server').default);

function truncateObject(obj) {
  if (obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop] && obj[prop].length && obj[prop].length > 100) {
          if (Array.isArray(obj[prop])) {
            obj[prop].length = 100;
          } else {
            obj[prop] = obj[prop].substr(0, 100);
          }
        }
      }
    }
  }
}

// mongoose.set('debug', function(collection, method, query, doc, options) {
  // if (NODE_ENV === 'development') {
  //   truncateObject(query);
  //   truncateObject(doc);
  //   truncateObject(options);

  //   console.dir([collection, method, query, doc, options], {colors: true, depth: 4});
  // }
// });
mongoose.Promise = Promise;
mongoose.connect(nconf.get('MONGODB_URI'), { useMongoClient: true }, function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
  http.createServer(app).listen(app.get('port'), function() {
    console.log(`Express server listening on port ${app.get('port')}`);
  });

  if (nconf.get('MONGODB_URI') === 'mongodb://localhost:27017/locustwalk_test') {
    require('./seedDB');
  }
});
