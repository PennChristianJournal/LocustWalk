
import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArticleGroupInfinite from '../components/article-group-infinite'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import SocialPanel from '../components/panels/social'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'
import {debounce} from 'underscore'

const HomePage = () => (
    <PageLayout id="home-page"
        top={[
        <div className="row">
            <div className="col-md-12 col-sm-12">
                <div className="tile tile-vertical blue-theme announcement">
                    <p>Now accepting response pieces to any feature article for our first print edition to be released Jan 2017. Send your submissions to <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>.</p>
                    <p>Interested in writing a feature article for 2017? Send an email to <a href="mailto:pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>.</p>
                </div>
            </div>
        </div>
        ,
        <ArticleGroup name="featured" query={{
            sort: 'date',
            limit: 12,
            is_published: true,
            is_featured: true
        }}>
            {articles => <FeatureSlider articles={articles} />}
        </ArticleGroup>
        ]}

        main={
        <ArticleGroupInfinite name="recent" initialPages={1} query={{
                sort: 'date',
                limit: 10,
                is_published: true
            }}>
            {(articles, group) =>
                <div className="tile tile-vertical white-theme">
                    <h2 className="strong">Recent Articles</h2>
                    {articles.map((article, i) => {
                        return <ArticleThumb article={article} key={i} />
                    })}
                    <button className="btn btn-default center-block" onClick={group.fetchMore.bind(group)}>Load More</button>
                </div>
            }
        </ArticleGroupInfinite>
        }

        side={[
        <div className="row">
            <div className="col-md-12 col-sm-6">
                <SistersPanel />
            </div>
        </div>
        ,
        <div className="row">
            <div className="col-md-12 col-xs-6">
                <SocialPanel />
            </div>
            <div className="col-md-12 col-xs-6">
                <ArchivePanel />
            </div>
        </div>
        ]}
    />
)

export default HomePage

HomePage.metadata = Object.assign({}, PageLayout.metadata, {
    link: [
        {
            href: '/css/home.css',
            rel: 'stylesheet',
            type: 'text/css'
        },
        {
            href: '/css/article-thumb.css',
            rel: 'stylesheet',
            type: 'text/css'
        }
    ]
})

import {mount} from '../helpers/page'
mount(HomePage) 
