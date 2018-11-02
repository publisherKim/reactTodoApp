import { handleActions } from 'redux-actions';
import axios from 'axios';

// postId를 파라미터로 전달하여 요청하는 함수
function getPostAPI(postId) {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

// 액션 타입: 시작 성공 실패
const GET_POST = 'GET_POST';
const GET_POST_PENDING = 'GET_POST_PENDING';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';

export const getPost = (postId) => ({
  type: GET_POST,
  payload: getPostAPI(postId)
});

const initialState = {
  pending: false,
  error: false,
  data: {
    title: '',
    body: ''
  }
};

export default handleActions({
  [GET_POST_PENDING]: (state, action) => {
    return {
      ...state,
      pending: true,
      error: false
    };
  },
  [GET_POST_SUCCESS]: (state, action) => {
    const {title, body} = action.payload.data;

    return {
      ...state,
      pending: false,
      data: {
        title,
        body
      }
    };
  },
  [GET_POST_FAILURE]: (state, action) => {
    return {
      ...state,
      pending: false,
      error: true
    }
  }
}, initialState);