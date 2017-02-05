
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

import {mount} from '../helpers/page'
mount(ArticlePage)