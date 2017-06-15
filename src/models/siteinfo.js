import mongoose from 'mongoose';
import slugs from 'slugs';

const section = new Schema({
  section_heading: {
    type: String,
    required: true,
  },
  section_content: [{
    type: String,
    required: true,
  }],

});
const contributors = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  contact_info: [{
    type: String,
    required: true,
  }],


});
const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sections: {
    type: section,
    required: true,
  },
  img:[{
    type: Buffer,
    required: false,
  }],
  contributors:[{
    type: person,
    required: false,
  }],

});

export default mongoose.model('siteinfo', Schema);
