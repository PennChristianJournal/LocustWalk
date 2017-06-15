import path from 'path';
import {Router} from 'express';
const router = new Router();

import {defineAdminPageRoute} from '../../helpers';
import Article from '../../../models/article';
import {fetchArticles} from '../../../react/actions/articles';
const formidable = require('express-formidable');
const AdminViews = path.join(__dirname, '../../../react/views/admin');


import ArticlesList from '../../../react/views/admin/articles/index';
defineAdminPageRoute(router, '/', ArticlesList, path.join(AdminViews, 'articles/index.js'), function(req, res, store, render) {
  render();
});

import ArticleEdit from '../../../react/views/admin/articles/edit';
defineAdminPageRoute(router, '/:id/edit', ArticleEdit, path.join(AdminViews, 'articles/edit.js'), function(req, res, store, render) {
  store.dispatch(fetchArticles('main', 0, {
    _id: req.params.id,
  }, Article.queryPaginatedPromise.bind(Article))).then(render);
}

);


router.use(formidable());
router.post('/:id/edit', function(req, res) {
  console.log("here" + req.params);

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

  Article.findOneAndUpdate(condition, update, { new: true }, function(err, doc) {
    if (err) {
      console.warn(err.message);
    }
        //refreshes the page
    res.redirect('back');


  });

});


export default router;
