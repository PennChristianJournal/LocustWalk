'use strict'

var mongoose = require('mongoose')
var slugs = require('slugs')
var moment = require('moment')

var Schema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  is_published: {
    type: Boolean,
    default: false,
    index: true
  },
  is_featured: {
    type: Boolean,
    index: true,
    default: false
  },
  date: {
    type: Date,
    index: true
  },
  author: String,
  content: {
    type: String,
    required: true,
    $p: {
      widget: 'textarea',
      display: 'e'
    }
  },
  heading_override: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    index: {
      unique: true,
      sparse: true
    }
  },
  pending_attachments: [String],
  cover: String,
  thumb: String, 
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  }
}, {
  timestamps: true
})

Schema.pre('save', function(next) {
  var self = this
  if (!self.slug) {
    if (self.title) {
      self.slug = slugs(self.title)
    }
  }
  next()
})

var google = require('googleapis')
var config = require(__root + '/config.js')
var fs = require('fs')
var cheerio = require('cheerio')
fs.writeFileSync(`${__root}/jwt.json`, JSON.stringify(config.jwt))

var jwtClient = new google.auth.JWT(
  config.jwt.client_email,
  'jwt.json',
  config.jwt.private_key,
  ['https://www.googleapis.com/auth/drive']
)

Schema.statics.searchDrive = function(name, mimeType, callback) {
  var drive;
  var files = [];

  var fetchPage = function(pageToken, cb) {
    drive.files.list({
      q: `name contains '${name}'`,
      fields: 'nextPageToken, files(id, name)',
      spaces: 'drive',
      pageToken: pageToken
    }, function(err, res) {
      if (err) return cb(err)
      res.files.forEach(function(file) {
        files.push(file)
      })
      if (res.nextPageToken) {
        // more results...
      }
      cb(null)
    })
  }

  jwtClient.authorize((err, tokens) => {
    drive = google.drive({ version: 'v3', auth: jwtClient })
    fetchPage(null, function() {
      callback(null, files)
    })
  })
}

Schema.methods.populate = function(doc_id, callback) {
  var self = this
  google.drive({ version: 'v3', auth: jwtClient }).files.export({
    auth: jwtClient,
    fileId: doc_id,
    mimeType: 'text/html'
  }, (err, response) => {
    if (err) return callback(err)
    var $ = cheerio.load(response)
    $('p').each(function() {
      $(this).removeAttr('style')
    })
    self.content = $('body').html()
    return callback(null)
  })
}

var Model = mongoose.model('Article', Schema)

module.exports = Model