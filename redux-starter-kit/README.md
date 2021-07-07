## redux-pender
```
  redux-pender Promise 기반 애션들을 관리하는 미들웨어가 포함된 라이브러리
  동작 결과
    - 액션 객체안에 payload가 Promise 형태라면 시작하기 전, 완료 또는 실패를 했을 때 뒤에 PENDING, SUCCESS, FAILURE 접미사를 붙임
  추가로 요청을 관리하는 리듀서가 포함되어 있고 요청 관리 액션들을 처리하는 액션 핸들러 함수들을 자동으로 만드는 도구도 제공
  요청중인 액션도 취소 가능
```
## 설치와 적용
```
  yarn add redux -pender
```

## 리듀서의 상태구조
```javascript
  //  basic
  {
    pending: {},
    success: {}
    failure: {}
  }
  // dispatch after 1
  {
    pending: {
      'ACTION_NAME': true
    },
    success: {
      'ACTION_NAME': false
    },
    failure: {
      'ACTION_NAME': false
    }
  }
  // dispatch after 2
  {
    pending: {
      'ACTION_NAME': false
    },
    success: {
      'ACTION_NAME': true
    },
    failure: {
      'ACTION_NAME': false
    }
  }
  // dispatch after 3
  {
    pending: {
      'ACTION_NAME': false
    },
    success: {
      'ACTION_NAME': false
    },
    failure: {
      'ACTION_NAME': true
    }
  }
  // 자동으로 처리 되기때문에 따로 관리해줄 필요가 없다.
```

## 비동기 작업을 여러개 관리할 경우
```javascript
import { handleActions, createAction } from 'redux-actions';
import { pender, applyPenders } from 'redux-pender';
import axios from 'axios';

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
  // 다른 일반 액션들을 관리
}, initalState);

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
    }
  },
  /*
    다른 pender 액션들
    {type: GET_SOMETHING, onSuccess: (state, action) => ...},
    {type: GET_SOMETHING, onSuccess: (state, action) => ...}
  */
]);
  /*
    applyPenders 함수를 사용할 때 첫 번째 파라미터에는 일반 리류서를 넣어주고, 두번째 파라미터에는에는 pendder 관련 객들을 배열 형태로 작성
  */
```

## 요청 취소
```
  리덕스 펜더를 사용이 Promise기반 액션 을 아주 쉽게 취소가 가능하다.
  Promise 기반 액션을 디스패치하고 나면 cancel 함수가 포함된 Promise를 반환함.
  이 cancel 함수를 호출하면 미들웨어가 해당 요청을 더 이상 처리하지 않음.
```