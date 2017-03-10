import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'
import SocialPanel from '../components/panels/social'

const SubmissionsPage = () =>
    <PageLayout id="submission-page"
        top={[

        ]}

        main={[
            <div className="tile tile-vertical white-theme">
  <h2 className="strong">Article Submission</h2>

    <div className="text">
    <p>We are accepting article, artwork and photography submissions for our online and our first print edition to be released Spring 2017.</p>
    <p>For our online edition, Locust Walk follows a structured response model which allows us to capture the dialogue within our Penn community. Feature articles are published the first Sunday of each month and weekly blog-style articles responding to the feature content are published each following Sunday. A separate print publication will be released bi-annually at the beginning of each semester.</p>
    <p>Please use the following guides to direct your writing:</p>
    <ul className = "list"></ul>

<li><a href="/submissions/writers-guide-feature">Feature Article Submissions</a></li>
  <li>
      <a href="/submissions/writers-guide-response">Response Article Submissions</a>
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
                <SocialPanel />
            </div>
            <div className="col-md-12 col-xs-6">
                <ArchivePanel />
            </div>
        </div>
        ]}
    />
;

export default SubmissionsPage
import {mount} from '../helpers/page'
mount(SubmissionsPage) 
