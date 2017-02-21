import React from 'react'
import PageLayout from '../templates/page-layout'
import ArticleGroup from '../components/article-group'
import ArchivePanel from '../components/panels/archive'
import SistersPanel from '../components/panels/sisters'
import ArticleThumb from '../components/article-thumb'
import FeatureSlider from '../components/feature-slider'
import SocialPanel from '../components/panels/social'

const StaffPage = () =>
    <PageLayout id="staff-page"
        top={[

        ]}

        main={[
          <div>
		<h2>Staff</h2>
		<table>
			<tbody>
				<tr>
					<th>Name</th>
					<th>Position</th>
					<th>Contact Information</th>
				</tr>
				<tr>
					<td>Esther Jou</td>
					<td>Editor-in-Chief</td>
					<td>jouest@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Patricia Jia</td>
					<td>Associate Editor</td>
					<td>patjia@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Philip Jung</td>
					<td>Associate Editor</td>
					<td>juji@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Wendy Zhou</td>
					<td>Communications Chair</td>
					<td>hongyuz@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Michael Ruan</td>
					<td>Business Manager</td>
					<td>mruan@wharton.upenn.edu</td>
				</tr>
				<tr>
					<td>Sarah Tang</td>
					<td>Design Editor</td>
					<td>sartang@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Austin Eng</td>
					<td>Webmaster</td>
					<td>aen@seas.upenn.edu</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Writers</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Joanna Xue</td>
					<td></td>
					<td>Joxue@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Emma Hetrick</td>
					<td></td>
					<td>ehetrick@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Grace Cho</td>
					<td></td>
					<td>chograce@nursing.upenn.edu</td>
				</tr>
				<tr>
					<td>Sean Noh</td>
					<td></td>
					<td>sean.d.noh@gmail.com</td>
				</tr>
				<tr>
					<td>Joyce Xu</td>
					<td></td>
					<td>joycexu@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Wesley Chow</td>
					<td></td>
					<td>chowyinh@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Phoebe Low</td>
					<td></td>
					<td>phoebe.low13@gmail.com</td>
				</tr>
				<tr>
					<td>Andrew Wang</td>
					<td></td>
					<td>andrwang@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Summer Osborn</td>
					<td></td>
					<td>osborns@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Henrique Laurino</td>
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
					<td>Isaac Han</td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Editors</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Connie Miller</td>
					<td></td>
					<td>comiller@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Emily Schutsky</td>
					<td></td>
					<td>eschutsk@gmail.com</td>
				</tr>
				<tr>
					<td>Ken Teoh</td>
					<td></td>
					<td>teoh@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Sebastian De Armas</td>
					<td></td>
					<td>johnsde@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Hannah Victor</td>
					<td></td>
					<td>vhannah@law.upenn.edu</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Design</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Vivian Dai</td>
					<td></td>
					<td>vdai@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Andrew Min</td>
					<td></td>
					<td>andrewkm@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Wesley Chow</td>
					<td></td>
					<td>chowyinh@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Phoebe Low</td>
					<td></td>
					<td>phlo@sas.upenn.edu</td>
				</tr>
				<tr>
					<td>Sophia Chao</td>
					<td></td>
					<td>csophia@nursing.upenn.edu</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Web</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Will Yeung</td>
					<td></td>
					<td>tsuny@sas.upenn.edu</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Business</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Timothy Chang</td>
					<td></td>
					<td>timchang@wharton.upenn.edu</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<th>Communications</th>
					<th></th>
					<th></th>
				</tr>
				<tr>
					<td>Joyce Xu</td>
					<td></td>
					<td>joycexu@sas.upenn.edu</td>
				</tr>
			</tbody>
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
                <SocialPanel />
            </div>
            <div className="col-md-12 col-xs-6">
                <ArchivePanel />
            </div>
        </div>
        ]}
    />
;

export default StaffPage

import {mount} from '../helpers/page'
mount(StaffPage) 
