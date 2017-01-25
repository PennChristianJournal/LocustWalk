import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'

const AboutPage = () =>
    <PageLayout id="about-page"
        top={[

        ]}

        main={[
        <h1 className="strong">Our Mission</h1>,
          <p className="thin">Our Mission</p>

        ]}

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

export default AboutPage
import { render } from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
const logger = createLogger();
import { Provider } from 'react-redux'
import reducer from '../reducers'

if (typeof document !== 'undefined') {
    const state = window.__STATE__;
    const store = createStore(reducer, state, applyMiddleware(thunk, logger));
    render(
        <Provider store={store}><AboutPage /></Provider>,
        document.getElementById('root')
    )
}
