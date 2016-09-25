'use strict'

var express = require('express')
var router = express.Router()
var File = require(__root + 'models/File')
var mongoose = require('mongoose')
var async = require('async')
var fs = require('fs')
var mkdirp = require('mkdirp')

module.exports = router

router.get('/:name', function(req, res, next) {
    var assetPath = `${__root}public/files/${req.params.name}`
    fs.open(assetPath, 'r', (err, fd) => {
        if (fd) {
            return next();
        } else {
            File.findOne({
                filename: req.params.name
            }, (err, file, stream) => {
                if (err) console.log(err)
                if (stream) {
                    process.nextTick(function() {
                        mkdirp(`${__root}public/files`, function(err) {
                            if (err) console.log(err)
                            var wstream = fs.createWriteStream(assetPath)
                            stream.pipe(wstream)
                        })
                    })
                    res.writeHead(200, {'Content-Type': file.contentType })
                    stream.pipe(res)
                } else {
                    res.status(404)
                    res.type('txt').send('Not Found')
                }
            })
        }
    })
})