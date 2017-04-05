
import { Router } from 'express';
const router = new Router();

import {definePageRoute} from './helpers';

import { fetchArticles, invalidateArticles } from '../react/actions/articles';
import HomePage from '../react/views/index';
import Article from '../models/article';

definePageRoute(router, '/', HomePage, `${__dirname}/../react/views/index.js`, function(req, res, store, render) {
  store.dispatch(fetchArticles('featured', 0, {
    sort: 'date',
    limit: 1,
    is_published: true,
    is_featured: true,
  }, Article.queryPaginatedPromise.bind(Article)))
  .then(() => {
    store.dispatch(invalidateArticles('featured', 0));
    render();
  });
});

import AboutPage from '../react/views/about';
definePageRoute(router, '/about', AboutPage, `${__dirname}/../react/views/about.js`,
function(req, res, store, render) {
  render();
});
import StaffPage from '../react/views/staff';
definePageRoute(router, '/staff', StaffPage, `${__dirname}/../react/views/staff.js`,
function(req, res, store, render) {
  render();
});

import SubmissionsPage from '../react/views/submissions';
definePageRoute(router, '/submissions', SubmissionsPage, `${__dirname}/../react/views/submissions.js`,
function(req, res, store, render) {
  render();
});

import WritersGuideFeaturePage from '../react/views/writers-guide-feature';
definePageRoute(router, '/submissions/writers-guide-feature', WritersGuideFeaturePage, `${__dirname}/../react/views/writers-guide-feature.js`,
function(req, res, store, render) {
  render();
});

import WritersGuideResponsePage from '../react/views/writers-guide-response';
definePageRoute(router, '/submissions/writers-guide-response', WritersGuideResponsePage, `${__dirname}/../react/views/writers-guide-response.js`,
function(req, res, store, render) {
  render();
});

import SubscribePage from '../react/views/subscribe';
definePageRoute(router, '/subscribe', SubscribePage, `${__dirname}/../react/views/subscribe.js`,
function(req, res, store, render) {
  render();
});

import api from './api';
router.use('/api', api);

import FilesController from './files';
router.use('/files', FilesController);

import ArticleController from './articles';
router.use('/articles', ArticleController);

import AdminController from './admin';
router.use('/admin', AdminController);

export default router;
