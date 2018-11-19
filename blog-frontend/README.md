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

### EditorHeaderContainer 컴포넌트 생성
```javascript
  /*
    EditorHeader 컴포넌트에 리덕스 상태와 액션 생성 함수를 붙여 주기
    왼쪽 뒤로가기 버튼과 오른쪽 글쓰기 버튼에 기능 붙이기

    뒤로가기
      - history 객체의 goBack 함수를 호출
      - withRouter를 불러와 컴포넌트를 내보낼 때 감싸 주기
      - 해당 컴포넌트에서 리액트 라우터가 전달해 주는 props 값을 받아오기 위함

    현재 컴포넌트는 리덕스와 상태를 연결하려고 connect 함수로 감싸여 있는데, connet와 withRouter가
    중첩되어도 무방

    오른쪽 버튼을 눌렀을 때는 글쓰기 액션을 발생시킨 후 postId 값을 받아 와 포스트 주소로 이동하기

    componentDidMount가 발생할때 INITIALIZE 액션을 실행시켜 에디터 상태를 초기화 하기
    미초기화시 이전에 작성한 상태가 그대로 유지 됨
  */
  // src/containers/editor/EditorHeaderContainer.js
  import React, { Component } from 'react';
  import EditorHeader from 'components/editor/EditorHeader';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import { withRouter } from 'react-router-dom';

  import * as editorActions from 'store/modules/editor';

  class EditorHeaderContainer from extends Component {
    componentDidMount() {
      const { EditorActions } = this.props;
      EditorActions.initialize();
    }

    handleGoBack = () => {
      const { history } = this.props;
      history.goBack();
    }

    handleSubmit = async() => {
      const { title, markdown, tags, EditorActions, history } = this.props;
      const post = {
        title,
        body: markdown,
        // 태그 텍스트를 ,로 분리시키고 앞뒤 공백을 지운 후 중복되는 값을 제거
        tags: tags === "" ? [] : [...new Set(tags.split(',').map(tag => tag.trim()))]
      };

      try {
        await EditorActions.writePost(post);
        // 페이지를 이동 시키기 주의: postId는 위쪽에서 레퍼런스를 만들지 않고
        // 이 자리에서 this.props.postId를 조회해야 함(현재 값을 불러오기 위함)
        history.push(`/post/${this.props.postId}`);
      } catch(e) {
        console.log(e);
      }
    };

    render() {
      const { handleGoBak, handleSubmit } = this;

      return (
        <EditorHeader
          onGoBack={handleGoBack}
          onSubmit={handleSubmit}
        ></EditorHeader>
      );
    }
  }

  export default connect(
    (state) => ({
      title: state.editor.get('title'),
      markdown: state.editor.get('markdown'),
      tags: state.editor.get('tags'),
      postId: state.editor.get('postId')
    }),
    (dispatch) => ({
      EditorActions: bindActionCreators(editorActions, dispatch)
    })
  )(withRouter(EditorHeaderContainer));

  // EditorPage를 열어 기존 EditorHeader를 EditorHeaderContainer로 바꾸기
  // src/pages/EditorPage.js
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeaderContainer from 'containers/editor/EditorHeaderContainer';
  import EditorPaneContainer from 'containers/editor/EditorPaneContainer';
  import PreviewPaneContainer from 'containers/editor/PreviewPaneContainer';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header={<EditorHeaderContainer/>}
        editor={<EditorPaneContainer/>}
        preview={<PreviewPaneContainer/>}
      >
      </EditorTemplate>
    )
  };

  export default EditorPage;

  /*
    이제 포스트 작성 기능을 완료
    뒤로가기 버튼 테스트
    작성하기 버튼 테스트
    아직 포스트를 읽는 API가 구현되지 않아서 기본값만 나타남
  */
```

## 포스트 보여주기
```
  포스트를 읽는 기능을 구현하기
  /api/posts/:id API를 호출하여 데티터를 받아온 후 post 모듈이 지닌 상태에 할당
```

### POST 읽기 API 함수 생성
```javascript
  // 포스트를 읽는 API를 요청하는 함수 만들기
  // src/lib/api.js
  (...)
  export const getPost = (id) => axios.get(`/api/posts/${id}`);
```