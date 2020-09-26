import React, { Component } from 'react';
import moment from 'moment';
import { Link, Redirect } from 'react-router-dom';
import { toggleLike } from '../../utils/helpers';

export default class TempPost extends Component {
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

  handleToggleLike = async (e) => {
    const { post, userID, alreadyLiked } = this.state;
    e.preventDefault();
    await toggleLike(post._id, userID);
    console.log('Liked!');
    this.setState({ alreadyLiked: !alreadyLiked });
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
        <li class='comment post-boxed'>
            
          <div class='comment__content'>
              
            <div class='comment__info'>
              <div class='comment__author'>
              <i class="fas fa-feather feather-icon"></i> <Link to={`/post/${post._id}`}>{post.title}</Link>
              </div>

              <div class='comment__meta'>
                <div class='comment__time'>
                  {moment(post.dateCreated).format('DD MMMM YYYY')}
                </div>
              </div>
            </div>

            <div class='comment__text'>
              <p>{post.body}</p>
               <span>{alreadyLiked == false ? (
            
                <i onClick={this.handleToggleLike} class='far fa-heart like-icon not-liked' />
              ) : (
                <i onClick={this.handleToggleLike} class='fas fa-heart like-icon liked'></i>
              )}</span>
            </div>
          </div>
        </li>
      );
    } else {
      return <h3 className='centered-text'>Loading ... </h3>;
    }
  }
}
