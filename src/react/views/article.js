
import React from 'react'
import PageLayout from '../templates/page-layout'

const ArticlePage = () => 
    <PageLayout>
        hi
    </PageLayout>
;

export default ArticlePage

import {mount} from '../helpers/page'
mount(ArticlePage)