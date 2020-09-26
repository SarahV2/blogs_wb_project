const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  dateUpdated: {
    type: Date,
  },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],

  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Comment'},
  ],
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
