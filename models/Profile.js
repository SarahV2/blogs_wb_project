const mongoose = require('mongoose');

const ProfileSchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
  },
  avatar: {
    type: String,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
