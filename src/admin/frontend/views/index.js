
import React from 'react';
import AdminLayout from '../templates/admin-layout'
import RegularForm from './regularform'
const AdminHome = () => (
  <AdminLayout id="admin-page">

      <RegularForm/>

  </AdminLayout>
);

export default AdminHome;

AdminHome.metadata = Object.assign({}, AdminLayout.metadata);


import {mount} from '../../../common/frontend/helpers/page';
mount(AdminHome);
