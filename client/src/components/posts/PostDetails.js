import React, { Component } from 'react';
import moment from 'moment';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
// import NewComment from '../comments/NewComment';
// import Comment from '../comments/Comment';
import { Button } from 'react-bootstrap';
import { toggleLike } from '../../utils/helpers';
import CommentsList from '../comments/CommentsList';
class PostDetails extends Component {
  constructor() {
    super();
    this.state = {
      post: {},
      redirect: false,
      redirectPath: '',
      userID: '',
      alreadyLiked: false,
      isLoading:true,
      invalidPost:false
    };
  }
  componentWillUnmount() {
    // localStorage.removeItem('currentPost');
  }
  async componentDidMount() {
    const postID = this.props.match.params.id;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));

    axios({
      method: 'get',
      url: `/api/posts/${postID}`,
      data: { userID: this.state.userID },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      console.log(res.data);
    //  localStorage.setItem('currentPost', JSON.stringify(res.data));

      this.setState({
        post: res.data,
        isLoading:false,
        userID,
      });
      const alreadyLiked = this.state.post.likes.filter(
        (o) => o.user === userID
      );
      if (alreadyLiked.length > 0) {
        this.setState({
          alreadyLiked: true,
        });
      }
    }).catch((error)=>{
      this.setState({invalidPost:true})
    })
  }

  handleToggleLike = async (e) => {
    const { post, userID, alreadyLiked } = this.state;
    e.preventDefault();
    await toggleLike(post._id, userID);
    console.log('Liked!');
    this.setState({ alreadyLiked: !alreadyLiked });
  };

  handleDelete = (e, postID) => {
    e.preventDefault();
    //console.log(postID);
    // await this.props.deletePost(postID);
    const userID = this.state.userID;

    axios({
      method: 'delete',
      url: `/api/posts/${postID}`,
      data: {
        userID,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          redirect: true,
          redirectPath: '/home',
        });
        // window.location.href = '/';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleEdit = async (e) => {
    e.preventDefault();
    this.setState({
      redirect: true,
      redirectPath: '/edit',
    });
  };
  render() {
    const placeholderImg =
      'https://blog.holosophic.org/wp-content/uploads/2018/05/Countries-page-image-placeholder-800x500.jpg';
    const { redirect, redirectPath } = this.state;
    if (redirect) {
      return <Redirect to={redirectPath} />;
    }
    if (!this.state.isLoading) {
      let { post, userID, alreadyLiked } = this.state;

      let currentPost = post;
      if (currentPost) {
        // console.log(currentPost.likes);
        // let likes = currentPost.likes;
        // const isObjectPresent = likes.find((like) => like.user == userID);
        // console.log(isObjectPresent);
        // const comments=currentPost.comments.map(comment=>{
        //   return  <Comment key={comment._id} currentComment={comment}/>
        // })
        // let { isAuthenticated, currentUser } = this.props;

        return (
          <div>
            <article class='entry'>
              <header class='entry__header'>
                <h2 class='entry__title h1'>{currentPost.title}</h2>

                <div class='entry__meta'>
                  <ul>
                    <li>
                      {moment(currentPost.dateCreated).format('MMMM Do YYYY')}
                    </li>
                    <li>
                      {' '}
                      Posted By{' '}
                      <Link
                        to={`/blog/${currentPost.username}`}
                        rel='category tag'
                      >
                        {currentPost.author}
                      </Link>
                    </li>
                  </ul>
                </div>
              </header>
              <div class='entry__content-media'>
                <img
                  src={placeholderImg}
                  sizes='(max-width: 1000px) 100vw, 1000px'
                  alt=''
                />
              </div>
              <div class='entry__content'>
                <p class='lead'>{currentPost.body}</p>
              </div>
             
              {userID == post.userID ? (
                <div>
                   {alreadyLiked === true ? (
                <i onClick={this.handleToggleLike} class='fas fa-heart like-icon liked separate' />
              ) : (
                <i onClick={this.handleToggleLike} class='far fa-heart like-icon not-liked separate'></i>
              )}
                  <Link
                    to={{
                      pathname: '/edit',
                      state: {
                        post,
                      },
                    }}
                  >
                    <Button variant='info'>Edit</Button>
                  </Link>{' '}
                  <Button
                    onClick={(e) => this.handleDelete(e, this.state.post._id)}
                    variant='danger'
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                ''
              )}
            </article>
            <CommentsList currentPost={currentPost._id}postComments={currentPost.comments} postAuthorID={currentPost.userID} />
          </div>
        );
      } else {
        return <h3 className='centered-text'>Sorry,the requested post does not exists</h3>;
      }
    } else {
      return <div>{this.state.invalidPost?<h4 className='centered-text'>Sorry,the requested post does not exists</h4>:<h4 className='centered-text'>Loading ...</h4>}</div>
    }
  }
}

export default PostDetails;
