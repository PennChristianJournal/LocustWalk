'use strict';

import express from 'express';

const server = express();


// import RootController from './controllers';
// server.use('/', RootController);
server.get('*', function(req, res) {

});

module.exports = server;
