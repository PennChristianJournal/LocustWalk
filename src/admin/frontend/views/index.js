
import React from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';

const AdminHome = () => (
  <AdminLayout id="admin-page">
      <div>This is the admin panel</div>
  </AdminLayout>
);

export default AdminHome;

AdminHome.metadata = Object.assign({}, AdminLayout.metadata);

import {mount} from '~/common/frontend/helpers/page';
mount(AdminHome);