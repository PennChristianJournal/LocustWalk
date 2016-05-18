'use strict'

var express = require('express')
var router = express.Router()
var User = require(__root + 'models/User')

module.exports = router;

router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    if (err) console.log(err)
    res.render('admin/users/index', {
      users: users
    })
  })
})

router.post('/delete', function(req, res) {
  User.remove({_id: req.body._id}, function(err) {
    req.flash('error', err)
    res.redirect('/admin/users')
  })
})

router.get('/new', function(req, res) {
  res.render('admin/users/new', {
    error: req.flash('error')
  })
})

router.post('/new', function(req, res) {
  if (!req.body.email) { req.flash('error', 'Email is required'); return res.redirect('new'); }
  if (!req.body.username) { req.flash('error', 'Username is required'); return res.redirect('new'); }
  if (!validateEmail(req.body.email)) { req.flash('error', 'Email is invalid'); return res.redirect('new'); }
  if (!req.body.password) { req.flash('error', 'Password is required'); return res.redirect('new'); }
  if (req.body.password != req.body.password_confirm) { req.flash('error', 'Passwords don\'t match'); return res.redirect('new'); }
  
  User.findOne({$or: [
    {email: req.body.email},
    {username: req.body.username}
  ]}).exec(function(err, user) {
    if (err) req.flash('error', err)
    if (user) {
      req.flash('error', 'User already exists')
      return res.redirect('new')
    } else {
      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })

      newUser.save(function(err) {
        if (err) req.flash('error', err)
        res.redirect('./')
      })
    }    
  })
})

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}