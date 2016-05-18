'use strict'

var express = require('express')
var router = express.Router()
var ResetToken = require('../../models/ResetToken')
var User = require('../../models/User')
var Auth = require('./auth')
var Mailer = require('../../email/mailer')

module.exports = function(router) {

  var __base = '/admin/'
  var __view = 'admin/'

  router.get('/login', function(req, res) {
    if (req.isAuthenticated()) res.redirect('/admin')

    res.render(__view + 'login', {
      error: req.flash('error')
    })
  })

  router.post('/login', Auth.authenticate('login', {
    successRedirect: '/admin',
    failureRedirect: __base + 'login',
    failureFlash: true
  }))

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect(__base + 'login')
  })

  router.get('/forgotpassword', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/admin')

    return res.render(__view + 'forgotpassword', {
      error: req.flash('error')
    })
  })

  router.get('/reset/:token', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/admin')

      return res.render(__view + 'resetpassword', {
        error: req.flash('error'),
        token: req.params.token
      })
  })

  router.post('/reset', function (req, res) {
    if (req.body.password == req.body.confirm_password) {
      ResetToken.verify(req.body.token, req.body.email, function(err, success) {
        if (err) {
          req.flash('error', err)
          res.redirect('/admin/reset/' + req.body.token)
        }
        if (success) {
          User.findOne({email: req.body.email}, function(err, user) {
            if (err) {
              req.flash('error', err)
              res.redirect('/admin/reset/' + req.body.token)
            }
            user.password = req.body.password
            user.save(function(err) {
              if (err) {
                req.flash('error', err)
                res.redirect('/admin/reset/' + req.body.token)
              }
              res.redirect('/admin/login')
            })
          })
        } else {
          req.flash('error', 'Invalid token')
          res.redirect('/admin/reset/' + req.body.token)
        }
      })
    } else {
      req.flash('error', 'Passwords do not match')
      res.redirect('/admin/reset/' + req.body.token)
    }

  })

  router.post('/forgotpassword', function (req, res) {

    if (!validateEmail(req.body.email)) {
      req.flash('error', 'Email is invalid')    
      return res.render(__view + 'forgotpassword', {
        error: req.flash('error')
      })
    }

    User.findOne({email: req.body.email}, function(err, user) {
      if (user) {
        process.nextTick(function() {
          ResetToken.createToken(req.body.email, function(err, token) {
            if (err) throw err
            var message = {
              email: token.email,
              url: 'http://' + 'localhost:3000' + '/admin/reset/' + token.token
            }
            Mailer.sendPasswordResetEmail(message, function(err) {
              if (err) throw err
            })
          })
        })
      }
      return res.render(__view + 'forgotpassword', {
        error: req.flash('error'),
        isreset: true
      })
    })
  })

  function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

}