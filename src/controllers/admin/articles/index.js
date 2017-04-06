
import path from 'path'
import {Router} from 'express'
const router = new Router();

import {defineAdminPageRoute} from '../../helpers'
import Article from '../../../models/article'
import { fetchArticles } from '../../../react/actions/articles'

const AdminViews = path.join(__dirname, '../../../react/views/admin');

import ArticlesList from '../../../react/views/admin/articles/index'
defineAdminPageRoute(router, '/', ArticlesList, path.join(AdminViews, 'articles/index.js'), function(req, res, store, render) {
    render();
});

import ArticleEdit from '../../../react/views/admin/articles/edit'
defineAdminPageRoute(router, '/:id/edit', ArticleEdit, path.join(AdminViews, 'articles/edit.js'), function(req, res, store, render) {
    store.dispatch(fetchArticles('main', 0, {
        _id: req.params.id
    }, Article.queryPaginatedPromise.bind(Article))).then(render);
});

export default router;