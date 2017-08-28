import mongoose from 'mongoose';

const FeaturedItem = new mongoose.Schema({
  _typename: String,
  _id: mongoose.Schema.Types.ObjectId,
});

const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    index: {
      unique: true,
    },
    required: true,
  },
  is_published: {
    type: Boolean,
    default: false,
    index: true,
  },
  mainItem: {
    type: FeaturedItem,
    required: true,
  },
  secondaryItems: {
    type: [FeaturedItem],
  },
});

Schema.pre('validate', function(next) {
  var self = this;
  if (!self.index) {
    FeatureModel.find({}, {
      index: true,
    }, {
      sort: {
        index: -1,
      },
      limit: 1,
    }, (err, latest) => {
      self.index = (latest[0].index || 0) + 1;
      next(err);
    });
  } else {
    next();
  }
});

const FeatureModel = mongoose.model('Feature', Schema);
export default FeatureModel;
