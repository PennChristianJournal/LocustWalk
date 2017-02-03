
import { Router } from 'express'
const router = Router();

import {definePageRoute} from './helpers'

import { fetchArticles, invalidateArticles } from '../react/actions/articles'
import HomePage from '../react/views/index'

definePageRoute(router, '/', HomePage, `${__dirname}/../react/views/index.js`, function(req, res, store, render) {
    store.dispatch(fetchArticles('featured', 0, {
        sort: 'date',
        limit: 1,
        published: true,
        featured: true
    })).then(() => {
        store.dispatch(invalidateArticles('featured', 0))
        render();
    });
});

import api from './api'
router.use('/api', api);

import FilesController from './files'
router.use('/files', FilesController)

import ArticleController from './articles'
router.use('/articles', ArticleController)

export default router;
