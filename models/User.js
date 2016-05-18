'use strict'

var mongoose = require('mongoose')
var bcrypt = require("bcrypt")
var SALT_WORK_FACTOR = 10

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    index: {
      unique: true,
    },
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: {
      unique: true,
    },
    required: true
  }
})

UserSchema.pre('save', function (next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)

        user.password = hash
        next();
      });
    });
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function(err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}


module.exports = mongoose.model('User', UserSchema)