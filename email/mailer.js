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
        user: config.mail.email,
        pass: config.mail.pass
      }
    }))

    transporter.verify(function(error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log('Ready to send emails');
      }
    })
    
    done()  
  },

  sendVerificationEmail: function(message, done) {
    var mailOptions = {
      from: "\"" + config.mail.name + "\"" + "<" + config.mail.email + ">",
      to: message.email,
      subject: 'Locust Walk Registration',
      text: 'Please confirm your registration for Locust Walk by clicking the following link: ' + message.url
    }
    console.log(mailOptions)
    transporter.sendMail(mailOptions, function(err, info) {
      if (err) console.log(err)
      console.log('Email sent: ' + info.response)
      done(err)
    })
  }
}