'use strict'

var express = require('express');
var router = express.Router();
var Files = require(__root + 'models/Files')
var Article = require(__root + 'models/Article')
var async = require('async')
var fs = require('fs')
var mkdirp = require('mkdirp')

module.exports = router;

router.use('/admin', require('./admin'))
router.use('/articles', require('./articles'))
router.use('/api', require('./api'))

/*
router.get('/files/:id', function(req, res, next) {
  var assetPath = __root + 'public/files/' + req.params.id
  fs.exists(assetPath, (exists) => {
    if (exists) {
      return next()
    } else {
      Files.findOne({_id: req.params.id}, function(err, file, stream) {
        if (err) console.log(err)
        if (file) {
          process.nextTick(function() {
            mkdirp(__root + 'public/files', function(err) {
              if (err) console.log(err)
              var wstream = fs.createWriteStream(assetPath)
              stream.pipe(wstream)
            })
          })
          res.writeHead(200, {'Content-Type': file.contentType })
          stream.pipe(res)
        } else {
          res.status(404)
          res.type('txt').send('Not found')
        }
      })
    }
  })
})
*/

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
              fs = []
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
        fs = []
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
      features: results[0],
      recents: results[1]
    })  
  })
})

router.get('/:page', function(req, res, next) {
  fs.exists(__root + 'views/' + req.params.page + '.pug', (exists) => {
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