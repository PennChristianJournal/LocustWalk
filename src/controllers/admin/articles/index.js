
import path from 'path'
import {Router} from 'express'
const router = Router();

import {definePageRoute} from '../../helpers'

import { fetchArticles } from '../../../react/actions/articles'

const AdminViews = path.join(__dirname, '../../../react/views/admin');

import ArticlesList from '../../../react/views/admin/articles/index'
definePageRoute(router, '/', ArticlesList, path.join(AdminViews, 'articles/index.js'), function(req, res, store, render) {
    render();
});


import ArticleSideBar from '../../../react/components/admin/article-sidebar'
definePageRoute(router, '/:id/edit', ArticleSideBar, path.join(__dirname, '../../../react/components/admin/article-sidebar.js'), function(req, res,store, render) {
     console.log(req.body);
});
router.post('/admin/articles/:id/edit', function(req, res) {
   console.log(req.body);
});


import ArticleEdit from '../../../react/views/admin/articles/edit'
definePageRoute(router, '/:id/edit', ArticleEdit, path.join(AdminViews, 'articles/edit.js'), function(req, res, store, render) {
    store.dispatch(fetchArticles('main', 0, {
        _id: req.params.id
    })).then(render);
});

export default router;
