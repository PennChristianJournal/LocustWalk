import React from 'react'
import PageLayout from '../templates/page-layout'

const SocialPanel = () =>
<div className="col-md-12 col-xs-6">
    <div className="tile tile-vertical blue-theme">
        <h2 className="strong">Social Media</h2>
        <p>Connect with us on social media to stay up to date with new content and announcements.</p>
        <div className="logo">
            <a href="//www.facebook.com/PennChristianJournal/"><img src="/img/facebook-logo.png" style={{width: "100%"}} /></a>
        </div>
    </div>
</div>

export default SocialPanel

import {mount} from '../helpers/page'
mount(SocialPanel)
