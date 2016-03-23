'use strict'

var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/', function(req, res) {
  res.send('Hello World!');
})

router.use('/admin', require('./admin'))