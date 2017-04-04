import mongoose from 'mongoose'
import slugs from 'slugs'
// import google from 'googleapis'
// import cheerio from 'cheerio'
// import config from '../config'
//
// fs.writeFileSync(`${__root}/jwt.json`, JSON.stringify(config.jwt));
//
// var jwtClient = new google.auth.JWT(
//     config.jwt.client_email,
//     'jwt.json',
//     config.jwt.private_key,
//     ['https://www.googleapis.com/auth/drive']
// );

const Schema = new mongoose.Schema({
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
    var self = this;
    if (!self.slug) {
        if (self.title) {
            self.slug = slugs(self.title)
        }
    }
    next()
});

Schema.statics.queryPaginated = function({limit, page, sort, ...params}, cb) {
  limit = parseInt(limit);
  page = parseInt(page);

  var query = this.find(params);
  if (sort) query = query.sort({[sort]: -1});
  if (!isNaN(page)) query = query.skip(page * limit);
  if (!isNaN(limit)) query = query.limit(limit);

  query.exec(cb);
}

Schema.statics.queryPaginatedPromise = function(params) {
  return new Promise((resolve, reject) => {
    this.queryPaginated(params, (err, articles) => {
      if (err) {
        reject(err);
      } else {
        resolve(articles);
      }
    });
  });
}

export default mongoose.model('Article', Schema);