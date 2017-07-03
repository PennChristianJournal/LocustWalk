
import React from 'react';

import AdminLayout from '../../templates/admin/admin-layout';
import RegularForm from '../../views/regularform'
const AdminHome = () => (
  <AdminLayout id="admin-page">

      <div>This is the admin paneld</div>
    <RegularForm url = "/admin"/>



  </AdminLayout>
);

export default AdminHome;

AdminHome.metadata = Object.assign({}, AdminLayout.metadata);


import {mount} from '../../helpers/page';
mount(AdminHome);
