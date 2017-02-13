import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'

const SubmissionsPage = () =>
    <PageLayout id="submission-page"
        top={[

        ]}

        main={[
            <div className="tile tile-vertical white-theme">
  <h2 className="strong">Article Submission</h2>

    <div class="text">
    <p>We are accepting article, artwork and photography submissions for our online and our first print edition to be released Spring 2017.</p>
    <p>For our online edition, Locust Walk follows a structured response model which allows us to capture the dialogue within our Penn community. Feature articles are published the first Sunday of each month and weekly blog-style articles responding to the feature content are published each following Sunday. A separate print publication will be released bi-annually at the beginning of each semester.</p>
    <p>Please use the following guides to direct your writing:</p>
    <ul class = "list"></ul>

<li><a href="/writers-guide-feature">Feature Article Submissions</a></li>
  <li>
      <a href="/writers-guide-response">Response Article Submissions</a>
    </li>
    </div>
    <h2 className = "strong"> Artwork and photography submissions</h2>
    <p> Please attach your photos or artwork as a .jpg file and email them to us at <a href= "pennchristianjournal@gmail.com"> </a>
      Include your first and last name, class year, school, and course of study.</p>
</div>

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

export default SubmissionsPage
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
        <Provider store={store}><SubmissionsPage /></Provider>,
        document.getElementById('root')
    )
}
