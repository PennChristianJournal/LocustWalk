'use strict'

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('passport')
var logger = require('morgan')
var path = require('path')
var flash = require('connect-flash')
var http = require('http')
var mongoose = require('mongoose')
var sassMiddleware = require('node-sass-middleware')
var async = require('async')
var request = require('request')
var fs = require('fs')
var mkdirp = require('mkdirp')
const favicon = require('serve-favicon') 

var express = require('express')
var app = module.exports = express()

var config = require('./config.js')

var node_env = process.env.NODE_ENV || 'development'

mongoose.set('debug', node_env == 'development' ? true : false)
require('mongoose-cache').install(mongoose, {
  max:50,
  maxAge:1000*60*2
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)

app.use(logger(node_env == 'development' ? 'dev' : 'common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
var RedisStore = require('connect-redis')(session);
app.use(session({
  secret: config.setup.cookie_secret, 
  saveUninitialized: true, 
  resave: true,
  store: new RedisStore({
    client: require('redis').createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379')
  })
}))

app.use(sassMiddleware({
  src: __dirname + '/sass', 
  dest: __dirname + '/public',
  outputStyle: 'compressed',      
})); 

app.use(favicon(__dirname + '/public/img/favicon.ico'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.locals.root = config.setup.root
app.locals.moment = require('moment')
app.locals.truncate = (text, length, noelipsis) => {
  if (text.length < length) return text;
  text = text.substring(0, length)
  var idx = text.lastIndexOf(' ')
  var str = text.substring(0, idx)
  return noelipsis ? str  : str + '...'
}

let duplicate_date_map = {}
app.locals.duplicate_date = {

  handle: function(str) {
    if (duplicate_date_map[str]) {
      duplicate_date_map[str] += 1
      return str + ' #' + duplicate_date_map[str]
    } else {
      duplicate_date_map[str] = 1
      return str
    }
  },

  clear: function() {
    duplicate_date_map = {}
    return ''
  }
}

app.locals.dup_date = function() {
  let map = {}

  let first_count = 0
  let should_count = true
  let self = this

  this.first_count = function() {
    return first_count
  }

  this.handle = function(str) {
    if (map[str]) {
      if (should_count) {
        first_count += 1        
      }

      map[str] += 1
      return str + ' #' + map[str]
    } else {
      if (first_count != 0) {
        should_count = false
      } else {
        first_count = 1
      }
      map[str] = 1
      return str 
    }
  }
}

app.locals.preview_text = function(text) {
  return app.locals.truncate(
    text
      .replace(/<sup><a\b[^>]*>\[\d+\]<\/a><\/sup>/ig,"")
      .replace(/(<([^>]+)>)/ig,""),
    300
  )
}

global.__root = __dirname + '/';

app.get('/clearDB', (req, res, next) => {
  if (node_env == 'development') {
    res.end()
    mongoose.connection.db.dropDatabase()
  } else {
    next()
  }
})

app.use('/', require('./routes'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locustwalk', function(err) {
  if (err) throw err
  console.log('Connected to database')
  console.log(`Making directory ${__root + 'public/files'}`)
  mkdirp(__root + 'public/files', function(err) {
    if (err) console.log(err)
    http.createServer(app).listen(app.get('port'), function(){
      console.log("Express server listening on port " + app.get('port'))
    })
  })
})

