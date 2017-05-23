import path from 'path';
import {
    Router
} from 'express';
const router = new Router();
const formidable = require('express-formidable');
var count = 0;

import {
    defineAdminPageRoute
} from '../../helpers';
import Article from '../../../models/article';
import {
    fetchArticles
} from '../../../react/actions/articles';

const AdminViews = path.join(__dirname, '../../../react/views/admin');
router.use(formidable());
// router.post('/admin/articles/:id/edit', function (req, res){
//   var form = new formidable.IncomingForm();
// console.log(req.fields);
// });

///admin/articles/${article._id}/edit`
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

router.post('/:id/edit', function(req, res) {

    var condition = {
        _id: req.params.id
    };

    var update = {
        $set: {
            is_published: req.fields.is_published,
            title: req.fields.title,
            slug: req.fields.slug,
            author: req.fields.author,
            heading_override: req.fields.is_published.heading_override
        }

    };

    Article.findOneAndUpdate(condition, update, { new: true }, function(err, doc) {
        if (err) {
            console.warn(err.message);
        } else {
          //refreshes the page
            res.redirect('back');
        }

    });

});


export default router;
