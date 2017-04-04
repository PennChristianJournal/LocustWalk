import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'
import SocialPanel from '../components/panels/social'

const AboutPage = () =>
    <PageLayout id="about-page"
        top={[

        ]}

        main={[
            <div className="tile tile-vertical white-theme">
        <h2 className="strong">Our Mission</h2>
          <p>Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith
            worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we
            seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding
            of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit
            of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect. </p>
          <h2 className="strong">Statement of Faith</h2><p>We believe in one God, < br/>
              the Father almighty,<br />
              maker of heaven and earth,<br />
              of all things visible and invisible.<br /></p>
              <p>
              And in one Lord Jesus Christ,<br />
              the only Son of God,<br />
              begotten from the Father before all ages,<br />
              God from God, Light from Light,<br />
              true God from true God,<br />
              begotten, not made; of the same essence as the Father.<br />
              Through him all things were made.</p>
              <p>For us and for our salvation<br />
              he came down from heaven;<br />
              he became incarnate <br />
              by the Holy Spirit <br />
              and the virgin Mary, and was made human.</p>
              <p>He was crucified for us <br />
              under Pontius Pilate;<br />
              he suffered and was buried.</p>

              <p>The third day he rose again, <br />
              according to the Scriptures.<br />
              He ascended to heaven<br />
              and is seated at the right hand of the Father.<br />
              He will come again with glory<br />
              to judge the living and the dead.<br />
              His kingdom will never end.<br />
              And we believe in the Holy Spirit,<br />
              the Lord, the giver of life.<br />
              He proceeds from the Father and <br />
              with the Father and the Son<br />
              is worshiped and glorified.<br />
              He spoke through the prophets.<br />
              We believe in one holy catholic and apostolic church.<br />
              We affirm one baptism for the forgiveness of sins.<br />
              We look forward to the resurrection of the dead,<br />
              and to life in the world to come.<br />
              Amen.</p>
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

export default AboutPage
import {mount} from '../helpers/page'
mount(AboutPage);
