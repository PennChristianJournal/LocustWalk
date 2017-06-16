import path from 'path';
import nconf from 'nconf';

nconf.argv().env().file({file: path.join(__dirname, '../config.json')});

nconf.defaults({
  PORT: 3000,
  REDIS_URL: 'redis://127.0.0.1:6379',
  NODE_ENV: 'development',
  MONGODB_URI: 'mongodb://localhost:27017/locustwalk',
});

process.on('unhandledRejection', r => console.log(r));

require('./server');
