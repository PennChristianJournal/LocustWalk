'use strict'

var express = require('express')
var router = express.Router()
var Article = require(__root + 'models/Article')
module.exports = router

require('./accounts')(router)

router.use('/', function (req, res, next) {
  if (false && !req.isAuthenticated()) {
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
})

router.use('/articles', require('./articles'))
router.use('/users', require('./users'))