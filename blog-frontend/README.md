# 21 프로젝트에서 API 연동
```
  21.1 포스트 작성
  21.2 포스트 보여 주기
  21.3 포스트 목록 보여 주기
  21.4 포스트 수정 및 삭제
  21.5 관리자 로그인 인증 구현
  21.6 정리

  유저인터페이스와 백엔드 서버에서 만든 REST API를 연동하여
  포스트를 작성한 후 조회, 수정, 삭제 하는 기능을 구현하기

  웹사이트에 간단한 비밀번호 인증 작업 적용하기
```

## 포스트 작성
```
  서버에서 API 요청을 통한 통신
  백엔드 서버는 포트 4000으로 기동하고,
  개발 서버는 포트 3000으로 기동한다.
  API 요청 주소: http://localhost:4000/api/post
  고정 값과 동적인 값을 구분해서 사용할수 있어야 한다.
  동적값: http:// localhost:4000,
  고정값: api/post
```

### 프록시 설정
```json
  /*
    webpak의 프록시 기능을 사용하면 개발 서버로 들어온 요청을 백엔드 서버에 전달하고,
    응답을 그대로 반환이 가능하다.
    백엔드
                    GET/api/posts          프록시
    개발 서버

    프록시는 webpack에서 설정 가능
  */
  // package.json
  {
    (...)
    "proxy": "http://localhost:4000"
  }
  /*
    webpack 개발 서버로 REST API를 요청하면 프록시를 이용하여 백엔드 서버로 요청하고,
    응답도 받는다. 프록시를 설정한 후에는 개발 서버를 다시 시작해야 적용됨
  */
```

### axios 설치
```
  REST API 웹 요청을 프로미스 기반으로 간편하게 할 수 있는 axios 라비브러리 설치
  yarn add axios
```

### 글 작성 API 함수 생성
```javascript
  // 클라이언트에서 API를 호출하는 함수 생성
  // src/lib/api.js
  import axios from 'axios';

  export const writePost = ({title, body, tags}) => axios.get('/api/posts', {title, body, tags});
```

### editor 모듈에 WRITRE_POST 액션 생성
```javascript
  /*
    writePost 함수를 액션화 하기
    WRITE_POST라는 액션 이름을 만들고, 액션 생성함수 만들고 API 요청이 성공했을 때 
    서버에서 응답하는 _id 값을 받아와 editor 리덕스 모듈에서 사용하는 상태의 postId 값에 전달하기
  */
  // src/store/modules/editor.js
  import * as api from 'lib/api';

  // action types
  (...)
  const WRITE_POST = 'editor/WRITE_POST';

  // action creators
  (...)
  export const writePost = createAction(WRITE_POST, api.writePost);

  // inital state 
  const initialState = Map({
    (...)
    postId: null
  });

  // reducer
  export default handleActions({
    (...)
    ...pender({
      type: WRITE_POST,
      onSuccess: (state, action) => {
        const { _id } = action.payload.data;
        return state.set('postId', _id);
      }
    })
  }, initialState);
```