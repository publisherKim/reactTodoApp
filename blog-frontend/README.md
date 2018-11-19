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

### post 모듈 생성
```javascript
  /*
    post 모듈에서 포스트 정보를 불러오는 액션을 작서하고 상태를 관리하는 코드를 입력하기
    getPost 함수를 불러와 GET_POST 액션에서 사용하도록 설정하고, 요청 성공시 상태에 할당
  */
  // src/store/modules/post.js
  import { createAction, handleActions } from 'redux-actions';
  
  import { Map, fromJS } from 'immutable';
  import { pender } from 'redux-penderr';

  import * as api from 'lib/api';

  // action types
  const GET_POST = 'post/GET_POST';

  // action creators
  export const getPost = createAction(GET_POST, api.getPost);

  // initial state
  const initialState = Map({
    post: Map({})
  });

  // reducer
  export default handleActions({
    ...pender({
      type: GET_POST,
      onSuccess: (statem action) => {
        const { data: post } = action.payload;
        return state.set('post', fromJS(post));
      }
    })
  }, initialState)
```

### Post 컴포넌트 생성
```javascript
  /*
    Post라는 컨테이너 컴포넌트를 만들어 리덕스 스토어에 있는 데이터를 컴포넌트에 전달한다.
    Post 컴포넌트에는 PostInfo와 PostBody 컴포넌트를 불러오며, componentDidMount가 발생할때 props로 받아 온 id를 사용하여 특정 id를 가진 포스트를 불러오기
    렌더링하는 부분에서 로딩 중일 때 아무것도 나타나지 않도록 null을 반환하기
  */
  // src/containers/post/Post.js
  import React, {Component} from 'reacct';
  import PostInfo from 'components/post/PostInfo';
  import PostBody from 'components/post/PostBody';
  import * as postActions from 'store/modules/post';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';

  class Post extends Component {
    initialize = async () => {
      const { PostActions, id } = this.props;
      try {
        await PostActions.getPost(id);
      } catch(e) {
        console.log(e);
      }
    }

    componentDidMount() {
      this.initialize();
    }

    render() {
      const { loading, post } = this.props;

      if(loading) return null;  // 로딩 주일 때는 아무것도 보여주지 않음

      const { title, body, publishedDate, tags } = post.toJS();

      return (
        <div>
          <PostInfo title={title} publishedDate={publishedDate} tags={tags}></PostInfo>
          <PostBody body={body}></PostBody>
        </div>
      )
    }
  }

  export default connect(
    (state) => ({
      post: state.post.get('post'),
      loading: state.pender.pending['post/GET_POST']  // 로딩 상태
    }),
    (dispatch) => ({
      PostActions: bindActionCreators(postAction, dispatch)
    })
  )(Post);

  // 이제 이 컴포넌트를 PostPage에서 렌더링 하기. id 값에는 현재 라우트의 id를 넣기
  // src/pages/PostPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import Post from 'containers/post/post';

  const PostPage = ({match}) => {
    const { id } = match.params;
    return(
      <PageTemplate>
        <Post id={id}></Post>
      </PageTemplate>
    );
  };

  export default PostPage;
```

### PostInfo와 PostBody에서 올바른 데이터 보여 주기
```javascript
  /*
    PostInfo와 PostBody 컴포넌트에서는 props로 받은 값이 아니라 하드코딩한 텍스트가 나타남
    텍스트가 들어가는 부분에 props로 넣어 준 값들을 렌더링 해 보기

    날짜를 텍스트 형태로 보여주는 부분에서는 편의상 moment 라이브러리를 설치하여 사용하기
    cf) https://momentjs.com/ 
  */
  // src/components/post/PostInfo/PostInfo.js
  import React from 'react';
  import styles from './PostInfo.scss';
  import classNames from 'classnames/bind';

  import { Link } from 'react-router-dom';
  import moment from 'moment';

  const cx = classNames.bind(styles);

  const PostInfo = ({publishedDate, title, tags}) => (
    <div className={cx('post-info')}>
      <div className={cx('info')}>
        <h1>{title}</h1>
        <div className={cx('tags')}>
          {
            // tags가 존재할 때만 map을 실행하기
            tags && tags.map(
              tag => <Link key={tag} to={`/tag/${tag}`}>#{tag}</Link>
            )
          }
        </div>
        <div className={cx('date')}>{moment(publishedDate).format('li')}</div>
      </div>
    </div>
  )

  export default PostInfo;

  // PostBody 컴포넌트 수정하기
  // src/components/post/PostBody/PostBody.js
  import React from 'react';
  import styles from '/PostBody.scss';
  import classNames from 'classnames/bind';
  import MarkdownRender from 'components/common/MarkdownRender';

  const cx = classNames.bind(styles);

  const PostBody = ({body}) => (
    <div className={cx('post-body')}>
      <div className={cx('paper')}>
        <MarkdownRender markdown={body}></MarkdownRender>
      </div>
    </div>
  );

  export default PostBody;

  /*
    마크다운 렌더링은 잘되었지만, 아직 코드 부분에 색상이 입혀서 표현되진 않음
    Prism.highlightAll() MarkdownRender 컴포넌트의 componentDidUpdate에서만 실행되기 때문

    에디터에서 마크다운이 변경될 때는 하이라이팅을 제대로 호출하지만, 처음부터 마크다운 값이 있을때는
    omponentWillMount 부분에서 마크다운 변환 작업이 일어나 html 상태가 바뀌어도 componentDidUpdate를 
    호출하지 않는다. 따라서 componentDidMount에서도 Prism.highlightAll을 호출하면 이 문제가 해결 됨
  */
  // src/components/common/MarkdownRender/MarkdownRender.js - componentDidMount
  compinentDidMount() {
    Prism.highlightAll();
  }
```