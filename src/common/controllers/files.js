
import { Router } from 'express';
const router = new Router();

import File from '../models/file';
import SmallFile from '../models/smallFile';
import mongoose from 'mongoose';

router.get('/:id', function(req, res, next) {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }

  SmallFile.findOne({
    _id: req.params.id,
  }, function(err, file) {
    if (err) {
      return next(err);
    }
    if (file) {
      // If a file is stored with the old schema, remove it
      File.remove({_id: req.params.id}, (err) => {});

      res.contentType(file.contentType);
      return res.send(file.data);
    } else {

      return File.findOne({_id: req.params.id}, function(err, file, stream) {
        if (err) {
          return next(err);
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
          return stream.pipe(res);
        } else {
          res.status(404);
          return res.type('txt').send('Not found');
        }
      });

    }

  });
});

export default router;
