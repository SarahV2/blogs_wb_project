import React, { Component } from 'react';
import axios from 'axios';
import TempPost from '../posts/TempPost';
import { Redirect,Link } from 'react-router-dom';

export default class UserBlog extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      userID: '',
      username: '',
      userPosts: '',
      userProfile:'',
      invalidUsername: false,
    };
  }

  async componentDidMount() {
    const username = this.props.match.params.username;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    axios({
      method: 'get',
      url: `/api/profiles/${username}/details`,
      //data: { userID: this.state.userID },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({ userPosts: res.data.userDetails.userPosts,userProfile:res.data.userDetails.profile });
        console.log(res.data.userDetails.userPosts)
      })
      .catch((error) => {
        this.setState({ invalidUsername: true });
      });
    this.setState({ username, userID, isLoading: false });
  }
  render() {
    const { userPosts,userProfile } = this.state;
    if (userPosts&&userProfile) {
      console.log(userPosts);
      const postsList = userPosts.map((post) => (
        <TempPost key={post._id} currentPost={post} />
      ));
      return (
        <div class="s-content">

        <div class="column">

            <div id="main" class="s-content__main large-8 column">

          {/* <div class='row'> */}
          <h6 className='centered-text'>{userProfile.name}'s Blog</h6>
      {postsList.length>0?<div>{postsList}</div>:<h6 className='post-boxed centered-text colored'>Oops, It looks like {userProfile.name} does not have any posts yet. <br/>In the meantime, you can <Link to='/explore/blogs'>Browse</Link> other blogs</h6>}


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
    return <div>{this.state.invalidUsername?<h6 className='post-boxed centered-text colored'>The requested blog does not exist <br/><Link to='/explore/blogs'>Browse</Link> other blogs</h6>:<h3 className='centered-text'>Loading ...</h3>}</div>
    }
  }
}