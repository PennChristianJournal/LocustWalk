'use strict';

import express from 'express';
import nconf from 'nconf';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

const RediStore = connectRedis(session);
const redisStore = new RediStore({
  client: redis.createClient(nconf.get('REDIS_URL')),
});

server.use(session({
  secret: nconf.get('cookie_secret'),
  saveUninitialized: true,
  resave: true,
  store: redisStore.domain ? redisStore : undefined,
}));

import auth from './auth';
server.use(passport.initialize());
server.use(passport.session());

if (nconf.get('NODE_ENV') !== 'development') {
  auth(server);
}

import RootController from './controllers';
server.use('/', RootController);

module.exports = server;