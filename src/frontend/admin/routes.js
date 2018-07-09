import React from 'react';
import path from 'path';
import asyncComponent from '../common/components/async-component';
import AdminLayout from './templates/admin-layout';

const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    routes: [
      {
        path: '/admin/features',
        component: asyncComponent(path.resolve(__dirname, './views/features'), () => import('./views/features')),
      },
      {
        path: '/admin/topics',
        component: asyncComponent(path.resolve(__dirname, './views/topics'), () => import('./views/topics')),
      },
      {
        path: '/admin/articles',
        component: asyncComponent(path.resolve(__dirname, './views/articles'), () => import('./views/articles')),
      },
    ],
  },
]

export default routes;
