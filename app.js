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
var fileUpload = require('express-fileupload')

var User = require('./models/User')

var express = require('express')
var app = module.exports = express()

var config = require('./config.js')

var node_env = process.env.NODE_ENV || 'development'

mongoose.set('debug', node_env == 'development' ? true : false)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('port', process.env.PORT || 3000)

app.use(logger(node_env == 'development' ? 'dev' : 'common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({secret: config.setup.cookie_secret, saveUninitialized: true, resave: true}))
app.use(fileUpload())

app.use(sassMiddleware({
  src: __dirname + '/sass', 
  dest: __dirname + '/public',
  // outputStyle: 'compressed',
  debug: node_env == 'development',       
})); 

app.use(express.static(path.join(__dirname, '/public')))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.locals.moment = require('moment')
app.locals.truncate = function(text, length) {
  if (text.length < length) return text;
  text = text.substring(0, length)
  var idx = text.lastIndexOf(' ')
  return text.substring(0, idx) + '...'
}

global.__root = __dirname + '/';

app.use('/', require('./routes'))


app.get('/clearDB', function(req, res) {
  mongoose.connection.db.dropDatabase()
  res.end()
})

var createAdmin = function(cb) {
  User.findOne({email: config.setup.admin_email}, function(err, user) {
    if (err) throw err
    if (!user) {
      User.create({
        email: config.setup.admin_email,
        username: config.setup.admin_name,
        password: config.setup.admin_pass
      }, function(err, user) {
        if (err) throw err   
        return cb()
      })
    } else {
      return cb()
    }
  })
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locustwalk', function(err) {
  if (err) throw err

  createAdmin(function() {
    require('./email/mailer').init(function() {
      http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'))
      })
    })
  })
  
})

