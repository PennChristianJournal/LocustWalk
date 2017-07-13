'use strict';

import express from 'express';

const server = express();

import RootController from './controllers';
server.use('/', RootController);

module.exports = server;
