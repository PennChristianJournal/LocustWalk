
import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArticleMain from '../components/article-main'
import ArticleLayout from '../templates/article-layout'

const ArticlePage = () => 
    <ArticleLayout>
        <ArticleGroup name="main" query={{
            limit: 1,
            published: true
        }}>
            {articles =>
                <ArticleMain article={articles[0]} />
            }
        </ArticleGroup>
    </ArticleLayout>
;

export default ArticlePage

ArticlePage.metadata = Object.assign({}, ArticleLayout.metadata, {
    link: [
        {
            href: '/css/article.css',
            rel: 'stylesheet',
            type: 'text/css'
        }
    ]
})

import {mount} from '../helpers/page'
mount(ArticlePage)