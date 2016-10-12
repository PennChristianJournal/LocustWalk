'use strict'

var express = require('express')
var router = express.Router()
var Article = require(__root + 'models/Article')
var passport = require('./auth')
module.exports = router

//require('./accounts')(router)

var node_env = process.env.NODE_ENV || 'development'

router.get('/login', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.email']
}))

router.get('/login/callback', passport.authenticate('google', {
  successRedirect: '/admin/login/success',
  failureRedirect: '/'
}))

router.get('/login/success', function(req, res) {
  res.redirect(req.session.lastUrl || '/')
})

router.use('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.lastUrl = req.originalUrl;
    return res.redirect('/admin/login')
  } else {
    return next()
  }
})

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
})

/*router.use('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login')
  } else {
    return next()
  }
})

router.get('/', function(req, res) {
  return res.render('admin/index', {
    
  })
  Article.find({}, function(err, articles) {
    if (err) console.log(err)
    res.render('admin/articles/index', {
      articles: articles
    })
  })
})*/

router.use('/articles', require('./articles'))

router.get('/', (req, res) => {
  res.redirect('/admin/articles/')
})
//router.use('/users', require('./users'))