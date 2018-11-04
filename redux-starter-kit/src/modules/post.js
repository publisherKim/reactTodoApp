import { handleActions, createAction } from 'redux-actions';
import { applyPenders } from 'redux-pender';
import axios from 'axios';

// postId를 파라미터로 전달하여 요청하는 함수
function getPostAPI(postId) {
  return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}

// 액션 타입: 시작 성공 실패
const GET_POST = 'GET_POST';

/* 
  createAction을 통해 생성 두번째 파라미터는 Promise를 반환하는 함수
  (type, fn => Promise)
*/
export const getPost = createAction(GET_POST, getPostAPI);

const initialState = {
  data: {
    title: '',
    body: ''
  }
};
const reducer = handleActions({

}, initialState)
export default applyPenders(reducer, [
  {
    type: GET_POST,
    onSuccess: (state, action) => {
      const {title, body} = action.payload.data;
      return {
        data: {
          title,
          body
        }
      }
    },
    onCancel: (state, action) => {
      return {
        data: {
          title: '취소됨',
          body: '취소됨'
        }
      }
    }
  }
]);