'use strict';

import { Router } from 'express';
import ViewEngine from '~/viewEngine';
import Renderer from '~/server/renderer';

const router = new Router();

import GraphQL from '~/graphql';
router.use('/graphql', GraphQL);

import ArticlesController from './articles';
router.use('/articles', ArticlesController);
router.get('/article', (req, res) => res.status(404));

import TopicsController from './topics';
router.use('/themes', TopicsController);
router.get('/theme', (req, res) => res.status(404));

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
