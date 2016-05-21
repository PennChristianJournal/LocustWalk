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
var async = require('async')
var request = require('request')
var fs = require('fs')
var mkdirp = require('mkdirp')

var User = require('./models/User')
var Files = require('./models/Files')

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

app.locals.root = config.setup.root
app.locals.moment = require('moment')
app.locals.truncate = (text, length, noelipsis) => {
  if (text.length < length) return text;
  text = text.substring(0, length)
  var idx = text.lastIndexOf(' ')
  var str = text.substring(0, idx)
  return noelipsis ? str  : str + '...'
}

global.__root = __dirname + '/';

app.get('/seedDB', (req, res, next) => {
  if (node_env == 'development') {
    res.end()
    mongoose.connection.db.dropDatabase()

    fakery.generator('article_content', num_para => {
      var str = ''
      for (var i = 0; i < num_para; i++) {
        str += '<p>' + fakery.g.lorem(parseInt(Math.random()*4 + 2))() + '</p>'
      }
      return str
    })

    fakery.generator('article_title', len => {
      var words = []
      for (var i = 0; i < len; i++) {
        words.push(fakery.g.alphanum(5, 12)())
      }
      return words.join(' ')
    })

    var randomImg = function(w, h, cb) {
      var name = fakery.g.alphanum(5, 12)()
      
      var fname = `http://lorempixel.com/${w}/${h}/`
      var tmpfile = __root + `tmp/${name}.png`
      var wstream = Files.makeWriteStream({
        name: name +'.jpg',
        mimetype: 'image/jpeg'
      }, (err, upload) => {
        cb(err, upload)
      })
      request(fname).pipe(wstream)
    }

    fakery.fake('article', mongoose.model('Article'), {
      author: fakery.g.fullname(),
      is_published: true,
      title: fakery.g.article_title(Math.random()*3 + 3),
      // content: 'hi'
      content: fakery.g.article_content(parseInt(Math.random()*8 + 5)),
    })

    var setImages = (article, cb) => {
      async.parallel([
        cb => {
          randomImg(1600, 900, (err, data) => {
            cb(null, data)
          })
        },
        cb => {
          randomImg(400, 300, (err, data) => {
            cb(null, data)
          })
        }
      ], (err, results) => {
        article.cover = results[0]._id
        article.thumb = results[1]._id
        article.save(err => {
          if (err) console.log(err)
          if (cb) return cb()
        })
      })
    }

    var funcs = []
    var base_date = new Date()
    for (let i = 0; i < 16; i++) {
      let date = new Date(base_date)
      date.setMonth(base_date.getMonth() - i)
      funcs.push(cb => {
        fakery.makeAndSave('article', {
          date: date,
          is_featured: true
        }, (err, article) => {
          process.nextTick(() => {
            setImages(article)
          })
          cb(err, article)
        })
      })
    }

    async.parallel(funcs, (err, results) => {
      console.log('Done creating feature articles')
      var resp_funcs = []
      for (var ri = 0; ri < 3*results.length; ri++) {
        let parentI = parseInt(Math.random()*results.length)
        let parent = results[parentI]
        let date = new Date(base_date)
        date.setMonth(base_date.getMonth() - parentI)
        date.setDate(date.getDate() + parseInt(Math.random()*30))

        resp_funcs.push(cb => {
          fakery.makeAndSave('article', {
            date: date,
            is_featured: false,
            parent: parent._id
          }, (err, article) => {
            process.nextTick(() => {
              setImages(article)
            })
            cb(err, article)
          })
        })
      }
      async.parallel(resp_funcs, (err, results) => {
        console.log('Done creating response articles')
        if (err) console.log(err)
      })
    })
  } else {
    next()
  }
})

app.use('/', require('./routes'))


/*app.get('/clearDB', function(req, res) {
  mongoose.connection.db.dropDatabase()
  res.end()
})*/

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

var fakery = require('mongoose-fakery')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/locustwalk', function(err) {
  if (err) throw err

  createAdmin(function() {
    // require('./email/mailer').init(function() {
      http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'))
      })
    // })
  })  
})

