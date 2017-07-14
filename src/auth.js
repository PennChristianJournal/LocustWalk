
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import nconf from 'nconf';

passport.use(new GoogleStrategy({
  clientID: nconf.get('GOOGLE_CLIENT_ID'),
  clientSecret: nconf.get('GOOGLE_CLIENT_SECRET'),
  callbackURL: `${nconf.get('SERVER_ROOT')}admin/login/callback`,
}, function(accessToken, refreshToken, profile, cb) {

  if (nconf.get('NODE_ENV') === 'development') {
    return cb(null, {
      name: 'dev',
    });
  }

  var emails = profile.emails.map(el => {
    return el.value;
  });
  var approved = nconf.get('ADMIN_EMAILS').split(' ');
  for (var email of emails) {
    if (approved.indexOf(email) >= 0) {
      return cb(null, profile);
    }
  }
  return cb(null, false);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

export default function(router) {
  router.get('/login', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  }));

  router.get('/login/callback', passport.authenticate('google', {
    successRedirect: '/admin/login/success',
    failureRedirect: '/',
  }));

  router.get('/login/success', function(req, res) {
    res.redirect(req.session.lastUrl || '/');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.use('/', function(req, res, next) {
if (nconf.get('NODE_ENV') !== 'development' && !req.isAuthenticated()) {
      req.session.lastUrl = req.originalUrl;
      return res.redirect('/admin/login');
    } else {
      return next();
    }
  });
}
