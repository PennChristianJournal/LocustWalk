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

const Schema = mongoose.Schema({
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
    content: {
        type: String,
        default: ''
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    }
}, {
    timestamps: true
});

Schema.virtual('cover').get(function() {
    return `/files/${this._id}_cover`
});

Schema.virtual('thumb').get(function() {
    return `/files/${this._id}_thumb`
});

Schema.pre('save', function(next) {
    var self = this;
    if (!self.slug) {
        if (self.title) {
            self.slug = slugs(self.title)
        }
    }
    next()
});

export default mongoose.model('Article', Schema);