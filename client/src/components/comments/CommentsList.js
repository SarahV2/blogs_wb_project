import React, { Component } from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

export default class CommentsList extends Component {
  constructor() {
    super();
    this.state = { isLoading: true, commentsList: null, currentPost: '',authorID:'' };
  }

  componentDidMount() {
    let commentsList = this.props.postComments;
    let currentPost=this.props.currentPost
    let authorID=this.props.postAuthorID
    //const currentPost = JSON.parse(localStorage.getItem('currentPost'));
    // let commentsList = currentPost.comments;
    // this.setState({ commentsList, currentPost });
    this.setState({ commentsList,authorID, currentPost,isLoading: false, });
  }
  render() {
    let { commentsList, currentPost ,authorID} = this.state;
    if (!this.state.isLoading) {
      let comments = commentsList.map((comment) => {
        return <CommentItem currentComment={comment} authorID={authorID}  />;
      });
      return (
        <div>
          <div class='comments-wrap'>
            <div id='comments'>
              <h3>
                {commentsList.length} Comment
                {commentsList.length == 1 ? '' : 's'}
              </h3>

              <ol class='commentlist'>{comments}</ol>
            </div>

            <CommentForm targetPostID={currentPost} />
          </div>
        </div>
      );
    } else {
      return <h3 className='centered-text'>Loading...</h3>;
    }
  }
}
