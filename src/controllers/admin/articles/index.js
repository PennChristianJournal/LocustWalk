
import path from 'path'
import {Router} from 'express'
const router = Router();

import {definePageRoute} from '../../helpers'

const AdminViews = path.join(__dirname, '../../../react/views/admin');
import ArticlesList from '../../../react/views/admin/articles'

definePageRoute(router, '/', ArticlesList, path.join(AdminViews, 'articles.js'), function(req, res, store, render) {
    render();
});

export default router;