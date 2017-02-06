
import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'

const HomePage = () =>
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
            published: true,
            featured: true
        }}>
            {articles => <FeatureSlider articles={articles} />}
        </ArticleGroup>
        ]}

        main={
        <ArticleGroup name="recent" query={{
                sort: 'date',
                limit: 20,
                published: true
            }}>
            {articles =>
                <div className="tile tile-vertical white-theme">
                    <h2 className="strong">Recent Articles</h2>
                    {articles.map((article, i) => {
                        return <ArticleThumb article={article} key={i} />
                    })}
                </div>
            }
        </ArticleGroup>
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
                <div className="tile tile-vertical blue-theme">
                    <h2 className="strong">Social Media</h2>
                    <p>Connect with us on social media to stay up to date with new content and announcements.</p>
                    <div className="logo">
                        <a href="//www.facebook.com/PennChristianJournal/"><img src="/img/facebook-logo.png" style={{width: "100%"}} /></a>
                    </div>
                </div>
            </div>
            <div className="col-md-12 col-xs-6">
                <ArchivePanel />
            </div>
        </div>
        ]}
    />
;

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