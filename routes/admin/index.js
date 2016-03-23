'use strict'

var express = require('express')
var router = express.Router()

module.exports = router;

router.get('/', function(req, res) {
  if (!req.isAuthenticated()) {
    res.redirect('/admin/login')
  }
  res.send('Hello Admins!')
})

router.use('/', require('./accounts'))

