import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contentMD: {
    type: String,
    required: false,
  },
  contentHTML:{
    type: String,
    required: false,
  },


});

module.exports = mongoose.model('StaticContent', Schema);
