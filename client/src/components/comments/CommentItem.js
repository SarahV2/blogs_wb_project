import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../utils/api';

export default class CommentItem extends Component {
  constructor() {
    super();
    this.state = { isLoading: true, isAuthenticated: false,currentComment:'' };
  }

  componentDidMount() {
    let comment = this.props.currentComment;
    let author = this.props.authorID;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    let authenticated;
    if (userID == comment.userID || userID == author) {
      authenticated = true;
    }
    if (comment) {
      this.setState({
        currentComment: comment,
        isAuthenticated: authenticated,
        isLoading: false,
      });
      console.log(comment);
    } else {
      console.log('waiting');
    }
  }

  handleDelete = async(e) => {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const {currentComment}=this.state;
    await deleteComment(currentComment._id,currentComment.postID,userID)

  };
  render() {
    if (!this.state.isLoading) {
      let { currentComment, isAuthenticated } = this.state;

      console.log(currentComment);
      const { text } = currentComment;
      console.log(text);
      return (
        <li class='depth-1 comment'>
          <div class='comment__avatar'>
            <img
              class='avatar'
              src='https://immedilet-invest.com/wp-content/uploads/2016/01/user-placeholder.jpg'
              alt=''
              width='50'
              height='50'
            />
          </div>

          <div class='comment__content'>
            <div class='comment__info'>
              <div class='comment__author'>
                <Link
                  to={`/blog/${currentComment.username}`}
                  rel='category tag'
                >
                  {currentComment.author}
                </Link>
                {'  '} {isAuthenticated ? <i className=' delete-icon fas fa-trash-alt' onClick={this.handleDelete}></i> : ''}
              </div>

              <div class='comment__meta'>
                <div class='comment__time'>
                  {moment(currentComment.dateCreated).format('DD MMMM YYYY')}
                </div>
              </div>
            </div>

            <div class='comment__text'>
              <p>{currentComment.text}</p>
            </div>
          </div>
        </li>
      );
    } else {
      return <h3 className='centered-text'>Loading ... </h3>;
    }
  }
}
