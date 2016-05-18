'use strict'

var express = require('express');
var router = express.Router();
var Files = require(__root + 'models/Files')
var Article = require(__root + 'models/Article')
var async = require('async')
var fs = require('fs')

module.exports = router;

router.use('/admin', require('./admin'))
router.use('/articles', require('./articles'))

router.get('/files/:id', function(req, res) {
  Files.findOne({_id: req.params.id}, function(err, file, stream) {
    if (err) console.log(err)
    if (file) {
      res.writeHead(200, {'Content-Type': file.contentType })
      stream.pipe(res)
    } else {
      res.status(404)
      res.type('txt').send('Not found')
    }
  })
})

router.get('/', function(req, res) {
  async.parallel([
    function(cb) {
      Article
      .find({
        is_featured: true,
        is_published: true
      })
      .sort({'date': -1})
      .limit(12)
      .exec(function(err, features) {
        cb(err, features)
      })
    },
    function(cb) {
      Article
      .find({
        // is_featured: false,
        is_published: true
      })
      .sort({'date': -1})
      .limit(20)
      .exec((err, recents) => {
        cb(err, recents)
      })
    }
  ], (err, results) => {
    if (err) console.log(err)
    res.render('home', {
      features: results[0],
      recents: results[1]
    })  
  })
})

router.get('/:page', function(req, res, next) {
  fs.exists('/views/' + req.params.page + '.pug', (exists) => {
    if (exists) {
      Article
      .find({
        is_featured: true,
        is_published: true
      })
      .sort({'date': -1})
      .limit(12)
      .exec((err, features) => {
        res.render(req.params.page, {
          features: features
        })
      })
    } else {
      return next()
    }
  })
})