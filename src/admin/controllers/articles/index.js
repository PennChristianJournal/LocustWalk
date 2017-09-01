'use strict';

import {Router} from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/server/renderer';
import mongoose from 'mongoose';
import formidable from 'express-formidable';
import Article from '~/common/models/article';
import fs from 'fs';
import async from 'async';
import SmallFile from '~/common/models/smallFile';
import {getFileURL} from '~/common/frontend/helpers/file';
import path from 'path';
import {getJWTClient, getGoogleDriveClient} from '~/admin/googleAPIs';
import cheerio from 'cheerio';
import mime from 'mime';
const driveClient = getJWTClient(['https://www.googleapis.com/auth/drive']);

const router = new Router();

const views = ViewEngine.getViews('admin');

router.get('/:id/edit', (req, res) => {
  Renderer.render(req, res, views['admin-articles-edit'], {
    _id: req.params.id,
  });
});

router.post('/:id/imageupload', formidable(), (req, res) => {
  const file = req.files && req.files['files[]'];
  if (file) {
    fs.readFile(file.path, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500);
        return res.send(err.toString());
      }

      SmallFile.create({
        data,
        contentType: file.type || mime.lookup(file.name),
      }, (err, smallFile) => {
        if (err) {
          smallFile.remove();
          if (err) {
            console.error(err);
            res.status(500);
            return res.send(err.toString());
          }
        }

        Article.findByIdAndUpdate(req.params.id, {
          $push: {
            attachments: smallFile._id,
          },
        }, {
          safe: true,
          new: true,
        }, (err, article) => {
          return res.send({
            files: [{ url: getFileURL(smallFile._id) }],
          });
        });
      });
    });
  } else {
    return res.end(400);
  }
});

router.post('/:id/imagedelete', formidable(), (req, res) => {
  const url = req.fields && req.fields.file;
  const id = path.basename(url);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.end();
  }

  async.parallel([
    function(cb) {
      SmallFile.findByIdAndRemove(id, cb);
    },
    function(cb) {
      Article.findByIdAndUpdate(req.params.id, {
        $pull: {
          attachments: id,
        },
      }, {
        new: true,
        safe: true,
      }, cb);
    },
  ], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500);
      return res.send(err.toString());
    } else {
      return res.end();
    }
  });
});

router.get('/docs/search', (req, res) => {
  getGoogleDriveClient(driveClient, function(err, drive) {
    if (err) {
      console.error(err);
    }

    var files = [];

    function fetchPage(pageToken, cb) {
      drive.files.list({
        q: `name contains '${req.query.name}'`,
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
        pageToken: pageToken,
      }, function(err, res) {
        if (err) {
          return cb(err);
        }

        res.files.forEach(file => files.push(file));
        if (res.nextPageToken) {
          // more results...
        }
        return cb(null);
      });
    }

    fetchPage(null, function() {
      res.send(files);
    });
  });
});

router.post('/docs/sync/:id', (req, res) => {
  getGoogleDriveClient(driveClient, function(err, drive) {
    drive.files.export({
      auth: driveClient,
      fileId: req.params.id,
      mimeType: 'text/html',
    }, (err, response) => {
      if (err) {
        return res.send(err);
      }

      var $ = cheerio.load(response);
      $('p').each(function() {
        $(this).removeAttr('style');
      });
      return res.send($('body').html());
    });
  });
});

export default router;
