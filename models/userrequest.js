var mongoose = require('mongoose')
var VerificationToken = require('./verificationtoken')
var Mailer = require('../email/mailer')

var Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, 
    required: true, 
    default: Date.now(), 
    expires: '24h'
  },
  granted: {
    type: Boolean,
    default: false
  }
})

Schema.statics.createOrUpdate = function(email, done) {
  var model = this
  model.findOne({email: email}, function(err, doc) {
    if (err) throw err
    if (doc) {
      doc.createdAt = Date.now()
      doc.save(function(err) {
        if (err) return done(err, doc)
      })
    } else {
      model.create({
        email: email
      }, function(err, doc) {
        return done(err, doc)
      })
    }
  })
}

Schema.methods.grant = function(done) {
  VerificationToken.createToken(this.email, function(err, token) {
    if (err) throw err
    var message = {
      email: token.email,
      url: 'http://' + 'localhost:3000' + '/admin/accounts/register/' + token.token
    }
    Mailer.sendVerificationEmail(message, function(err) {
      return done(err)
    })
  })
}

module.exports = mongoose.model('UserRequest', Schema)