
import React from 'react';
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import RegularForm from '~/admin/frontend/views/regularform';

const AdminHome = () => (
  <AdminLayout id="admin-page">

      <RegularForm/>
  </AdminLayout>
);

export default AdminHome;

AdminHome.metadata = Object.assign({}, AdminLayout.metadata);
