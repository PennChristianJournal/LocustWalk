
import path from 'path'
import {Router} from 'express'
const router = new Router();

import auth from './auth'
auth(router);

import {defineAdminPageRoute} from '../helpers'

const AdminViews = path.join(__dirname, '../../react/views/admin');

import AdminHome from '../../react/views/admin/index'

defineAdminPageRoute(router, '/', AdminHome, path.join(AdminViews, 'index.js'), function(req, res, store, render) {
    render();
});

import ArticlesController from './articles'
router.use('/articles', ArticlesController);

export default router;