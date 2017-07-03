
import { Router } from 'express';
const router = new Router();
import mongoose from 'mongoose';
import Renderer from '~/renderer';
import ViewEngine from '~/viewEngine';

const views = ViewEngine.getViews('common');

router.get('/:slugOrId', (req, res) => {
  var query = {
    limit: 1,
    is_published: true,
  };

  if (mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
    query._id = req.params.slugOrId;
  } else {
    query.slug = req.params.slugOrId;
  }

  Renderer.preloadArticles(req, 'main', 1, query, false);
  Renderer.render(req, res, views['article']);
});

export default router;
