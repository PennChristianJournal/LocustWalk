'use strict'

var express = require('express')
var router = express.Router()
module.exports = router

var node_env = process.env.NODE_ENV || 'development'

// publish asset to the server
router.post('/publish', (req, res, next) => {

})

// push the asset to the server but restrict to admin viewing
router.post('/stage', (req, res, next) => {

})

// fetch the document contents 
router.post('/preview', (req, res, next) => {

})