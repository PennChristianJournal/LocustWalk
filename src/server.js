
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import logger from 'morgan'
import path from 'path'
import mongoose from 'mongoose'
import http from 'http'

const server = express();
server.set('port', process.env.PORT || 3000);

var NODE_ENV = process.env.NODE_ENV || 'development';

server.use(logger(NODE_ENV == 'development' ? 'dev' : 'common'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

import rootController from './controllers/index'
server.use('/', rootController);

import sassMiddleware from 'node-sass-middleware'
server.use(sassMiddleware({
  src: path.join(__dirname, ''),
  dest: path.join(__dirname, '../public/css'),
  debug: true,
  outputStyle: 'compressed',
}), express.static(path.join(__dirname, '../public/css')));

server.use(express.static(`${__dirname}/../public`));

server.use(passport.initialize());
server.use(passport.session());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locustwalk', function(err) {
    if (err) throw err;
    console.log('Connected to database');
    http.createServer(server).listen(server.get('port'), function () {
        console.log("Express server listening on port " + server.get('port'));
    });
});

export default server;