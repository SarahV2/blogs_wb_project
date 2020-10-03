import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
//import { createProfile } from '../../utils/api';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
export default class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      bio: '',
      //userID: '',
      redirect: false,
      showAlerts: false,
      errorMessages: [],
      isLoading: true,
      isAuthenticated: false,
      hasProfile: false,
      showAlerts: false,
      errorMessages: [],
    };
  }

  componentDidMount() {
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const profileExists = JSON.parse(localStorage.getItem('hasProfile'));
    let isAuthenticated;
    if (userID) {
      isAuthenticated = true;
    }
    let hasProfile;
    if (profileExists) {
      hasProfile = true;
    }
    this.setState({
      hasProfile,
      isAuthenticated,
      isLoading:false,
      currentUser: userID,
    });
  }

  toggleAlert = () => {
    this.setState({
      showAlerts: true,
    });
  };
  handleClick = async (e) => {
    e.preventDefault();
    const { username, bio } = this.state;
    const userID = JSON.parse(localStorage.getItem('currentUserID'));
    const profile = { username, bio };
    console.log(profile);
    //await createProfile(username, bio, userID);

      axios({
        method: 'post',
        url: `/api/profiles/`,
        data: {
          username,
          bio,
          userID,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((res) => {
        console.log(res.data);
        localStorage.setItem('hasProfile', true);
       // this.setState({ redirect: true });
        window.location.href = '/home';
      }).catch((error)=>{
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
      })
    };

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  toggleAlert = () => {
    this.setState({
      showAlerts: true,
    });
  };
  render() {
    const { redirect,isAuthenticated } = this.state;
    if (redirect||(!isAuthenticated)) {
      return <Redirect to='/home' />;
    }
    if(!this.state.isLoading){
      if(this.state.isAuthenticated){
        if(this.state.hasProfile){
         // return <Redirect to='/home' />;
         window.location.href='/home'
        }
      }
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
          {showAlerts ? <div id='alerts-container'>{alerts}</div> : ''}
          <h6>To start blogging, you'll need to set up your profile first</h6>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              name='username'
              placeholder='Preffered username'
              required
              onChange={(e) => this.handleChange(e)}
            />
          </Form.Group>

          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Bio</Form.Label>
            <Form.Control
              type='text'
              name='bio'
              placeholder='Tell us about yourself'
              required
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
          <br />
        </Form>
      </div>
    );
  }
}
