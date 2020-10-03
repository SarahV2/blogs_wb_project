import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
// import {addPost} from '../../actions/post'
import { Form, Button, Alert } from 'react-bootstrap';

import axios from 'axios';

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      body: '',
      submitted: false,
      isLoading: true,
      userID: null,
      isAuthenticated: false,
      showAlerts: false,
      errorMessages: [],
    };
  }

  componentDidMount() {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    if (userID) {
      this.setState({
        userID,
        isAuthenticated: true,
        isLoading: false,
      });
    }
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
  handleSubmit = (e) => {
    e.preventDefault();
    const { title, body, userID } = this.state;

    console.log({ 'new post': { title, body } });
    // await this.props.addPost(title, body)
    // this.setState({
    //     submitted: true
    // })

    axios({
      method: 'post',
      url: `/api/posts/`,
      data: {
        title,
        body,
        userID,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res.data);
        this.setState({
          submitted: true,
        });
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
    const userID = JSON.parse(localStorage.getItem('currentUserID'));

    const hasProfile = JSON.parse(localStorage.getItem('hasProfile'));

    // if (!this.state.isAuthenticated) {
    if (!userID) {
      return <Redirect to='/login' />;
      // }
    }
    if (!hasProfile) {
      return <Redirect to='/profiles/new' />;
    }
    const { title, body, submitted } = this.state;
    if (submitted) {
      return <Redirect to='/home' />;
    }

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
      <div>
        <Form>
         
          <h4>Add a New Entry</h4>
          {showAlerts ? <div id='alerts-container'>{alerts}</div> : ''}
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              name='title'
              placeholder="Post's title"
              required
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Body</Form.Label>
            <Form.Control
              type='text'
              name='body'
              placeholder='Tell us more about it'
              required
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>

          <div id='submit-button'>
            <Button
              onClick={(e) => this.handleSubmit(e)}
              variant='light'
              type='submit'
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}
export default NewPost;
