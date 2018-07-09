import React from 'react';
import Link from 'react-router-dom/Link';
import { Helmet } from 'react-helmet';
import PanelPage from '../components/panel-page';
import ArchivePanel from '../components/panels/archive';
import SistersPanel from '../components/panels/sisters';
import SocialPanel from '../components/panels/social';
import DonatePanel from '../components/panels/donate';

const SubmissionsPage = () =>
    <PanelPage id="submission-page"
        top={[

        ]}

        main={[
          <Helmet>
            <title>Submissions - Locust Walk</title>
            <meta name="description" content={'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.'.substring(0, 160)} />
          </Helmet>,
          <div className="tile tile-vertical white-theme">
            <h2 className="strong">Article Submission</h2>
            <div className="text">
              <p>We are accepting article, artwork and photography submissions for our online and our first print edition to be released Spring 2017.</p>
              <p>For our online edition, Locust Walk follows a structured response model which allows us to capture the dialogue within our Penn community. Feature articles are published the first Sunday of each month and weekly blog-style articles responding to the feature content are published each following Sunday. A separate print publication will be released bi-annually at the beginning of each semester.</p>
              <p>Please use the following guides to direct your writing:</p>
              <ul className="list">
                <li><Link to="/submissions/writers-guide-feature">Feature Article Submissions</Link></li>
                <li><Link to="/submissions/writers-guide-response">Response Article Submissions</Link></li>
              </ul>
            </div>
            <h2 className="strong"> Artwork and photography submissions</h2>
            <p>Please attach your photos or artwork as a .jpg file and email them to us at <a href="pennchristianjournal@gmail.com">pennchristianjournal@gmail.com</a>. Include your first and last name, class year, school, and course of study.</p>
          </div>,
          <DonatePanel />,
        ]}

        side={[
          <div className="row">
              <div className="col-md-12 col-sm-6">
                  <SistersPanel />
              </div>
          </div>,
          <div className="row">
              <div className="col-md-12 col-xs-6">
                  <SocialPanel />
              </div>
              <div className="col-md-12 col-xs-6">
                  <ArchivePanel />
              </div>
          </div>,
        ]}
    />
;

export default SubmissionsPage;
