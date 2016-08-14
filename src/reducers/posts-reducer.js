import { ActionTypes } from '../actions';

const defualtPosts = {
  all: [],
  post: null,
  validated: false,
  message: '',
  updated: false,
  error: null,
};

function PostsReducer(state = defualtPosts, action) {
  switch (action.type) {
    case ActionTypes.FETCH_POST:
      if (action.payload) {
        return Object.assign({}, state, {
          post: action.payload.post,
        });
      }

      return state;
    case ActionTypes.FETCH_POSTS:
      if (action.payload) {
        return Object.assign({}, state, {
          all: action.payload.all,
          message: action.payload.message,
          validated: action.payload.validated,
          updated: action.payload.updated,
          user: action.payload.user,
        });
      }

      return state;
    case ActionTypes.CREATE_POST:
      if (action.error) {
        return Object.assign({}, state, {
          error: action.error,
        });
      }
      return state;

    case ActionTypes.UPDATE_POST:
      return Object.assign({}, state, {
        updated: true,
      });

    case ActionTypes.CLEAR_POSTS:
      return state;

    default:
      return state;
  }
}

export default PostsReducer;
