'use strict'

var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
var config = require('../config')

var transporter;

module.exports = {
  init: function(done) {
    transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: config.setup.admin_email,
        pass: config.setup.admin_pass
      }
    }))

    transporter.verify(function(error, success) {
      if (error) {
        throw error
        done() 
      } else {
        console.log('Ready to send emails');
        done() 
      }
    }) 
  },

  /*sendVerificationEmail: function(message, done) {
    var mailOptions = {
      from: "\"" + config.mail.name + "\"" + "<" + config.mail.email + ">",
      to: message.email,
      subject: 'Locust Walk Registration',
      text: 'Please confirm your registration for Locust Walk by clicking the following link: ' + message.url
    }

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err)
      console.log('Email sent: ' + info.response)
      done(err)
    })
  },*/

  sendPasswordResetEmail: function(message, done) {
    return done();
    var mailOptions = {
      from: "\"" + config.mail.name + "\"" + "<" + config.mail.email + ">",
      to: message.email,
      subject: 'Locust Walk Password Reset',
      text: 'Please click the following link to reset your password: ' + message.url
    }

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err)
      console.log('Email sent: ' + info.response)
      done(err)
    })
  }
}