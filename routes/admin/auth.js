'use strict'

var flash = require('connect-flash')
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

module.exports = passport;