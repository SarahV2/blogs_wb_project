import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { addComment } from '../../utils/api';
export default class CommentForm extends Component {
  constructor() {
    super();
    this.state = { isLoading: true, text: '', postID: '' };
  }
  componentDidMount() {
    let currentPost = this.props.targetPostID;
    console.log(currentPost);
    this.setState({
      postID: currentPost,
    });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleClick = async (e) => {
    e.preventDefault();
    const { text, postID } = this.state;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    if (!userID) {
      window.location.href = '/login';
    }
    await addComment(text, postID, userID);
    console.log(postID);
  };

  render() {
    return (
      <div class='comment-respond'>
        <div id='respond'>
          <h3>Add Comment </h3>

          <Form>
            <Form.Group>
              <Form.Control
                type='text'
                name='text'
                placeholder='Say something about this blog entry'
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
            <div id='submit-button'>
              <Button
                onClick={(e) => this.handleClick(e)}
                variant='light'
                type='submit'
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
