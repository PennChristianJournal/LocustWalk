'use strict';

import { Router } from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/renderer';

const router = new Router();

import ArticlesController from './articles';
router.use('/articles', ArticlesController);

// serve static views
const views = ViewEngine.getViews('admin');
Object.keys(views).forEach(key => {
  const view = views[key];
  router.get(view.route, (req, res) => {
    Renderer.render(req, res, view);
  });
});

export default router;
