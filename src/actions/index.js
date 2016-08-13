import axios from 'axios';

const ROOT_URL = 'https://maui-blog-auth.herokuapp.com/api';
// const ROOT_URL = 'http://localhost:9090/api';
const API_KEY = '?key=ha8f7an2387rh210fb10fbpq3bfa913r8';

export const ActionTypes = {
  FETCH_POSTS: 'FETCH_POSTS',
  FETCH_POST: 'FETCH_POST',
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  CLEAR_POSTS: 'CLEAR_POSTS',
  AUTH_USER: 'AUTH_USER',
  DEAUTH_USER: 'DEAUTH_USER',
  AUTH_ERROR: 'AUTH_ERROR',
  CLEAR_ERR: 'CLEAR_ERR',
};

// POST ACTIONS

export function fetchPosts(updated) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${API_KEY}`)
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

      dispatch({ type: ActionTypes.FETCH_POSTS, payload });
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

      dispatch({ type: ActionTypes.FETCH_POST, payload });
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function createPost(post) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/posts/${API_KEY}`, post)
    .then(response => {
      if (response.data.error) {
        dispatch({ type: ActionTypes.CREATE_POST, error: response.data.error });
      } else {
        dispatch({ type: ActionTypes.CREATE_POST, response });
        fetchPosts(false)(dispatch);
      }
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
      dispatch({ type: ActionTypes.UPDATE_POST, response });
      if (typeof put.tags !== 'undefined') {
        fetchPost(id)(dispatch);
      }
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
      dispatch({ type: ActionTypes.DELETE_POST, response });
      fetchPosts(true)(dispatch);
    })
    .catch(error => {
      console.log(error);
    });
  };
}

export function clearPosts() {
  return (dispatch) => {
    axios.delete(`${ROOT_URL}/posts/${API_KEY}`)
    .then(response => {
      dispatch({ type: ActionTypes.CLEAR_POSTS, response });
      fetchPosts(true)(dispatch);
    })
    .catch(error => {
      console.log(error);
    });
  };
}

// USER ACTIONS

export function fetchUserData(id) {
  return (dispatch) => {
    axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)
    .then(response => {
      const payload = {
        user: null,
      };

      if (response.data) {
        payload.user = response.user;
      }

      dispatch({ type: ActionTypes.FETCH_USER_DATA, payload });
    })
    .catch(error => {
      console.log(error);
    });
  };
}


export function signupUser(user) {
  return (dispatch) => {
    axios.post(`${ROOT_URL}/signup`, user)
    .then(response => {
      console.log(response);
      if (response.data.error) {
        dispatch(authError(`Sign Up Failed: ${response.data.error.errmsg}`));
      } else {
        const token = response.data.token;

        localStorage.setItem('token', token);
        console.log(token);
        dispatch({ type: ActionTypes.AUTH_USER });
      }
    })
    .catch(error => {
      dispatch(authError(`Sign Up Failed: ${error}`));
    });
  };
}

export function clearError() {
  return (dispatch) => {
    dispatch({ type: ActionTypes.CLEAR_ERR });
  };
}

// trigger to deauth if there is error
// can also use in your error reducer if you have one to display an error message
export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    message: error,
  };
}
