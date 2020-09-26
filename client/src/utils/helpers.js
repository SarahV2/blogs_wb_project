import axios from 'axios';

export const toggleLike=(postID,userID)=>{
    axios({
        method: 'patch',
        url: `/api/posts/${postID}/likes`,
        data: {
          userID,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(res);
            return;
          // window.location.href = '/';
        })
        .catch((error) => {
          console.log(error);
        });
}