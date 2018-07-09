
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import nconf from 'nconf';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';

passport.use(new GoogleStrategy({
  clientID: nconf.get('GOOGLE_CLIENT_ID'),
  clientSecret: nconf.get('GOOGLE_CLIENT_SECRET'),
  callbackURL: `${nconf.get('SERVER_ROOT')}admin/login/callback`,
}, function(accessToken, refreshToken, profile, cb) {

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

export default function(mountPath, router) {

  router.use(cookieParser());

  const RediStore = connectRedis(session);
  const redisStore = new RediStore({
    client: redis.createClient(nconf.get('REDIS_URL')),
  });

  router.use(session({
    secret: nconf.get('cookie_secret'),
    saveUninitialized: true,
    resave: true,
    store: redisStore.domain ? redisStore : undefined,
  }));

  router.use(passport.initialize());
  router.use(passport.session());

  const googleAuth = passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  function devAuth(req, res, next) {
    req.login({
      name: 'dev',
    }, (err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect(`${mountPath}/login/success`);
      }
    });
  }

  router.get(`${mountPath}/login`, nconf.get('NODE_ENV') === 'development' ? devAuth : googleAuth);

  router.get(`${mountPath}/login/callback`, passport.authenticate('google', {
    successRedirect: `${mountPath}/login/success`,
    failureRedirect: '/',
  }));

  router.get(`${mountPath}/login/success`, function(req, res) {
    res.redirect(req.session.lastUrl || '/');
  });

  router.get(`${mountPath}/logout`, function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.use(`${mountPath}/`, function(req, res, next) {
    if (!req.isAuthenticated()) {
      req.session.lastUrl = req.originalUrl;
      return res.redirect(`${mountPath}/login`);
    } else {
      return next();
    }
  });

  return router;
};
