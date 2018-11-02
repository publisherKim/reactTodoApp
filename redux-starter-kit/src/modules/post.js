import { handleActions, createAction } from 'redux-actions';
import axios from 'axios';

// postId를 파라미터로 전달하여 요청하는 함수
function getPostAPI(postId) {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

// 액션 타입: 시작 성공 실패
const GET_POST_PENDING = 'GET_POST_PENDING';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';

// 액션 생성 함수: 시작 성공 실패
const getPostPending = createAction(GET_POST_PENDING);
const getPostSuccess = createAction(GET_POST_SUCCESS);
const getPostFailure = createAction(GET_POST_FAILURE);

// thunk를 만들어 요청 상태에 따라 액션을 디스패치
export const getPost = (postId) => dispatch => {
  // 요청 시작을 알림
  dispatch(getPostPending());

  // 요청을 시작, promise를 return 해야 나중에 컴포넌트에서 호출할 때 getPost().then(...) 사용가능
  return getPostAPI(postId).then( (response) => {
    // 요청 성공시 서버 응답 내용을 payload로 설정하여 GET_POST_SUCCESS 액션을 디스패치
    dispatch(getPostSuccess(response));
    // 나중에 getPostAPI.then을 했을 때 then에 전달하는 함수에서 response에 접근 가능
    return response;
  }).catch(error => {
    // 오류가 발생하면 오류 내용을 payload로 설정하여 GET_POST_FAILURE 액션을 디스패치
    dispatch(getPostFailure(error));
    // error를 throw하여 이 함수를 실행한 후 다시 한 번 cache를 할 수 있게 한다.
    throw(error);
  })
};

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