import mongoose from 'mongoose';

const FeaturedItem = new mongoose.Schema({
  type: String,
  contentID: mongoose.Schema.Types.ObjectId,
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
  mainItem: {
    type: FeaturedItem,
    required: true,
  },
  secondaryItems: {
    type: [FeaturedItem],
  },
});

export default mongoose.model('Feature', Schema);

