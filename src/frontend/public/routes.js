import React from 'react';
import path from 'path';
import asyncComponent from '../common/components/async-component';
import withClass from '../common/components/with-class';
import PublicLayout from './templates/public-layout';

const routes = [
  {
    path: '/(articles|topics)/:slugOrId',
    component: withClass('article-layout', PublicLayout),
    routes: [
      {
        path: '/articles/:idOrSlug',
        component: asyncComponent(path.resolve(__dirname, './views/article'), () => import('./views/article')),
      },
      {
        path: '/topics/:idOrSlug',
        component: asyncComponent(path.resolve(__dirname, './views/topic'), () => import('./views/topic')),
      },
    ],
  },
  {
    component: withClass('main-layout', PublicLayout),
    routes: [
      {
        path: '/',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/home'), () => import('./views/home')),
      },
      {
        path: '/about',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/about'), () => import('./views/about')),
      },
      {
        path: '/staff',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/staff'), () => import('./views/staff')),
      },
      {
        path: '/submissions',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/submissions'), () => import('./views/submissions')),
      },
      {
        path: '/submissions/writers-guide-feature',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/submissions/writers-guide-feature'), () => import('./views/submissions/writers-guide-feature')),
      },
      {
        path: '/submissions/writers-guide-response',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/submissions/writers-guide-response'), () => import('./views/submissions/writers-guide-response')),
      },
      {
        path: '/subscribe',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './views/subscribe'), () => import('./views/subscribe')),
      },
    ],
  }
];

export default routes;
