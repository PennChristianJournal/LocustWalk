'use strict'

var express = require('express')
var router = express.Router()
var fs = require('fs')
var uuid = require('node-uuid')
var Article = require(__root + 'models/Article')
var Files = require(__root + 'models/Files')
var async = require('async')
var moment = require('moment')

module.exports = router;

router.get('/', function(req, res) {
  Article.find()
  .sort({
    date: -1,
    updatedAt: -1
  })
  .exec(function(err, articles) {
    if (err) console.log(err)
    res.render('admin/articles/index', {
      articles: articles
    })
  })
})

router.get('/new', function(req, res) {
  var new_article = new Article()
  var defaultValidate = new_article.validate
  // new_article.validate = (next) => { return next() }
  new_article.save({validateBeforeSave: false}, (err, article) => {
    if (err) console.log(err)
    // article.validate = defaultValidate
    res.redirect('/admin/articles/' + article._id + '/edit')
  }) 
})

router.post('/delete', function(req, res) {
  Article.remove({_id: req.body._id}, function(err) {
    req.flash('error', err)
    res.redirect('/admin/articles')
  })
})

router.post('/publish', function(req, res) {
  Article.update({_id: req.body._id}, {
    is_published: true,
    date: Date.now(),
  }, function(err) {
    if (err) req.flash('error', err)
    res.redirect('/admin/articles')
  })
})

router.get('/:id/edit', function(req, res) {
  Article.findOne({_id: req.params.id}, function(err, article) {
    if (err) {
      res.status(500)
      return res.send(err.toString())
    }

    var funcs = []
    for (var i = 0; i < article.pending_attachments.length; i++) {
      funcs.push(function(id, cb) {
        Files.remove({_id: id}, function(err) {
          return cb(err, null)
        })
      }.bind(undefined, article.pending_attachments[i]))
    }
    funcs.push(function(cb) {
      Article.update({_id: article._id}, {
        pending_attachments: []
      }, {
        safe: true
      }, function(err) {
        return cb(err, null)
      })
    })

    async.parallel(funcs, function(err, results) {
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
            parent: req.params.id,
            is_published: true
          }, (err, responses) => {
            return cb(err, responses)
          })
        }
      ], (err, results) => {
        res.render('admin/articles/article-form', {
          error: err,
          article: article,
          parent: results[0],
          responses: results[1]
        })
      })
    })
  })
})

router.post('/:id/imageupload', function(req, res) {
  if (req.files && req.files['files[]']) {
    var file = req.files['files[]'];

    Files.fromUpload(file, function(err, upload) {
      if (err) {
        console.log(err)
      } else {
        Article.findByIdAndUpdate(req.params.id, {
          $push: {
            'pending_attachments': upload._id
          },
        }, 
        {
          safe: true,
          new: true
        },
        function(err, article) {
          if (err) console.log(err)
          res.send({
            files: [
              {
                name: upload.filename,
                url: '/files/' + upload._id
              }
            ]
          })
        })
      }
    })

  } else {
    res.send({
      files: [
        {
          url: ''
        }
      ]
    })
  }
})

router.post('/:id/imagedelete', function(req, res) {
  var file = req.body.file
  var imgid = file.split('/').slice(-1)[0]
  
  async.parallel([
    function(cb) {
      Files.remove({_id: imgid}, function(err) {
        return cb(err)
      })
    },
    function(cb) {
      Article.update({_id: req.params.id}, {
        $pull: {
          'pending_attachments': imgid
        }  
      }, {
        new: true,
        safe: true
      }, function(err) {
        return cb(err)
      })  
    }
  ], function(err, results) {
    if (err) {
      console.log(err)
      res.status(500)
      return res.send(err.toString())
    } else {
      res.end()
    }
  })
})

router.post('/:id/edit', function(req, res) {
  Article.findOne({_id: req.params.id}, function(err, article) {
    if (err) console.log(err)
    if (!article) return res.redirect('/admin/articles')
    
    article.title = req.body.title
    article.content = req.body.content
    article.slug = req.body.slug
    article.author = req.body.author
    article.is_featured = req.body.is_featured ? true : false
    article.is_published = req.body.is_published ? true : false
    article.pending_attachments = []
    article.parent = req.body.parent ? req.body.parent : null
    article.heading_override = req.body.heading_override ? req.body.heading_override : ''
    if (!article.is_published) {
      article.date = null
    } else if (!article.date) {
      article.date = Date.now()
    }
    if (req.body.date) {
      var d = Date.parse(req.body.date)
      if (d) {
        article.date = d
      }
    }

    var params = {}
    var addOrReplaceUpload = function(key, file, done) {
      async.parallel([
        function(cb) {
          if (article[key]) {
            Files.remove({_id: article[key]}, function(err) {
              return cb(err, null)
            })
          } else {
            return cb(null, null)
          }
        },
        function(cb) {
          Files.fromUpload(file, function(err, upload) {
            params[key] = upload._id
            return cb(err, null)
          })
        }
      ], function(err, results) {
        for (var key in params) {
          article[key] = params[key]
        }
        return done(err, results)
      })
    }

    var funcs = []
    for (var key in req.files) {
      var file = req.files[key]
      if (file.data.length > 0) {
        var func = addOrReplaceUpload.bind(undefined, key, file)
        funcs.push(func)
      }
    }

    async.parallel(funcs, function(err, results) {
      if (err) console.log(err)
      article.save(function(err) {
        if (err) {
          console.log(err)
          req.flash('error', err.toString())
          return res.redirect('/admin/articles/' + req.params.id + '/edit')
        }
        return res.redirect('/admin/articles');
      })
    })
  })

})

router.get('/search/docs', function(req, res) {
   Article.searchDrive(req.query.name, 'application/vnd.google-apps.document', function(err, files) {
    return res.send(files)
  })
})

router.post('/:id/sync', function(req, res) {
  Article.findOne({_id: req.params.id}, function(err, article) {
    if (err) req.flash('error', err.toString())
    
    article.populate(req.body.doc_id, function(err) {
      if (err) req.flash('error', err.toString())

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
            parent: req.params.id,
            is_published: true
          }, (err, responses) => {
            return cb(err, responses)
          })
        }
      ], (err, results) => {
        if (err) req.flash('error', err.toString())
        res.render('admin/articles/article-form', {
          error: req.flash('error'),
          article: article,
          parent: results[0],
          responses: results[1]
        })
      })
    })
  })
})