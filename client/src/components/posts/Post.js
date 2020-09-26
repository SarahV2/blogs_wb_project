import React, { Component } from 'react';
import moment from 'moment';
import { Redirect, Link } from 'react-router-dom';
import '../../Posts.css';
import '../../Blog.css';
import { toggleLike } from '../../utils/helpers';

export default class Post extends Component {
  state = {
    post: {},
    redirect: false,
    post: '',
    userID: '',
    alreadyLiked: false,
  };
  componentDidMount() {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const alreadyLiked = this.props.currentPost.likes.filter(
      (o) => o.user === userID
    );
    console.log(alreadyLiked);
    if (alreadyLiked.length > 0) {
      this.setState({ alreadyLiked: true });
    }
    this.setState({ post: this.props.currentPost, userID });
  }
  handleClick = (e, id) => {
    e.preventDefault();
    console.log('clicked!');
    this.setState({
      chosenPostID: id,
      redirect: true,
    });
  };

  handleToggleLike = async(e) => {
      const{post,userID,alreadyLiked}=this.state
      e.preventDefault();
      await toggleLike(post._id,userID)
      console.log('Liked!')
      this.setState({alreadyLiked:!alreadyLiked})
  };
  render() {
    const { redirect } = this.state;

    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: `/view/${this.state.chosenPostID}`,
            state: { postID: this.state.chosenPostID },
          }}
        />
      );
    }
    const { post, userID, alreadyLiked } = this.state;
    if (post) {
      let likes = post.likes;
      console.log(likes);

      // const alreadyLiked = likes.filter((o) => o.user === userID);
      //  console.log(userID.toString());
      // console.log(likes[0].user)

      //  console.log(alreadyLiked);
      const avatar =
        'https://docs.atlassian.com/aui/9.0.0/docs/images/avatar-person.svg';
      return (
        <div  class=' boxed'>
          
          <article class=''>
            <header class='entry__header'>
              <h6 class='entry__title '>
                <Link to={`/post/${post._id}`}>{post.title}</Link>
              </h6>

              <div class='entry__meta'>
                <ul>
                  <li>
                    Posted On {moment(post.dateCreated).format('MMMM Do YYYY')}
                  </li>
                </ul>
              </div>
            </header>

            <div class='entry__content'>
              <p>{post.body}</p>
              {alreadyLiked == false ? (
            
                <i onClick={this.handleToggleLike} class='far fa-heart' />
              ) : (
                <i onClick={this.handleToggleLike} class='fas fa-heart'></i>
              )}
            </div>
          </article>
        </div>
      );
    } else {
      return <h1></h1>;
    }
  }
}
