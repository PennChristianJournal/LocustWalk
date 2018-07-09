import path from 'path';
import asyncComponent from './frontend/common/components/async-component';

import publicApp from './frontend/public/app';
import PublicLayout from './frontend/public/templates/public-layout';

export { publicApp };
export const publicRoutes = [
  {
    component: PublicLayout,
    routes: [
      {
        path: '/',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './frontend/public/views/home'), () => import('./frontend/public/views/home')),
      },
      {
        path: '/about',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './frontend/public/views/about'), () => import('./frontend/public/views/about')),
      },
      {
        path: '/staff',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './frontend/public/views/staff'), () => import('./frontend/public/views/staff')),
      },
      {
        path: '/submissions',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './frontend/public/views/submissions'), () => import('./frontend/public/views/submissions')),
      },
      {
        path: '/subscribe',
        exact: true,
        component: asyncComponent(path.resolve(__dirname, './frontend/public/views/subscribe'), () => import('./frontend/public/views/subscribe')),
      },
    ],
  },
];


import adminApp from './frontend/admin/app';

export { adminApp };
export const adminRoutes = [

];
