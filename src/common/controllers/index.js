'use strict';

import { Router } from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/renderer';

const router = new Router();

import APIController from './api';
router.use('/api', APIController);

import ArticlesController from './articles';
router.use('/articles', ArticlesController);

import FilesController from './files';
router.use('/files', FilesController);

// preload the first few articles
router.get('/', (req, res, next) => {
  Renderer.preloadArticles(req, 'featured', 1);
  Renderer.preloadArticles(req, 'recent', 2);
  next();
});

// serve static views
const views = ViewEngine.getViews('common');
Object.keys(views).forEach(key => {
  const view = views[key];
  router.get(view.route, (req, res) => {
    Renderer.render(req, res, view);
  });
});

export default router;