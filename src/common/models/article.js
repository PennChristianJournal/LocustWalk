import mongoose from 'mongoose';
import slugs from 'slugs';

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  is_published: {
    type: Boolean,
    default: false,
    index: true,
  },
  date: {
    type: Date,
    index: true,
  },
  author: String,
  content: {
    type: String,
    required: true,
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
  pending_attachments: [String],
  attachments: [mongoose.Schema.Types.ObjectId],
  cover: String,
  thumb: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
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

export default mongoose.model('Article', Schema);

