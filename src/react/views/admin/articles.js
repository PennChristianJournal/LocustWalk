
import React from 'react'
import AdminLayout from '../../templates/admin/admin-layout'

const ArticlesList = () => (
    <AdminLayout id="admin-page">
        <div>This is the articles panel</div>
    </AdminLayout>
)

export default ArticlesList

ArticlesList.metadata = Object.assign({}, AdminLayout.metadata)

import {mount} from '../../helpers/page'
mount(ArticlesList)