
import { Router } from 'express'
const router = Router();
import mongoose from 'mongoose'

import {definePageRoute} from './helpers'

import { fetchArticles } from '../react/actions/articles'
import ArticlePage from '../react/views/article'

definePageRoute(router, '/:slugOrId', ArticlePage, `${__dirname}/../react/views/article.js`, function(req, res, store, render) {
    var query = {
        limit: 1,
        published: true
    }

    if (mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
        query._id = req.params.slugOrId
    } else {
        query.slug = req.params.slugOrId
    }
    
    store.dispatch(fetchArticles('article', 0, query)).then(render);
});

export default router