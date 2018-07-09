import { Router } from 'express';
import { publicRoutes, adminRoutes } from '../routes';
import PageRouter from './pageRouter';

const router = Router();

router.get('/admin/*', PageRouter(adminRoutes));
router.get('*', PageRouter(publicRoutes));

export default router;
