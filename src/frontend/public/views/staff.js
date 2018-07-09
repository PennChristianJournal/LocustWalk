import React from 'react';
import { Helmet } from 'react-helmet';
import PanelPage from '../components/panel-page';
import ArchivePanel from '../components/panels/archive';
import SistersPanel from '../components/panels/sisters';
import SocialPanel from '../components/panels/social';
import DonatePanel from '../components/panels/donate';

const StaffPage = () =>
    <PanelPage id="staff-page"
        top={[

        ]}

        main={[
          <Helmet>
            <title>Staff - Locust Walk</title>
            <meta name="description" content={'Locust Walk is a student-led Christian publication that exists to present the perspectives of faith and non-faith worldviews on questions of truth and purpose. Through active dialogue within the University of Pennsylvania, we seek to build relationships modeled after the life and teachings of Jesus Christ who informs our understanding of cultural engagement, reconciliation, and community. We pledge to cultivate an environment where the pursuit of solidarity in diversity can lay a foundation for conversation conducted with love and mutual respect.'.substring(0, 160)} />
          </Helmet>,
          <div className="tile tile-vertical white-theme">
            <h2 className="strong">Staff</h2>
            <table>
              <tbody>
                <tr>
                  <th>Editor-in-Chief</th>
                </tr>
                <tr>
                  <td>Esther Jou</td>
                  <td></td>
                  <td>jouest@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <th>Editorial Board</th>
                </tr>
                <tr>
                  <td>Sebastian De Armas </td>
                  <td></td>
                  <td>johnsde@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Patricia Jia</td>
                  <td></td>
                  <td>patjia@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Connie Miller </td>
                  <td></td>
                  <td>comiller@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Emily Schutsky </td>
                  <td></td>
                  <td>eschutsk@gmail.com</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <th>Executive Board</th>
                </tr>
                <tr>
                  <td><i>Web</i></td>
                </tr>
                <tr>
                  <td>Austin Eng</td>
                  <td></td>
                  <td>aen@seas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Will Yeung</td>
                  <td></td>
                  <td>tsuny@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td> </td>
                </tr>
                <tr>
                  <td><i>Design</i></td>
                </tr>
                <tr>
                  <td>Aliya Chen</td>
                </tr>
                <tr>
                  <td>Felicia Chen</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <td><i>Communications</i></td>
                </tr>
                <tr>
                  <td>Karissa Lam</td>
                </tr>
                <tr>
                  <td>Wendy Zhou</td>
                  <td></td>
                  <td>hongyuz@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td></td>
                </tr>
                <tr>
                  <th>Writers</th>
                </tr>
                <tr>
                  <td>Joanna Xue </td>
                  <td></td>
                  <td>Joxue@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Emma Hetrick</td>
                  <td></td>
                  <td>ehetrick@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Grace Cho </td>
                  <td></td>
                  <td>chograce@nursing.upenn.edu</td>
                </tr>
                <tr>
                  <td>Sean Noh </td>
                  <td></td>
                  <td>sean.d.noh@gmail.com</td>
                </tr>
                <tr>
                  <td>Joyce Xu </td>
                  <td></td>
                  <td>joycexu@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Wesley Chow </td>
                  <td></td>
                  <td>chowyinh@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Phoebe Low </td>
                  <td></td>
                  <td>phoebe.low13@gmail.com</td>
                </tr>
                <tr>
                  <td>Andrew Wang </td>
                  <td></td>
                  <td>andrwang@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Summer Osborn </td>
                  <td></td>
                  <td>osborns@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Henrique Laurino </td>
                  <td></td>
                  <td>hlauri@wharton.upenn.edu</td>
                </tr>
                <tr>
                  <td>James Supplee</td>
                  <td></td>
                  <td>suppleej@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Mark Hoover</td>
                  <td></td>
                  <td>hooverm@sas.upenn.edu</td>
                </tr>
                <tr>
                  <td>Isaac Han </td>
                </tr>
              </tbody>
            </table>
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

export default StaffPage;
