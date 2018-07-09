import express from 'express';
import GraphQL from '../graphql';
import auth from './auth';
import publicRoutes from '../frontend/public/routes';
import adminRoutes from '../frontend/admin/routes';
import DocsRouter from './docs';
import PageRouter from './pageRouter';
import FilesController from './files';

const router = express();
auth('/admin', router);

router.use('/files', FilesController);
router.use('/graphql', GraphQL);
router.use('/admin/docs', DocsRouter);
router.get('/admin', PageRouter(adminRoutes, '/admin'));
router.get('/admin/*', PageRouter(adminRoutes, '/admin'));
router.get('*', PageRouter(publicRoutes));

export default router;
