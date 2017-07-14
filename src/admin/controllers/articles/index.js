'use strict';

import {Router} from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/renderer';
import mongoose from 'mongoose';

import formidable from 'express-formidable';
import Article from '~/common/models/article';

const router = new Router();

const views = ViewEngine.getViews('admin');

router.get('/:id/edit', (req, res) => {
  Renderer.preloadArticles(req, 'main', 1, { _id: req.params.id }, false);
  Renderer.render(req, res, views['admin-articles-edit']);
});

router.use(formidable());
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



export default router;
