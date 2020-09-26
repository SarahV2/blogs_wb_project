const express = require('express');
const router = express.Router();
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const auth = require('../../middleware/auth');

// @route   POST api/profiles
// @desc    Create a new Profile
// @access  Private

router.post('/', async (req, res) => {
  try {
    const {userID}=req.body
    //First check whether the user already has a profile.
    const userProfile = await Profile.findOne({ userID});
    if (userProfile) {
      return res
        .status(400)
        .json({ errors: [{ message: 'You already have a profile' }] });
    }
    // get the user's name
    const currentUser = await User.findById(userID)
    const name = currentUser.name

    //const { name } = currentUser;
    //const userID = req.user.id;
    //const {userID}=req.body

    let { username, bio } = req.body; //profile stuff- add avatar to the list later
    // Check the avaliability of the chosen username (usernames have to be unique)
    username = username.toLowerCase();
    let profileExists = await Profile.findOne({ username });
    if (profileExists) {
      return res
        .status(400)
        .json({ errors: [{ message: 'Username already exists' }] });
    }
    // Create the new profile
    const profile = new Profile({ userID, name, username, bio });
    await profile.save();
    currentUser.hasProfile=true;
    await currentUser.save();
    console.log(name);
    res.json({ msg: 'Profile created successfully!' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH api/profiles
// @desc    Edit Profile Information
// @access  Private

router.patch('/', auth, async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ userID: req.user.id });
    const oldName = userProfile.name;
    const oldUsername = userProfile.username;
    let { name, username, bio } = req.body;
    username = username.toLowerCase();
    if (oldUsername !== username) {
      //check if the new username is avaliable
      let profileExists = await Profile.findOne({ username });
      if (profileExists) {
        return res
          .status(400)
          .json({ errors: [{ message: 'Username already exists' }] });
      }
    }
    //if user name is avaliable
    userProfile.name = name;
    userProfile.bio = bio;
    userProfile.username = username;
    if (oldName !== name) {
      //Update name in user's document
      const user = await User.findById(req.user.id);
      user.name = name;
      await user.save();
    }
    const updatedProfile = await userProfile.save();

    // send results
    res.json({ updated: updatedProfile });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles
// @desc    Get Profile Information
// @access  Public

router.get('/:username', async (req, res) => {
  try {
    let { username } = req.params;
    username = username.toLowerCase();
    console.log(username);
    const profile = await Profile.findOne({ username });
    if (!profile) {
      return res.status(400).json({
        errors: [{ message: 'the requested username does not exist' }],
      });
    } else {
      res.json({ profile });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/posts
// @desc    Get posts written by a specified username
// @access  Public

router.get('/:username/details', async (req, res) => {
  try {
    const { username } = req.params;
    console.log(username);
    const requestedUser = await Profile.findOne({ username }).select(-'userID');
    console.log(requestedUser.userID);
    const userPosts = await Post.find({ userID: requestedUser.userID });
    const userDetails={profile:requestedUser,userPosts}
    res.json({ userDetails });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/
// @desc    Get all profiles
// @access  Public

router.get('/allprofiles/get', async (req, res) => {
  try {
  
    const profiles = await Profile.find();
    console.log(profiles);
    res.json({ profiles });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profiles/user_id/posts
// @desc    Get user posts using ID
// @access  Private

router.get('/:user_id/allposts', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    // console.log(username);
    // const requestedUser = await Profile.findOne({ username });
    // console.log(requestedUser.userID);
    const userPosts = await Post.find({ userID: user_id}).sort({dateCreated:-1});
    res.json({ userPosts });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
