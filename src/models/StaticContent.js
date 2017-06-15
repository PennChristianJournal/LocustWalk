import mongoose from 'mongoose';
import slugs from 'slugs';



const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contentMD: {
    type: String,
    required: true,
  },
  contentHTML:{
    type: String,
    required: false,
  },


});

export default mongoose.model('siteinfo', Schema);
