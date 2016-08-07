'use strict'

var flash = require('connect-flash')
var User = require('../../models/User')
var passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy
var config = require(__root + 'config.js')

passport.use(new GoogleStrategy({
  clientID: config.setup.google_client_id,
  clientSecret: config.setup.google_client_secret,
  callbackURL: config.setup.root + '/admin/login/callback'
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

/*var LocalStrategy = require('passport-local').Strategy

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password'
  },
  function (req, username, password, done) {
    if (!req.body.username) return done(null, false, req.flash('error', 'Username is required'));
    if (!req.body.password) return done(null, false, req.flash('error', 'Password is required'));

    User.findOne({ 'username' :  username },
      function(err, user) {
        if (err)
          return done(err);
        if (!user){
          return done(null, false, req.flash('error', 'Invalid username or password'));
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            return done(null, user);
          } else {
            return done(null, false, req.flash('error', 'Invalid username or password'));
          }
        });
      }
    );
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function validateEmail(email) {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}*/

module.exports = passport;