
var mongoose = require('mongoose')
var slugs = require('slugs')
var moment = require('moment')
var NodeCache = require("node-cache")

var async = require('async')
var fs = require('fs')
var cheerio = require('cheerio')
var stream = require('stream');

var google = require('googleapis')
var config = require(__root + '/config.js')

fs.writeFileSync(`${__root}/jwt.json`, JSON.stringify(config.jwt))

var jwtClient = new google.auth.JWT(
  config.jwt.client_email,
  'jwt.json',  
  config.jwt.private_key,
  ['https://www.googleapis.com/auth/drive']
)

var googleCache = new NodeCache({stdTTL: 3600})

var fileCache = new NodeCache({stdTTL: 3600})
fileCache.on('del', (key, value) => {
  var path = `${__root}/public${value}`
  fs.unlinkSync(path)
})

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
  doc_id: {
    type: String,
    index: true,
    required: true
  },
  cover_id: String,
  thumb_id: String, 
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  }
}, {  
  timestamps: true
})

Schema.virtual('content').get(function() {
  return googleCache.get(this.doc_id) || ''
})

Schema.virtual('cover').get(function() {
  return fileCache.get(this.cover_id) || ''
})

Schema.virtual('thumb').get(function() {
  return fileCache.get(this.thumb_id) || ''
})

Schema.methods.fill = function(cb) {

  if (this.content && this.cover && this.thumb) {
    return cb(null)
  }

  jwtClient.authorize((err, tokens) => {
    if (err) return cb(err)
    async.parallel([
      (callback) => {
        if (!this.content) {
          google.drive({ version: 'v3', auth: jwtClient }).files.export({
            auth: jwtClient,
            fileId: this.doc_id,
            mimeType: 'text/html'
          }, (err, response) => {
            if (err) return callback(err)
            var $ = cheerio.load(response)
            googleCache.set(this.doc_id, $('body').html(), (err, success) => {
              return callback(err)
            })
          })
        } else {
          return callback(null)
        }
      },
      (callback) => {
        if (!this.cover && this.cover_id) {
          google.drive({ version: 'v3', auth: jwtClient }).files.get({
            auth: jwtClient,
            fileId: this.cover_id,
          }, (err, response) => {
            if (err) return callback(err)
            var public_path = `/files/${this.cover_id}-${response.name}`
            var path = `${__root}/public${public_path}`
            var wstream = fs.createWriteStream(path)
            google.drive({ version: 'v3', auth: jwtClient }).files.get({
              auth: jwtClient,
              fileId: this.cover_id,
              alt: 'media'
            }).on('error', (err) => {
              console.log(err)
            }).on('end', () => {
              fileCache.set(this.cover_id, public_path, (err, success) => {
                return callback(err)
              })
            }).pipe(wstream)
          })
        } else {
          return callback(null)
        }
      },
      (callback) => {
        if (!this.thumb && this.thumb_id) {
          google.drive({ version: 'v3', auth: jwtClient }).files.get({
            auth: jwtClient,
            fileId: this.thumb_id,
          }, (err, response) => {
            if (err) return callback(err)
            var public_path = `/files/${this.thumb_id}-${response.name}`
            var path = `${__root}/public${public_path}`

            var wstream = fs.createWriteStream(path)
            google.drive({ version: 'v3', auth: jwtClient }).files.get({
              auth: jwtClient,
              fileId: this.thumb_id,
              alt: 'media'
            }).on('error', (err) => {
              console.log(err)
            }).on('end', () => {
              fileCache.set(this.thumb_id, public_path, (err, success) => {
                return callback(err)
              })
            }).pipe(wstream)
          })
        } else {
          return callback(null)
        }
      },
    ], function(err, res) {
      return cb(err)
    })
  })
}

Schema.methods.expire = function() {
  googleCache.del(this.doc_id)
  fileCache.del([this.cover_id, this.thumb_id])
}

Schema.pre('save', function(next) {
  var self = this
  if (!self.slug) {
    if (self.title) {
      self.slug = slugs(self.title)
    }
  }
  next()
})

var Model = mongoose.model('Article', Schema)

module.exports = Model