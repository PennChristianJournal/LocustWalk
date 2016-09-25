
var express = require('express')
var router = express.Router()
var Article = require('../../models/Article')
var async = require('async')
module.exports = router;

router.get('/', (req, res) => {
  Article.find()
  .sort({
    date: -1,
    updatedAt: -1
  })
  .exec((err, articles) => {
    if (err) req.flash('error', err)
    res.render('admin/articles/index', {
      articles: articles,
      error: req.flash('error')
    })
  })
})

router.get('/new', (req, res) => {
  article = new Article()
  res.render('admin/articles/edit', {
    article: article,
  }) 
})

router.get('/search/docs', function(req, res) {
  // if (req.query.name && req.query.name.length < 5) return res.send([]);
  Article.searchDrive(req.query.name, 'application/vnd.google-apps.document', function(err, files) {
    return res.send(files)
  })
})

router.get('/search/images', function(req, res) {
  // if (req.query.name && req.query.name.length < 5) return res.send([]);
  Article.searchDrive(req.query.name, 'image/', function(err, files) {
    return res.send(files)
  })
})

router.get('/search/articles', function(req, res) {
  Article.find({
    "title": {$regex: `.*${req.query.name}.*`}
  }, function(err, articles) {
    return res.send(articles)
  })
})

router.get('/:id/edit', function(req, res) {
  Article.findOne({doc_id: req.params.id}, (err, article) => {
    if (err) req.flash('error', err.toString())
    if (article) {
      return res.redirect(`/admin/articles/${article._id}/edit`)
    } else {
      Article.findOne({_id: req.params.id}, function(err, article) {
        if (err) req.flash('error', err.toString())

        mocked = false
        if (!article) {
          mocked = true
          article = new Article({
            doc_id: req.params.id
          })
        }
        article.fill(function(err) {
          if (err) console.log(err)
          if (err) req.flash('error', err.toString())

          Article.findOne({
            _id: article.parent,
            is_published: true
          }, (err, parent) => {
            
            res.render('admin/articles/edit', {
              article: article,
              parent: parent,
              error: req.flash('error')
            }) 

          })

        })
        if (mocked) {
          delete article
        }
      })
    }
  })
})

router.post('/:id/edit', function(req, res) {

  Article.findOne({_id: req.params.id}, (err, article) => {
    if (err) {
      req.flash('error', err.toString())
    }

    mocked = false
    if (!article) {
      mocked = true
      article = new Article()
    } else {
    }

    article.title = req.body.title
    article.doc_id = req.body.doc_id
    article.cover_id = req.body.cover_id
    article.thumb_id = req.body.thumb_id
    article.slug = req.body.slug
    article.author = req.body.author
    article.is_featured = req.body.is_featured ? true : false
    article.is_published = req.body.is_published ? true : false
    article.parent = req.body.parent ? req.body.parent : null
    article.heading_override = req.body.heading_override ? req.body.heading_override : ''

    console.log('Syncing content with google drive...')
    article.driveSync((err) => {
      if (err) return callback(err)
      
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

      var funcs = []
      if (req.body.submit == 'Save') {
        funcs.push(callback => {
          article.save(function(err) {
            return callback(err)
          })
        })
      }

      funcs.push(callback => {
        article.expire()
        article.fill(err => {
          return callback(err)  
        })
      })    

      async.parallel(funcs, (err, results) => {
        if (err) {
          req.flash('error', err.toString())
        }
        if (err) req.flash('error', err.toString())

        res.redirect(req.get('referer'));
        // res.render('admin/articles/edit', {
        //   article: article,
        //   error: req.flash('error')
        // })  
      })

      if (mocked) {
        delete article
      }
  
    })
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

router.post('/unpublish', function(req, res) {
  Article.update({_id: req.body._id}, {
    is_published: false,
    date: Date.now(),
  }, function(err) {
    if (err) req.flash('error', err)
    res.redirect('/admin/articles')
  })
})

router.post('/delete', function(req, res) {
  Article.remove({_id: req.body._id}, function(err) {
    req.flash('error', err)
    res.redirect('/admin/articles')
  })
})

router.post('/refresh', function(req, res) {
  Article.findOne({_id: req.body._id}, function(err, article) {
    if (err) req.flash('error', err)
    if (article) {
      article.driveSync(err => {
        if (err) req.flash('error', err)
        article.save(err => {
          if (err) req.flash('error', err)
          return res.redirect('/admin/articles')
        })
      })
      // article.expire()
      // article.fill(function(err) {
      //   if (err) req.flash('error', err)
      //   return res.redirect('/admin/articles')  
      // });
    } else {
      return res.redirect('/admin/articles')
    }
  })
})
