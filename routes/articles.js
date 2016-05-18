'use strict'

var express = require('express')
var router = express.Router()
var Article = require(__root + 'models/Article')
var mongoose = require('mongoose')

module.exports = router

router.get('/:slugOrId', function(req, res) {
  if (mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
    Article.findOne({_id: req.params.slugOrId}, function(err, article) {
      if (err) console.log(err)
      if (article) {
        return res.render('article/show', {
          article: article
        })
      }
      res.status(404); res.end('Not Found')
    })
  } else {
    Article.findOne({slug: req.params.slugOrId}, function(err, article) {
      if (err) console.log(err)
      if (article) {
        return res.render('article/show', {
          article: article
        })
      }
      res.status(404); res.end('Not Found')
    })
  }
})