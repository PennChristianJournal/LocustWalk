
import { Router } from 'express';
const router = new Router();

import File from '../models/file';
import SmallFile from '../models/smallFile';
import mkdirp from 'mkdirp';
import fs from 'fs';

const fileRoot = `${__dirname}/../../../public/files`;
router.get('/:id', function(req, res, next) {

  SmallFile.findOne({
    _id: req.params.id
  }, function(err, file) {
    if (err) return next(err);
    if (file) {
      File.remove({_id: req.params.id}, (err) => {});
      res.contentType(file.contentType);
      res.send(file.data);
    } else {
      var assetPath = `${fileRoot}/${req.params.id}`;
      fs.exists(assetPath, (exists) => {
        if (exists) {
          next();
        } else {
          File.findOne({_id: req.params.id}, function(err, file, stream) {
            if (err) {
              console.log(err);
            }
            if (file) {

              // incrementally remove GridFS
              let data = new Buffer('');
              stream.on('data', function(chunk) {
                data = Buffer.concat([data, chunk]);
              });

              stream.on('end', function() {
                SmallFile.create({
                  _id: file._id,
                  data,
                  contentType: file.contentType,
                });
              });
              res.writeHead(200, {'Content-Type': file.contentType });
              stream.pipe(res);
            } else {
              res.status(404);
              res.type('txt').send('Not found');
            }
          });
        }
      });
    }
  });
});

export default router;