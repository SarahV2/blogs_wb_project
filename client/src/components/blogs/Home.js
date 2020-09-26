import React, { Component, Fragment } from 'react';
// import Post from '../posts/Post';
import { Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PostsList from '../posts/PostsList';
import Post from '../posts/Post';
import '../../Posts.css';
import MyBlog from './MyBlog';
import CreateProfile from '../profile/CreateProfile';
import Login from '../auth/Login';

class Home extends Component {
  constructor() {
    super();
    this.state = {
    userPosts: null,
    currentUser: '',
    hasProfile: false,
    isAuthenticated:false,
    isLoading:true
  }
}
  componentDidMount() {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const hasProfile = JSON.parse(localStorage.getItem('hasProfile'));
    let isAuthenticated
    if(userID){
      isAuthenticated=true
    }
    this.setState({
      hasProfile,
      isAuthenticated,
      currentUser: userID,
      isLoading:false
    });
  }

  render() {
    if (!this.state.isLoading) {
      if (!this.state.currentUser) {
        return <Login/>;
      }
    }
    const { hasProfile } = this.state;

    return <div>{hasProfile ? <MyBlog /> : <CreateProfile />}</div>;
  }
}

export default Home;
