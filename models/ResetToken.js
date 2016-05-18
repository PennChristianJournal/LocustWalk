'use strict'

var mongoose = require('mongoose')
var uuid = require('node-uuid')

var Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date, 
    required: true, 
    default: Date.now(), 
    expires: '24h'
  }
})

Schema.statics.createToken = function(email, done) {
  var verificationToken = this
  var token = uuid.v4()

  var model = this
  model.findOne({email: email}, function(err, doc) {
    if (err) return done(err)
    if (doc) {
      doc.set('token', token)
      doc.save(function(err) {
        return done(err, doc)
      })
    } else {
      model.create({
        email: email,
        token: token
      }, function(err, doc) {
        return done(err, doc)
      })    
    }
  })
}

var model = mongoose.model('ResetToken', Schema)

model.verify = function(token, email, done) {
  model.findOne({token: token, email: email}, function(err, doc) {
    if (err) return done(err)
    if (doc) {
      model.remove(doc, function(err) {
        if (err) throw err
        return done(null, true)
      })
    } else {
      return done(null, false)
    }
  })
}

module.exports = model