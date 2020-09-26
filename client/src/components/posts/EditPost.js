import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { Redirect,Link } from 'react-router-dom'
//import {editPost} from '../../actions/post'
import { Form, Button, Alert } from 'react-bootstrap';

import axios from 'axios'

 class EditPost extends Component {
  constructor() {
    super();
    this.state = {
        title: '',
        body: '',
        currentPost:{},
        submitted: false,
        invalidPost:false,
        isLoading:true
    }
  }

    async componentDidMount(){
      try{
        const { post } = this.props.location.state;
        const userID = JSON.parse(localStorage.getItem('currentUserID'));

    //    if (post) {
          let currentPost = post;
         // if (currentPost) {
            console.log(currentPost);
            this.setState({currentPost,title:currentPost.title,body:currentPost.body,userID,isLoading:false})
      //    }
       // }
           // else{
           // this.setState({invalidPost:true,isLoading:false})
          
        
      }
    
      catch(error){
        this.setState({invalidPost:true,isLoading:false})
        //console.log(error)
      }
      //}}
        //console.log(this.props.location)
        
        //}
        // else{
        //   if(this.props.location==undefined){
        //     this.setState({invalidPost:true,isLoading:false})
        //   }
        // }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit=async(e)=>{
        e.preventDefault()
        const { title, body,currentPost } = this.state
        e.preventDefault();
        //console.log(postID);
        // await this.props.deletePost(postID);
        const userID = this.state.userID;
    
        axios({
          method: 'patch',
          url: `/api/posts/${currentPost._id}`,
          data: {
            userID,title,body
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            console.log(res);
            this.setState({
              submitted: true,
         
            });
            // window.location.href = '/';
          })
          .catch((error) => {
            console.log(error);
          });

    }

    render() {
        const { currentPost } = this.state;
        console.log(currentPost)
    if (!this.state.isLoading) {
      if(this.state.invalidPost){
        console.log(this.state.invalidPost)
        return <h6 className='post-boxed centered-text colored'>Looks like you followed an invalid link, navigate to <Link to='/home'>Home</Link></h6>

      }
      else{

    
        const { title, body, submitted } = this.state
        if (submitted) {
            return (<Redirect to='/home' />)
        }

        return (
            <div>
            <Form>
              <h4>Update Entry</h4>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type='text'
                  name='title'
                  placeholder="Post's title"
                  value={title}
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
                  value={body}
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
        )
    }
  }
    else{
    return <h1 className='centered-text'>Loading...</h1>
    }
}

}

export default EditPost;