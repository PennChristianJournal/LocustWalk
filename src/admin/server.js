'use strict';

import express from 'express';
import nconf from 'nconf';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const server = express();

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

import RootController from './controllers';
server.use('/', RootController);

module.exports = server;
