import React, { Component, Fragment } from 'react';
// import Post from '../posts/Post';
import { Card } from 'react-bootstrap';
import { Redirect,Link } from 'react-router-dom';
import axios from 'axios';
import PostsList from '../posts/PostsList';
import Post from '../posts/Post';
import '../../Posts.css';
import Login from '../auth/Login';
import TempPost from '../posts/TempPost';

class MyBlog extends Component {
  state = {
    userPosts: null,
    currentUser: '',
    isLoading: true,
  };

  componentDidMount() {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    console.log('my blog')
    if (userID) {
      axios({
        method: 'get',
        url: `/api/profiles/${userID}/allposts`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          userID,
        },
      }).then((res) => {
        console.log(res.data);
        this.setState({
          userPosts: res.data.userPosts,
          currentUser: userID,
          isLoading: false,
        });
      });
    }
  }

  render() {

    //}
    const { userPosts } = this.state;
    if (userPosts) {
      console.log(userPosts);
      const postsList = userPosts.map((post) => (
        <TempPost key={post._id} currentPost={post} />
      ));
      return (
        <div class="s-content">

        <div class="column">

            <div id="main" class="s-content__main large-8 column">

          {/* <div class='row'> */}
          <h6 className='centered-text'>My Blog</h6>
          {postsList.length>0?<div>{postsList}</div>:<h6 className='post-boxed colored'>You don't have any blog entries yet, start <Link to='/posts/new'>Blogging</Link> today!</h6>}

          {/* </div> */}
        </div>
        </div>
        </div>
        // <Fragment>
        //   <h1 className='large text-primary'>Posts</h1>
        //   <p className='lead'>
        //     <i className='fas fa-user' /> Welcome to the community
        //   </p>
        //   <div className='posts'>
        //     {/* <h2 style={{ margin: '20px' }}>Posts </h2> */}
        //     {postsList}
        //     {/* {userPosts.map((post) => (
        //       <Post key={post._id} currentPost={post} />
        //     ))} */}
        //   </div>
        // </Fragment>
      );
    } else {
      return <h3 className='centered-text'>Loading ...</h3>
    }
  }
}

export default MyBlog;
//export default connect()(UserBlog);
