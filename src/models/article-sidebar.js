import mongoose from 'mongoose';
import slugs from 'slugs';



const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sections: [{
    type: String
    required: true,

}]

});


export default mongoose.model('ArticleSideBar', Schema);
