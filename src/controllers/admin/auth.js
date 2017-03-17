
import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import path from 'path'
import config from '../../config'

passport.use(new GoogleStrategy({
  clientID: config.google.client_id,
  clientSecret: config.google.client_secret,
  callbackURL: `${config.setup.root}admin/login/callback`
}, function(accessToken, refreshToken, profile, cb) {

  var emails = profile.emails.map(el => {
    return el.value
  })
  var approved = config.setup.emails.split(' ')
  for (var email of emails) {
    if (approved.indexOf(email) >= 0) {
      return cb(null, profile)
    }
  }
  return cb(null, false)
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// export default passport

export default function(router) {
    router.get('/login', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.email']
    }));

    router.get('/login/callback', passport.authenticate('google', {
    successRedirect: '/admin/login/success',
    failureRedirect: '/'
    }));

    router.get('/login/success', function(req, res) {
    res.redirect(req.session.lastUrl || '/')
    });

    router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
    });

    router.use('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.session.lastUrl = req.originalUrl;
        return res.redirect('/admin/login')
    } else {
        return next()
    }
    });
}
