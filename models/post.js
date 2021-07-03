const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
   userId:{
       type: mongoose.Schema.Types.ObjectId,
       ref:'User',
       required: true
   },
   title: {
       type:String,
       required: true,
   },
   body: {
    type:String,
    required: true,
   },
   image:{
       type: String,
       required: true
   },
  userName: {
      type: String,
      required: true
  }
},{timestamp: true});

module.exports = mongoose.model('Post', postSchema);