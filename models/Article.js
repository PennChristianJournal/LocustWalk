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
    default: false
  },
  is_featured: {
    type: Boolean,
    index: true,
    default: false
  },
  date: {
    type: Date,
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

var Model = mongoose.model('Article', Schema)

module.exports = Model