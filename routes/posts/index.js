'use strict'

var express = require('express');
var router = express.Router();

module.exports = router;

/*router.use('/', function(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/admin/accounts/login')
})*/

router.get('/', function(req, res) {
  res.send('posts index')
})

router.get('/:id', function(req, res) {
  res.send('post' + req.params.id)
})

router.get('/:id/edit', function(req, res) {
  res.send('edit post' + req.params.id)
})

router.post('/:id/update', function(req, res) {
  res.send('update post' + req.params.id)
})

router.get('/create', function(req, res) {
  res.send('create post')
})

router.post('/create', function(req, res) {
  
})

router.post('/:id/destroy', function(req, res) {
  
})