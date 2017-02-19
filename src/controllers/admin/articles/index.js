
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

import ArticleEdit from '../../../react/views/admin/articles/edit'
definePageRoute(router, '/:id/edit', ArticleEdit, path.join(AdminViews, 'articles/edit.js'), function(req, res, store, render) {
    store.dispatch(fetchArticles('main', 0, {
        _id: req.params.id
    })).then(render);
});

export default router;