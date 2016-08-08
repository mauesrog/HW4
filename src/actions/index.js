import axios from 'axios';

const ROOT_URL = 'https://cs52-blog.herokuapp.com/api';
const API_KEY = '?key=m_esquivelrogel';

export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
};

export function fetchPosts(updated) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts${API_KEY}`)
    .then(response => {
      const payload = {
        all: [],
        message: '',
        validated: false,
        updated,
      };

      if (!response.data[0]) {
        payload.message = 'No posts available';
      } else {
        payload.all = response.data;
        payload.validated = true;
      }

      dispatch({ type: 'FETCH_POSTS', payload });
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function fetchPost(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)
    .then(response => {
      const payload = {
        post: null,
      };

      if (response.data) {
        payload.post = response.data;
      }

      dispatch({ type: 'FETCH_POST', payload });
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function createPost(post) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts${API_KEY}`, post)
    .then(response => {
      dispatch({ type: 'CREATE_POST', response });
      fetchPosts(false)(dispatch);
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function updatePost(id, put) {
  return (dispatch) => {
    axios.put(`${ROOT_URL}/posts/${id}${API_KEY}`, put)
    .then(response => {
      dispatch({ type: 'UPDATE_POST', response });
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function deletePost(id) {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${id}${API_KEY}`)
    .then(response => {
      dispatch({ type: 'DELETE_POST', response });
      fetchPosts(false)(dispatch);
    })
    .catch(error => {
      console.log(error);
    });
  };
}
