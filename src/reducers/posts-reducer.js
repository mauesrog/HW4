import { ActionTypes } from '../actions';

const defualtPosts = {
  all: [],
  post: null,
  validated: false,
  message: '',
};

function PostsReducer(state = defualtPosts, action) {
  switch (action.type) {
    case ActionTypes.FETCH_POST:
      if (action.payload) {
        console.log(state);
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
        });
      }

      return state;
    case ActionTypes.CREATE_POST:
      return state;
    default:
      return state;
  }
}

export default PostsReducer;
