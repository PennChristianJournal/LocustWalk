'use strict';

import { Router } from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/renderer';

const router = new Router();

import GraphQL from '~/graphql';
router.use('/graphql', GraphQL);

import ArticlesController from './articles';
router.use('/articles', ArticlesController);

import FilesController from './files';
router.use('/files', FilesController);

// serve static views
const views = ViewEngine.getViews('common');
Object.keys(views).forEach(key => {
  const view = views[key];
  router.get(view.route, (req, res) => {
    Renderer.render(req, res, view);
  });
});

export default router;
