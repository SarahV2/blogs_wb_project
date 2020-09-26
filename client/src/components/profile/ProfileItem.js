import React, { Component } from 'react';
import {Link} from 'react-router-dom'
export default class ProfileItem extends Component {
  constructor() {
    super();
    this.state = { isLoading: true, currentProfile: '' };
  }

  componentDidMount() {
    let profile = this.props.currentProfile;
    this.setState({ currentProfile: profile, isLoading: false });
  }
  render() {
    if (!this.state.isLoading) {
        const {currentProfile}=this.state
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
                  <Link
                    to={`/blog/${currentProfile.username}`}
                    rel='category tag'
                  >
                    {currentProfile.name}
                  </Link>
                </div>

              </div>

              <div class='comment__text'>
                <p>{currentProfile.bio}</p>
              </div>
            </div>
          </li>
      );
    } else {
      return <h2>Loading ...</h2>;
    }
  }
}
