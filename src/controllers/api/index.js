
import { Router } from 'express'
const router = new Router();

import articles from './articles'
router.use('/articles', articles);

export default router