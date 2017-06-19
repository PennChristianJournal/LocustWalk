'use strict';

import path from 'path';
import nconf from 'nconf';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import http from 'http';

nconf.argv().env().file({file: path.join(__dirname, '../config.json')});

nconf.defaults({
  PORT: 3000,
  REDIS_URL: 'redis://127.0.0.1:6379',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/locustwalk',
});

process.on('unhandledRejection', r => console.log(r));

const NODE_ENV = nconf.get('NODE_ENV');

const server = express();

server.set('port', nconf.get('PORT'));

server.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'));

if (NODE_ENV !== 'production') {
  var compiler = require('webpack')(require('./webpack.config.js'));
  server.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    noInfo: true,
  }));
  //server.use(require('webpack-hot-middleware')(compiler));
}

import sassMiddleware from 'node-sass-middleware';
server.use(sassMiddleware({
  src: path.join(__dirname, ''),
  dest: path.join(__dirname, '../public'),
  outputStyle: 'compressed',
}), express.static(path.join(__dirname, '../public/css')));
server.use(express.static(`${__dirname}/../public`));

server.use('/admin', require('./admin/server'));
server.use('/', require('./common/server'));

mongoose.set('debug', NODE_ENV === 'development');
mongoose.Promise = global.Promise;
mongoose.connect(nconf.get('MONGODB_URI'), function(err) {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
  http.createServer(server).listen(server.get('port'), function() {
    console.log(`Express server listening on port ${server.get('port')}`);
  });
});
