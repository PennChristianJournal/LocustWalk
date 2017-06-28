import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  data: {
    type: Buffer,
  },
  contentType: {
    type: String,
  },
});

export default mongoose.model('SmallFile', Schema);