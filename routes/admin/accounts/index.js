'use strict'

var express = require('express')
var router = express.Router()
var UserRequest = require('../../../models/userrequest')
var VerificationToken = require('../../../models/verificationtoken')
var User = require('../../../models/user')
var Auth = require('./auth')

module.exports = router

router.get('/login', function(req, res) {
  if (req.isAuthenticated()) res.redirect('/admin')

  res.render('admin/login', {
    error: req.flash('error')
  })
})

router.post('/login', Auth.authenticate('login', {
  successRedirect: '/admin',
  failureRedirect: '/admin/login/',
  failureFlash: true
}))

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/admin/login')
})

router.get('/register', function(req, res) {
  res.redirect('/admin/request')
})

router.get('/register/:token', function(req, res) { 
  if (req.isAuthenticated()) res.redirect('/admin')

  res.render('admin/register', {
    token: req.params.token,
    error: req.flash('error')
  })
})

router.post('/register/:token', function(req, res) {

  var auth = Auth.authenticate('register', {
    successRedirect: '/admin',
    failureRedirect: '/admin/register/' + req.params.token,
    failureFlash: true
  })

  VerificationToken.verify(req.params.token, req.body.email, function(err, match) {
    if (err) throw err
    if (match) {
      return auth(req, res)
    } else {
      req.flash('error', 'Email does not match request link')
    }
    return res.render('admin/register', {
      token: req.params.token,
      error: req.flash('error')
    })
  })
})

router.get('/request', function(req, res) {
  if (req.isAuthenticated()) res.redirect('/admin')

  res.render('admin/request', {
    error: req.flash('error')
  })
})

router.post('/request', function(req, res) {
  if (!validateEmail(req.body.email)) {
    req.flash('error', 'Invalid email')
    res.render('admin/request', {
      error: req.flash('error'),
      requested: false
    })
  } else {
    UserRequest.createOrUpdate(req.body.email, function(err, request) {
      if (err) throw err

      return res.render('admin/request', {
        error: req.flash('error'),
        requested: true
      })
    })
  }
})

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}