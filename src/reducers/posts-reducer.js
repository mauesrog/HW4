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
      return state;
    case ActionTypes.FETCH_POSTS:
      console.log(action);
      if (action.payload) {
        return action.payload;
      }

      return state;
    case ActionTypes.CREATE_POST:
      console.log(action);
      return action;
    default:
      return state;
  }
}

export default PostsReducer;
