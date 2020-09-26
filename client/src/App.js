import React, { Component, Fragment } from 'react';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
import './Blog.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/blogs/Home';
import PostsList from './components/posts/PostsList';
import PostDetails from './components/posts/PostDetails';
import NewPost from './components/posts/NewPost';
import EditPost from './components/posts/EditPost';
import CreateProfile from './components/profile/CreateProfile';
import ProfilesList from './components/profile/ProfilesList';
import UserBlog from './components/blogs/UserBlog';
import NotFound from './components/layout/NotFound';
import Main from './components/blogs/Main';
import Footer from './components/layout/Footer';


const App = () => {
  return (
    <div className='App'>
      <Router>
        <NavBar />
        <Fragment>
          <section className='container'>
            <Switch>
              <Route exact path='/' component={Main} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/posts/new' component={NewPost} />
              <Route path='/edit' component={EditPost} />
              <Route path='/home' component={Home} />
              <Route path='/profiles/new' component={CreateProfile} />
              <Route path='/blog/:username' component={UserBlog} />
              <Route path='/explore/blogs' component={ProfilesList} />
              <Route path='/list' component={PostsList} />
              <Route path='/post/:id' component={PostDetails} />
              <Route component={NotFound} />

            </Switch>
          </section>
          <Footer/>
        </Fragment>
      </Router>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
