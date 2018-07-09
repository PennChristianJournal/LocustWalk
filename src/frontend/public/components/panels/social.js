import React from 'react';

const SocialPanel = () => (
  <div className="tile tile-vertical blue-theme">
      <h2 className="strong">Social Media</h2>
      <p>Connect with us on social media to stay up to date with new content and announcements.</p>
      <div className="logo" style={{maxWidth: '33%'}}>
          <a href="//www.facebook.com/PennChristianJournal/"><img src="/img/facebook-logo.png" style={{width: '100%'}} /></a>
      </div>
      <div className="logo" style={{maxWidth: '33%'}}>
          <a href="//www.twitter.com/LWJ_Penn/"><img src="/img/twitter-logo.png" style={{width: '100%'}} /></a>
      </div>
      <div className="logo" style={{maxWidth: '33%'}}>
          <a href="//www.instagram.com/LWJ_Penn/"><img src="/img/instagram-logo.png" style={{
            width: '100%',
            WebkitFilter: 'invert(100%)',
            filter: 'invert(100%)',
          }} /></a>
      </div>
  </div>
);

export default SocialPanel;
