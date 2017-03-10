
import { Router } from 'express'
const router = Router();
import mongoose from 'mongoose'

import {definePageRoute} from './helpers'

import { fetchArticles } from '../react/actions/articles'
import ArticlePage from '../react/views/article'

definePageRoute(router, '/:slugOrId', ArticlePage, `${__dirname}/../react/views/article.js`, function(req, res, store, render) {
    var mainQuery = {
        limit: 1,
        published: true
    }

    if (mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
        mainQuery._id = req.params.slugOrId
    } else {
        mainQuery.slug = req.params.slugOrId
    }
    
    store.dispatch(fetchArticles('main', 0, mainQuery)).then(function(group) {
        const article = group.articles[0] || {};
        if (article.parent) {
            store.dispatch(fetchArticles('parent', 0, {
                _id: article.parent,
                limit: 1,
                published: true
            })).then(render)
        } else {
            render();
        }
    });
});

export default router