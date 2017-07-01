import React from 'react';
import PageLayout from '../templates/page-layout';
import ArchivePanel from '../components/panels/archive';
import SistersPanel from '../components/panels/sisters';
import SocialPanel from '../components/panels/social';

const SubscribePage = () =>
    <PageLayout id="submission-page"
        top={[

        ]}

        main={[
          <div className="tile tile-vertical white-theme">
            <h2 className="strong">Contact</h2>
            <p>To contact us, please email us at <a href="pennchristianjournal@gmail.com"> </a>. If you would like to contribute to the journal, please see the instructions for submissions.</p>



            <h2 className="strong">Stay Updated</h2>
            <p> Subscribe to our mailing list to receive our weekly newsletter and get notified of new articles!</p>
            <link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css"/>

            <style>{`
            #mc_embed_signup  {
              background: '#fff', 'clear:left','font:14px Helvetica,Arial,sans-serif';
              padding: '0!important';
            };

            .logo  {
              width: '50px';
              margin-top: '10px';
              margin-right: '10px';
            };

            #mc-embedded-subscribe-form  {
              padding: '0!important';
            }
            `}</style>

            <div id="mc_embed_signup">
              <form action="//pennchristianjournal.us13.list-manage.com/subscribe/post?u=0c6ca517c3cf489926ee85a20&amp;id=ce14e6980f" className="validate" id="mc-embedded-subscribe-form" method="post" name="mc-embedded-subscribe-form" noValidate="" target="_blank">
                <div id="mc_embed_signup_scroll">
                  <div className="indicates-required">
                    <span className="asterisk">*</span> indicates required
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL">Email Address <span className="asterisk">*</span></label>
                    <input className="required email" id="mce-EMAIL" name="EMAIL" type="email" value="" />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-FNAME">First Name</label>
                    <input id="mce-FNAME" name="FNAME" type="text" value="" />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-LNAME">Last Name</label>
                    <input id="mce-LNAME" name="LNAME" type="text" value="" />
                  </div>
                  <div className="clear" id="mce-responses">
                    <div className="response" id="mce-error-response" style={{display: 'none'}}></div>
                    <div className="response" id="mce-success-response" style={{display: 'none'}}></div>
                  </div>
                  <div aria-hidden="true" style={{position: 'absolute', left: '-5000px'}}>
                    <input name="b_0c6ca517c3cf489926ee85a20_ce14e6980f" tabIndex="-1" type="text" value="" />
                  </div>
                  <div className="clear">
                    <input className="button" id="mc-embedded-subscribe" name="subscribe" type="submit" value="Subscribe" />
                  </div>
                </div>
              </form>
            </div>
          </div>,
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

export default SubscribePage;
