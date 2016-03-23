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

var User = require('./models/user')
var UserRequest = require('./models/userrequest')
var VerificationToken = require('./models/verificationtoken')

var express = require('express')
var app = module.exports = express()

var config = require('./config.js')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', process.env.PORT || 3000)

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({secret: config.cookie_secret, saveUninitialized: true, resave: true}))

app.use(express.static(path.join(__dirname, '/public')))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/', require('./routes'))

app.get('/clearDB', function(req, res) {
  mongoose.connection.db.dropDatabase()
})

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/locustwalk', function(err) {
  if (err) throw err

  require('./email/mailer').init(function() {
    User.findOne({email: config.admin_email}, function(err, user) {
      if (err) throw err
      if (!user) {
        UserRequest.createOrUpdate(config.admin_email, function(err, request) {
          request.grant(function(err) {
            if (err) throw err
          })
        })
      }
    })  
  })

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'))
  })
})

