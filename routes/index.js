'use strict'

var express = require('express');
var router = express.Router();
var Article = require(__root + 'models/Article')
var async = require('async')

module.exports = router;

router.use('/admin', require('./admin'))
router.use('/articles', require('./articles'))
router.use('/files', require('./files'))

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
      // .cache()
      .exec(function(err, features) {
        if (err) console.log(err)
        var funcs = []
        var recent_responses = []
        for (let i = 0; i < features.length; i++) {
          funcs.push(cb => {
            Article.find({
              is_published: true,
              parent: features[i]._id
            })
            .sort({'date': -1})
            .limit(2)
            // .cache()
            .exec((err, responses) => {
              if (err) console.log(err)            
              let fs = []
              for (let i=0; i < responses.length; i++) {
                fs.push(cb => {
                  responses[i].fill(err => {
                    return cb(err)
                  })
                })
              }
              async.parallel(fs, err => {
                return cb(err, responses)
              })
            })
          })
        }

        async.parallel(funcs, (err, results) => {
          if (err) console.log(err)

          for (var j = 0; j < features.length; j++) {
            features[j].responses = results[j]  
          }
          cb(err, features)
        })
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
      // .cache()
      .exec((err, recents) => {
        // cb(err, recents)
        let fs = []
        for (let i=0; i < recents.length; i++) {
          fs.push(cb => {
            recents[i].fill(err => {
              return cb(err)
            })
          })
        }
        async.parallel(fs, err=> {
          return cb(err, recents)
        })
      })
    }
  ], (err, results) => {
    if (err) console.log(err)
    res.render('home', {
      features: results[0] || [],
      recents: results[1] || []
    })  
  })
})

router.get('/about', function(req, res) {
  Article
  .find({
    is_featured: true,
    is_published: true
  })
  .sort({'date': -1})
  .limit(12)
  .exec((err, features) => {
    res.render('about', {
      features: features || []
    })
  })
})

router.get('/staff', function(req, res) {
  Article
  .find({
    is_featured: true,
    is_published: true
  })
  .sort({'date': -1})
  .limit(12)
  .exec((err, features) => {
    res.render('staff', {
      features: features || []
    })
  })
})

router.get('/submissions', function(req, res) {
  Article
  .find({
    is_featured: true,
    is_published: true
  })
  .sort({'date': -1})
  .limit(12)
  .exec((err, features) => {
    res.render('submissions', {
      features: features || []
    })
  })
})

router.get('/subscribe', function(req, res) {
  Article
  .find({
    is_featured: true,
    is_published: true
  })
  .sort({'date': -1})
  .limit(12)
  .exec((err, features) => {
    res.render('subscribe', {
      features: features || []
    })
  })
})

router.get('/writers-guide-feature', function(req, res) {
  res.render('writers-guide-feature')
})

router.get('/writers-guide-response', function(req, res) {
  res.render('writers-guide-response')
})