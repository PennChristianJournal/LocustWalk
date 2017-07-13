
import { Router } from 'express';
const router = new Router();
import Renderer from '~/server/renderer';
import ViewEngine from '~/viewEngine';

const views = ViewEngine.getViews('common');

router.get('/:slugOrId', (req, res) => {
  Renderer.render(req, res, views['article'], {
    idOrSlug: req.params.slugOrId,
  });
});

export default router;
