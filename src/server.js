
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import logger from 'morgan';
import path from 'path';
import mongoose from 'mongoose';
import http from 'http';
import redis from 'redis';
import connectRedis from 'connect-redis';
import nconf from 'nconf';

const RedisStore = connectRedis(session);

const server = express();
server.set('port', nconf.get('PORT'));

const NODE_ENV = nconf.get('NODE_ENV');

if (NODE_ENV !== 'production') {
  var compiler = require('webpack')(require('../webpack.config.js'));
  server.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    stats: {
      colors: true,
    },
  }));
  //server.use(require('webpack-hot-middleware')(compiler));
}

server.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

const redisStore = new RedisStore({
  client: redis.createClient(nconf.get('REDIS_URL')),
});

server.use(session({
  secret: nconf.get('cookie_secret'),
  saveUninitialized: true,
  resave: true,
  store: redisStore.domain ? redisStore : undefined,
}));

import sassMiddleware from 'node-sass-middleware';
server.use(sassMiddleware({
  src: path.join(__dirname, ''),
  dest: path.join(__dirname, '../public'),
  outputStyle: 'compressed',
}), express.static(path.join(__dirname, '../public/css')));
server.use(express.static(`${__dirname}/../public`));

server.use(passport.initialize());
server.use(passport.session());

import rootController from './controllers/index';
server.use('/', rootController);

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

export default server;
