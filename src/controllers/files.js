
import { Router } from 'express'
const router = new Router();

import File from '../models/file'
import mkdirp from 'mkdirp'
import fs from 'fs'

router.get('/:id', function(req, res, next) {
  var assetPath = `${__dirname}/../../public/files/${req.params.id}`
  fs.exists(assetPath, (exists) => {
    if (exists) {
      return next()
    } else {
      File.findOne({_id: req.params.id}, function(err, file, stream) {
        if (err) console.log(err)
        if (file) {
          process.nextTick(function() {
            mkdirp(`${__dirname}/../../public/files`, function(err) {
              if (err) console.log(err)
              var wstream = fs.createWriteStream(assetPath)
              stream.pipe(wstream)
            })
          })
          res.writeHead(200, {'Content-Type': file.contentType })
          stream.pipe(res)
        } else {
          res.status(404)
          res.type('txt').send('Not found')
        }
      })
    }
  })
})

export default router