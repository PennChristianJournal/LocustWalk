'use strict'

var express = require('express')
var router = express.Router()
var Article = require(__root + 'models/Article')
var mongoose = require('mongoose')
var async = require('async')

module.exports = router

router.get('/:slugOrId', function(req, res) {
  process.nextTick(function() {

  })
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

        async.parallel([
          (cb) => {
            Article.findOne({
              _id: article.parent,
              is_published: true
            }, (err, parent) => {
              return cb(err, parent)
            })
          },
          (cb) => {
            Article.find({
              parent: article._id,
              is_published: true
            }, (err, responses) => {
              return cb(err, responses)
            })
          }
        ], (err, results) => {
          if (err) console.log(err)
          return res.render('article/show', {
            article: article,
            parent: results[0],
            responses: results[1]
          })
        })
        
      } else {
        res.status(404); res.end('Not Found')
      }
    })
  }
})