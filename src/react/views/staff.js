import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'

const StaffPage = () =>
    <PageLayout id="staff-page"
        top={[

        ]}

        main={[
            <div className="tile tile-vertical white-theme">
        <h2 className="strong">Staff</h2>
          <table class="tg">
    <tr>
      <th class="tg-yw4l">Name</th>
      <th class="tg-yw4l">Position</th>
      <th class="tg-yw4l">Contact Information</th>
    </tr>
    <tr>
      <td class="tg-yw4l">Esther Jou</td>
      <td class="tg-yw4l">Editor-in-Chief</td>
      <td class="tg-yw4l">jouest@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Patricia Jia</td>
      <td class="tg-yw4l">Associate Editor</td>
      <td class="tg-yw4l">patjia@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Philip Jung</td>
      <td class="tg-yw4l">Associate Editor</td>
      <td class="tg-yw4l">juji@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Wendy Zhou</td>
      <td class="tg-yw4l">Communications Chair</td>
      <td class="tg-yw4l">hongyuz@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Michael Ruan</td>
      <td class="tg-yw4l">Business Manager</td>
      <td class="tg-yw4l">mruan@wharton.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Sarah Tang</td>
      <td class="tg-yw4l">Design Editor</td>
      <td class="tg-yw4l">sartang@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Austin Eng</td>
      <td class="tg-yw4l">Webmaster</td>
      <td class="tg-yw4l">aen@seas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
  
    <tr>
      <th class="tg-yw4l">Writers</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Joanna Xue</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">Joxue@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Emma Hetrick</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">ehetrick@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Grace Cho</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">chograce@nursing.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Sean Noh</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">sean.d.noh@gmail.com</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Joyce Xu</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">joycexu@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Wesley Chow</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">chowyinh@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Phoebe Low</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">phoebe.low13@gmail.com</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Andrew Wang</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">andrwang@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Summer Osborn</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">osborns@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Henrique Laurino</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">hlauri@wharton.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">James Supplee</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">suppleej@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Mark Hoover</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">hooverm@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Isaac Han</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <th class="tg-yw4l">Editors</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Connie Miller</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">comiller@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Emily Schutsky</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">eschutsk@gmail.com</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Ken Teoh</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">teoh@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Sebastian De Armas</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">johnsde@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Hannah Victor</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">vhannah@law.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <th class="tg-yw4l">Design</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Vivian Dai</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">vdai@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Andrew Min</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">andrewkm@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Wesley Chow</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">chowyinh@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Phoebe Low</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">phlo@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l">Sophia Chao</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">csophia@nursing.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <th class="tg-yw4l">Web</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Will Yeung</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">tsuny@sas.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <th class="tg-yw4l">Business</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Timothy Chang</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">timchang@wharton.upenn.edu</td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l"></td>
    </tr>
    <tr>
      <th class="tg-yw4l">Communications</th>
      <th class="tg-yw4l"></th>
      <th class="tg-yw4l"></th>
    </tr>
    <tr>
      <td class="tg-yw4l">Joyce Xu</td>
      <td class="tg-yw4l"></td>
      <td class="tg-yw4l">joycexu@sas.upenn.edu</td>
    </tr>
</table>



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

export default StaffPage
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
