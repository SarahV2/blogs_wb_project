import React, { Component } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export default class ProfilesList extends Component {
  constructor() {
    super();
    this.state = { isLoading: true, profilesList: null, searchValue: '' };
  }
  componentDidMount() {
    axios({
      method: 'get',
      url: `/api/profiles/allprofiles/get`,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      console.log(res.data);
      this.setState({ profilesList: res.data.profiles, isLoading: false });
    });
  }
  handleChange = (e) => {
    console.log(e.target.value);

    this.setState({
      searchValue: e.target.value,
    });
  };

  render() {
    if (!this.state.isLoading) {
      const { profilesList } = this.state;
      const filteredList = profilesList.filter(
        (profile) =>
          profile.bio.includes(this.state.searchValue) ||
          profile.username.includes(this.state.searchValue)
      );

      const displayProfiles = filteredList.map((profile) => {
        return (
          <li class='depth-1 comment boxed-profile'>
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
                  <Link to={`/blog/${profile.username}`} rel='category tag'>
                    {profile.name}
                  </Link>
                </div>
              </div>

              <div class='comment__text'>
                <p>{profile.bio}</p>
              </div>
            </div>
          </li>
        );
      });
      return (
        <div class=''>

          <div id=''>
            <h3 className='centered-text'>
              {displayProfiles.length} Blogger{displayProfiles.length==1?'':'s'} On Board
            </h3>
            <Form>
            {/* <h4 className='centered-text'>Search For a blogger</h4> */}
            <Form.Group>
              {/* <Form.Label>Title</Form.Label> */}
              <Form.Control
                type='text'
                name='searchValue'
                value={this.state.searchValue}
                placeholder='🔍 Search for keywords in bio or via username'
                required
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Group>
          </Form>
            <ol class='commentlist'>{displayProfiles}</ol>
          </div>
        </div>
      );
    } else {
      return <h4 className='centered-text'>Loading...</h4>;
    }
  }
}
