import axios from 'axios';

let errors;
export const createProfile = (username, bio, userID) => {
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
    window.location.href = '/home';
  });
};

export const addComment = (text, postID, userID) => {
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
      console.log(res.data);
      window.location.reload();
    })
    .catch((error) => {
      setErrors(error);
      console.log(errors);
    });
};

export const getErrors = () => {
  return errors;
};

const setErrors = (errorsList) => {
  errors = errorsList;
};

export const deleteComment = (commentID, postID, userID) => {
  axios({
    method: 'delete',
    url: `/api/posts/${postID}/comments/${commentID}`,
    data: {
      userID,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUserDetails = (username) => {
  axios({
    method: 'get',
    url: `/api/profiles/${username}/details`,
    //data: { userID: this.state.userID },
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    console.log(res.data);
  });
};

export const getAllProfiles = () => {
  axios({
    method: 'get',
    url: `/api/profiles/allprofiles/get`,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => {
    console.log(res.data);
    return res.data;
  });
};
