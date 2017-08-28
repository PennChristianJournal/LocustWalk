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
    index: true,
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

export default mongoose.model('Feature', Schema);
