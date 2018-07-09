import path from 'path';
import express from 'express';
import compression from 'compression';
import logger from 'morgan';
import mongoose from 'mongoose';
import http from 'http';
import Promise from 'bluebird';
import httpProxy from 'http-proxy-middleware';
import nconf from '../../config/config';

nconf.set('APP_ENV', 'server');
const NODE_ENV = nconf.get('NODE_ENV');

process.on('unhandledRejection', r => console.error(r));


const app = express();
app.use(compression());
app.use(logger(NODE_ENV === 'development' ? 'dev' : 'common'));

if (nconf.get('NODE_ENV') !== 'production') {
  app.use(httpProxy(`http://${nconf.get('ASSET_HOST')}/public`));
}

mongoose.Promise = Promise;
mongoose.set('debug', nconf.get('NODE_ENV') !== 'production');
mongoose.connect(nconf.get('MONGODB_URI'), (err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');

  const port = nconf.get('SERVER_HOST').split(':')[2] || 80;
  const server = app.listen(port, () => {
    console.log('Server listening on port', port);
  });
});
