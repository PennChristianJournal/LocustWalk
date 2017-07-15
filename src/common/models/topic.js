'use strict';

import mongoose from 'mongoose';
import slugs from 'slugs';

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    $p: {
      widget: 'textarea',
      display: 'e',
    },
  },
  slug: {
    type: String,
    index: {
      unique: true,
      sparse: true,
    },
  },
  cover: mongoose.Schema.Types.ObjectId,
  thumb: mongoose.Schema.Types.ObjectId,
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
}, {
  timestamps: true,
});

Schema.pre('save', function(next) {
  var self = this;
  if (!self.slug) {
    if (self.title) {
      self.slug = slugs(self.title);
    }
  }
  next();
});

export default mongoose.model('Topic', Schema);

