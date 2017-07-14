
import React from 'react';
<<<<<<< HEAD:src/admin/frontend/views/index.js
import AdminLayout from '~/admin/frontend/templates/admin-layout';
import RegularForm from '~/admin/frontend/views/regularform';
=======
>>>>>>> ecf3753c68872007b788111e12551a653fe09487:src/admin/frontend/views/index.js

import AdminLayout from '../../templates/admin/admin-layout';
import RegularForm from '../../views/regularform'
const AdminHome = () => (
  <AdminLayout id="admin-page">

<<<<<<< HEAD:src/admin/frontend/views/index.js
      <RegularForm/>
=======
      <div>This is the admin paneld</div>
    <RegularForm url = "/admin"/>



>>>>>>> ecf3753c68872007b788111e12551a653fe09487:src/admin/frontend/views/index.js
  </AdminLayout>
);

export default AdminHome;

AdminHome.metadata = Object.assign({}, AdminLayout.metadata);
<<<<<<< HEAD:src/admin/frontend/views/index.js
=======


import {mount} from '../../helpers/page';
mount(AdminHome);
>>>>>>> ecf3753c68872007b788111e12551a653fe09487:src/admin/frontend/views/index.js
