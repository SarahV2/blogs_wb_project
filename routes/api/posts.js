const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const Profile = require('../../models/Profile');

const auth = require('../../middleware/auth');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private

router.post('/', async (req, res) => {
  try {
    //const userID = req.user.id;
    //const { title, body } = req.body;
    const { title, body, userID } = req.body;
    const userProfile = await Profile.findOne({ userID });
    console.log(userProfile);
    const { name, username } = userProfile;
    const newPost = new Post({
      userID,
      title,
      body,
      author: name,
      username,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PATCH api/posts/post_id
// @desc    Update an existing post by its author
// @access  Private

router.patch('/:post_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    //console.log('written by')
    //console.log(post.userID);
    const { userID } = req.body;

    if (post.userID.toString() !== userID) {
      return res
        .status(403)
        .send({ error: 'sorry you are not authorized to update this post!' });
    }
    const { title, body } = req.body;
    post.title = title;
    post.body = body;
    post.dateUpdated = Date.now();
    const updatedPost = await post.save();
    res.json({ updatedPost });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/post_id
// @desc    Get an existing post
// @access  Public

router.get('/:post_id', async (req, res) => {
  try {
    let post = await Post.findById(req.params.post_id).populate({
      path: 'comments',
    });
    console.log('got your post');
    //await post.populate({path: 'comments'}).execPopulate();
    if (!post) {
      return res.json({ error: 'the requested post does not exist!' });
    }
    res.json(post);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/post_id
// @desc    Delete an existing post
// @access  Private

router.delete('/:post_id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.json({ error: 'the requested post does not exist!' });
    }
    //console.log(req.user.id);
    const { userID } = req.body;
    console.log(post.userID);
    console.log(userID);
    if (post.userID != userID) {
      return res.json({
        error: 'sorry you are not authorized to delete this post!',
      });
    }
    // check if the post contains any comments
    if (post.comments.length > 0) {
      for (let i = 0; i < post.comments.length; i++) {
        await Comment.findByIdAndDelete(post.comments[i]);
      }
    }
    await post.delete();
    res.json({ message: 'post deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//---------------------------------- Likes and Comments -----------------------------

// @route   Patch api/posts/post_id/likes
// @desc    Add like to a post
// @access  Private

router.patch('/:post_id/likes', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.json({ error: 'the requested post does not exist!' });
    }
    const { userID } = req.body;

    // Check if the current user has already liked this post
    if (
      post.likes.filter((like) => like.user.toString() === userID).length > 0
    ) {
      //there's a like from that user
      //return res.status(400).json({ message: 'Post Already Liked' });
      //Get remove index
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(userID);

      post.likes.splice(removeIndex, 1);

      await post.save();
      res.json(post.likes);
    } else {
      post.likes.unshift({ user: userID });
      await post.save();
      res.json(post.likes);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/post_id/comments
// @desc    Get a single post's comments
// @access  Private

router.post('/:post_id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    //let userID = req.user.id;
    let { userID, text } = req.body;
    let postID = post.id;
    //let { text } = req.body;
    const userProfile = await Profile.findOne({ userID });
    console.log(userProfile);
    const { name, username } = userProfile;
    console.log(username)
    let comment = new Comment({ userID, postID, text, author: name, username });
    let newComment = await comment.save();
    post.comments.push(newComment);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/posts/post_id/comments/comment_id
// @desc    Delete a comment
// @access  Private

router.delete('/:post_id/comments/:comment_id',  async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    // check if the post exists
    if (!post) {
      return res.json({ error: 'the requested post does not exist!' });
    }
    const comment = await Comment.findById(req.params.comment_id);
    // check if the comment exists
    if (!comment) {
      return res.json({ error: 'the requested comment does not exist!' });
    }

    const {userID}=req.body
    // check if the user requesting the delete is either the author or the comment or the post itself
    if (!(comment.userID == userID || post.userID == userID)) {
      return res
        .status(403)
        .send({ error: "you're not authorized to delete this comment!" });
    }
    // get the index of the comment within the post's array of comments
    let index = post.comments.indexOf(comment._id);
    post.comments.splice(index, 1);
    // delete the comment from the array, as well as the DB collection
    await post.save();
    await comment.delete();
    res.json({ msg: 'comment deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
