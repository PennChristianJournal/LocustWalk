'use strict';

import {Router} from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/renderer';
import mongoose from 'mongoose';

import formidable from 'express-formidable';
import Article from '~/common/models/article';
import {getJWTClient, getGoogleDriveClient} from '~/admin/googleAPIs';
import cheerio from 'cheerio';
const driveClient = getJWTClient(['https://www.googleapis.com/auth/drive']);

const router = new Router();

const views = ViewEngine.getViews('admin');

router.get('/:id/edit', (req, res) => {
  Renderer.preloadArticles(req, 'main', 1, { _id: req.params.id }, false);
  Renderer.render(req, res, views['admin-articles-edit']);
});

router.post('/:id/edit', formidable());
router.post('/:id/edit', function(req, res) {
  var condition = {
    _id: req.params.id,
  };

  var update = {
    $set: {
      is_published: req.fields.is_published,
      is_featured: req.fields.is_featured,
      title: req.fields.title,
      slug: req.fields.slug,
      author: req.fields.author,
      heading_override: req.fields.heading_override,
      content: req.fields.content,
      parent: req.fields.parent,
    },
  };

  if (!mongoose.Types.ObjectId.isValid(req.fields.parent)) {
    delete update.$set.parent;
  }

  if (!req.fields.content) {
    delete update.$set.content;
  }

  Article.findOneAndUpdate(condition, update, { new: true }, function(err, doc) {
    if (err) {
      console.warn(err.message);
    }
    //refreshes the page
    res.redirect('back');
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
