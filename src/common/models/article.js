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
  is_featured: {
    type: Boolean,
    index: true,
    default: false,
  },
  date: {
    type: Date,
    index: true,
  },
  author: String,
  content: {
    type: String,
    $p: {
      widget: 'textarea',
      display: 'e',
    },
  },
  heading_override: {
    type: String,
    default: '',
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

