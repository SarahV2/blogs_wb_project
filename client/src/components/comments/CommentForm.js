import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
export default class CommentForm extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      text: '',
      postID: '',
      showAlerts: false,
      errorMessages: [],
    };
  }
  componentDidMount() {
    let currentPost = this.props.targetPostID;
    console.log(currentPost);
    this.setState({
      postID: currentPost,
    });
  }
  toggleAlert = () => {
    this.setState({
      showAlerts: true,
    });
  };
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleClick = async (e) => {
    e.preventDefault();
    const { text, postID } = this.state;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const hasProfile=JSON.parse(localStorage.getItem('hasProfile'));
    if (!userID) {
      window.location.href = '/login';
    }
    if(!hasProfile){
      window.location.href = '/profiles/new';
    }

    axios({
      method: 'post',
      url: `/api/posts/${postID}/comments`,
      data: {
        userID,
        text,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        window.location.reload();

        //return res;
        //window.location.reload();
      })
      .catch((error) => {
        this.toggleAlert();
        console.log(error.response);
        const errors = error.response.data.errors;
        let errorsList = [];
        errors.map((error) => {
          errorsList.push(error.msg);
          console.log(error.msg);
        });

        this.setState({
          errorMessages: errorsList,
        });
      });
  };

  render() {
    const { showAlerts, errorMessages } = this.state;
    let alerts;
    if (errorMessages) {
      alerts = errorMessages.map((error, index) => (
        <Alert key={index} variant='danger'>
          {error}
        </Alert>
      ));
    }
    return (
      <div class='comment-respond'>
        <div id='respond'>
          <h3>Add Comment </h3>
          <Form>
            <Form.Group>
              {showAlerts ? <div id='alerts-container'>{alerts}</div> : ''}

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
