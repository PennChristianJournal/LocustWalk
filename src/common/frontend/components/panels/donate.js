'use strict';

import React, { Component } from 'react';
import nconf from 'nconf';

class DonatePanel extends Component { 
  render() {
    return (
       <div className="tile tile-vertical gray-theme">
         <h2 className="strong">Donate</h2>
         <p>You can show your support by making a donation to Locust Walk so that we can keep the discussion going!</p>
         <form ref="donate-form" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
           <input type="hidden" name="cmd" value="_s-xclick" />
           <input type="hidden" name="encrypted" value={nconf.get('PAYPAL_KEY')} />
           <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" name="submit" alt="PayPal - The safer, easier way to pay online!" style={{display: 'none'}} />
           <img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
           <a href="#" onClick={() => { this.refs['donate-form'].submit(); }}>
             <div className="button" style={{
               marginTop: '10px', 
               marginRight: '10px',
               marginBottom: '10px',
             }}>Contribute</div>
             <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppppcmcvdam.png" alt="Pay with PayPal, PayPal Credit or any major credit card" style={{width: '100%', maxWidth: '388px' }} />
           </a>
         </form>
       </div>
    );
  }
}

export default DonatePanel;

