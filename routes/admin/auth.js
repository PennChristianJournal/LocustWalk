'use strict'

var flash = require('connect-flash')
var User = require('../../models/User')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

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
}

module.exports = passport;