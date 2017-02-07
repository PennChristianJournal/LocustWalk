
import path from 'path'
import {Router} from 'express'
const router = Router();

import auth from './auth'
auth(router);

import {definePageRoute} from '../helpers'

const AdminViews = path.join(__dirname, '../../react/views/admin');

import AdminHome from '../../react/views/admin/index'

definePageRoute(router, '/', AdminHome, path.join(AdminViews, 'index.js'), function(req, res, store, render) {
    render();
});

import ArticlesController from './articles'
router.use('/articles', ArticlesController);

export default router;