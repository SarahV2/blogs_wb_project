import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import '../../App.css'
export class NavBar extends Component {
  state = {
    redirect: false,
    loggedIn: false,
  };
  componentDidMount() {
    let currentUser = localStorage.getItem('currentUserID');
    if (currentUser) {
      this.setState({
        loggedIn: true,
      });
    }
  }

  handleLogout = () => {
    localStorage.removeItem('currentUserID');
    localStorage.removeItem('currentName');
    localStorage.removeItem('hasProfile');

    this.setState({
      loggedIn: false,
    });
    window.location.href = '/';
  };
  render() {
    if (this.state.redirect) {
      return <Redirect to='/' />;
    }

    const { loggedIn } = this.state;
    const name = JSON.parse(localStorage.getItem('currentName'));

    return (
      <Navbar fixed='top' collapseOnSelect expand='lg' bg='dark' variant='dark'>
        <Navbar.Brand href='/home'>
          <img
            style={{ width: '150px' }}
            src={require('./../../images/logo.png')}
            alt='logo'
          />
          {/* <h6>Blogs</h6> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='/home'>Home</Nav.Link> 

           {loggedIn? <Nav.Link href='/posts/new'>New Entry</Nav.Link>:''}
            <Nav.Link href='/explore/blogs'>Explore</Nav.Link>
          </Nav>
          <Nav>
            {!loggedIn ? (
              <Nav.Link href='/login'>Login</Nav.Link>
            ) : (
              <Nav>
                <Nav.Link id='userName' disabled>
                  Hello, {name}
                </Nav.Link>
                <Nav.Link href='#' onClick={() => this.handleLogout()}>
                  Logout
                </Nav.Link>
              </Nav>
            )}

            {!loggedIn ? <Nav.Link href='/register'>Register</Nav.Link> : ''}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
