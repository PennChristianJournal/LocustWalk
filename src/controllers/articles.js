
import { Router } from 'express'
const router = Router();

import {definePageRoute} from './helpers'

import { fetchArticles } from '../react/actions/articles'
import ArticlePage from '../react/views/article'

definePageRoute(router, '/:slugOrId', ArticlePage, `${__dirname}/../react/views/article.js`, function(req, res, store, render) {
    store.dispatch(fetchArticles('article', 0, {
        limit: 1,
        published: true
    })).then(render);
});

export default router