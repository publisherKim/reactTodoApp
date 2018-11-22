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
              tag => <Link key={tag} to={`/tag/${tag}`}>#{tag}></Link>
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

## 포스트 목록 보여 주기
```
  목록을 보여 줄 때는 여러가지 변수를 고려해야 함
    - 웹 사이트에서는 최근 작성한 포스트 열 개를 나열 한다.
    - 페이지 네이션 하나당 10개씩 순차 나열 한다.
    - 태그 클릭시: 특정 태그를 가진 포스트들만 분류 해서 나열 한다.
```

### 포스트 리스트 API 함수 생성
```javascript
  /*
    getPostList 함수 작성
    option: tag, page
    함수 파라미터로는 tag값과 page값이 있는 객체를 전달 받으며,
    객체로 전달된 값을 URL 쿼리로 변환하여 API 주소 뒷부분에 붙여 준다.
    (tag 옵션은 추후 구현)

    query-string 라이브러리를 사용
      : 문자열 형태의 URL 쿼리를 객체 형태로 변환할 수 있고,
        반대로 객체 형태를 문자 형태로도 변환 가능
    주의: v6 이상은 구형 웹 브라우저에서 호환 x 
          호환성을 고려한다면 v5를 설치해야함
    yarn add query-string@5
  */
  // src/lib/api.js
  import axios from 'axios';
  import queryString from 'query-string';

  (...)
  export const getPostList = ({tag, page}) => axios.get(`/api/posts/?${queryString.stringify({tag, page})}`);

  // 객체를 URL 쿼리 문자열로 변환할 때는 이처럼 queryString.stringify 함수를 사용
```

### list 모듈 생성
```javascript
  /*
    getPostList API를 호출할 때 필요한 액션과 상태 관리 로직들을 list.js 모듈 생성
    이 모듈 상태에는 포스트 목록 데이터가 들어 있는 posts 값과 마지막 페이지를 알려주는 lastPage 값이 들어 있다.

    Last-Page라는 커스텀 HTTP 헤더를 넣어 응답하도록 코드를 작성했으나 axios에서는 소문자 헤더를 읽어 오므로
    action.payload.headers['last-page'] 값을 읽어 온다.
    추가로 해당 값은 문자열 형태로 들어오니 이 값을 parstInt를 사용하여 숫자로 변환한다.
  */
  // src/store/modules/list.js
  import { createAction, handleAction } from 'redux-actions';
  
  import { Map, List, fromJS } from 'immutable';
  import { pender } from 'redux-pender';

  import * as api from 'lib/api';

  // action types
  const GET_POST_LIST = 'list/GET_POST_LIST';

  // action creators
  export const getPostList = creationAction(GET_POST_LIST, api.getPostList, meta => meta);

  // initial state
  const initialState = Map({
    posts: List(),
    lastPage: null
  });

  // reducer 
  export default handleActions({
    ...pender({
      type: GET_POST_LIST,
      onSuccess: (state, action) => {
        const { data: posts } = action.payload;

        const lastPage = action.payload.headers['last-page'];
        return state.set('posts', fromJS(posts))
                    .set('lastPage', parseInt(lastPage, 10));
      }
    })
  }, initialState);
```

### ListContainer 컴포넌트 생성
```javascript
  /*
    포스트 리스트 관련 리덕스 상태와 액션들이 연동된 컨테이너 컴포넌트인 ListContainer를 만들기
    컴포넌트 내부에는 PostList와 Pagination 컴포넌트가 내장

    이 컴포넌트는 나중에 ListPage에서 tag 값과 page  값을 전달 받음
    포스트 리를 불러오는 API를 호출하고, 데이터를 PostList와 Pagination에 
    넣어주고, page 값이 변하여 리스트를 새로 불러오도록 코드를 작성
  */
  // src/containers/list/ListContainer.js
  import React { Component } from 'react';
  import PostList from 'components/list/PostList';
  import Pagination from 'components/list/Pagination';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as listActions from 'store/modules/list';

  class ListContainer extends Component {
    getPostList = () => {
      // 페이지와 태그 값을 부모에게 받아 온다.
      const { tag, page, ListActions } = this.props;
      ListActions.getPostList({
        page,
        tag
      });
    }

    componentDidMount() {
      this.getPostList();
    }

    componentDidUpdate(prevProps, pervState) {
      // 페이지가 바뀔 때  리스트를 다시 불러온다.
      if(prevProps.page !== this.props.page || prevProps.tag !== this.props.tag) {
        this.getPostList();
        document.documentElement.scrollTop = 0;
      }
    }

    render() {
      const { loading, posts, page, lastPage, tag } = this.props;
      if(loading) return null;  // 로딩 중에는 아무것도 보여 주지 않는다.
      return (
        <div>
          <PostList posts={posts}></PostList>
          <Pagination page={page} lastPage={lastPage} tag={tag}></Pagination>
        </div>
      )
    }
  }

  export default connect(
    (state) => ({
      lastPage: state.list.get('lastPage'),
      posts: state.list.get('posts'),
      loading: state.pender.pending['list/GET_POST_LIST']
    }),
    (dispatch) => ({
      ListActions: bindActionCreators(listActions, dispatch)
    })
  )(ListContainer);

  /*
    이 컴포넌트를 ListPage에 불러와 PostList와 Pagination 컴포넌트를 대체한다.
    그리고 tag 값과 page 값을 params에서 읽어 와 컨테이너 컴포넌트로 전달한다.

    page가 존재하지 않을 때는 기본값을 1로 설정
  */
  // src/pages/ListPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import ListWrapper from 'components/list/ListWrapper';
  import ListContainer from 'containers/list/ListContainer';

  const ListPage = ({match}) => {
    // page의 기본 값을 1로 설정한다.
    const { page = 1, tag } = match.params;

    return (
      <PageTmeplate>
        <ListWrapper>
          <ListContainer
            page={parseInt(page, 10)}
            tag={tag}
          ></ListContainer>
        </ListWrapper>
      </PageTmeplate>
    )
  }

  export default ListPage;
```

### PostList 컴포넌트 데이터 렌더링
```javascript
  /*
    임시로 텍스트를 직접 넣어서 보이던 부분을 props로 받아 온 데이터 채움
    PostList  내부에 있는 PostItem 컴포넌트에서는 포스트 내용의 일부를 보여주기
    이 부분에서는 마크다운 html이 변환되지 않으므로 마크다운에서 사용하는 #, **, ``` > 등
    특수문자가 고스란히 표현되는 문제가 있음 remove-markdown 라이브러리를 사용하여 이름 숨긴다.
    이 라이브러리는 마크다운에서 사용한 특수 문자를 제거해 준다. 
    
    yarn add remove-markdown
  */
  // src/components/list/PostList/PostList.js
  import React from 'react';
  import styles from './PostList.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';
  import moment from 'moment';
  import removeMd from 'remove-markdown';

  const cx = classNames.bind(styles);

  const PostItem = ({title, body, publishedDate, tags, id}) => {
    const tagList = tags.map(
      tag => <Link key={tag} to={`/tag/${tag}`}>#{tag}</Link>
    );

    return (
      <div className={cx('post-item')}>
        <h2><Link to={`/post/${id}`}>{title}</Link></h2>
        <div className={cx('date')}>
          {moment(publishedDate).format('li')}
        </div>
        <p>{removeMd(body)}</p>
        <div className={cx('tags')}>
        </div>
      </div>
    )
  };

  const PostList = ({ posts }) => {
    const PostList = posts.map(
      (post) => {
        const { _id, title, body, publishedDate, tags } = post.toJS();
        return (
          <PostItem
            title={title}
            body={body}
            publishedDate={publishedDate}
            tags={tags}
            key={_id}
            id={_id}
          ></PostItem>
        );
      }
    );

    return (
      <div className={cx('post-list')}>
        {postList}
      </div>
    );
  };

  export default PostList;
```

### 페이지 네이션 기능 구현
```javascript
  /*
    페이지네이션이 실제로 작동하도록 기능 구현하기
    딱히 함수를 실행하지 않고 전달 받은 page값, lastPage 값, tag 값을 사용해서 
    이전 또는 다음 페이지 링크로 이동시켜 주기
    만들어둔 Button 컴포넌트에 Link 기능도 있기 때문에 to 값을 설정하면 된다.
    첫 번째 페이지에서는 이전 버튼을 비활성화하고, 마지막 페이지에서는 다음 버튼을
    비활성화 한다.

    태그를 선택했을 때는 /tag 라우트를 사용하고, 태그를 선택하지 않았을 때는 /page 라우트를 사용한다.
    주소 생성 작업을 용이하게 진행하기 위해 함수를 따로 작성한다.
  */
  // src/components/list/Pagination/Pagination.js
  import React from 'react';
  import styles from './Pagination.scss';
  import classNames from 'classnames/bind';
  import Button from 'components/common/Button';

  const cx = classNams.bind(styles);

  const Pagination = ({page, lastPage, tag}) => {
    const createPagePath = (page) => {
      return tag ? `/tag/${tag}/${page}` : `/page/$(page)`;
    }

    return (
      <div className={cx('pagination')}>
        <Button disabled={page === 1} to={createPagePat(page - 1)}>
          이전 페이지
        </Button>
        <div className={cx('number')}>
          페이지 {page}
        </div>
        <Button disabled={page === lastPage} to={createPagePath(page + 1)}>
          다음 페이지
        </Button>
      </div>
    )
  };

  export default Pagination;
```

### API에서 tag 분류
```javascript
  /*
    백엔드 API를 조금 수정하여 tag 값도 분류할 수 있도록 설정
    백엔드 프로젝트의 posts.ctrl.js 파일 수정하기
  */
  // src/api/posts/posts.ctrl.js - list
  (...)
  exports.list = async (ctx) => {
    // page가 주어지지 않았다면 1로 간주
    // query는 문자열 형태로 받아 오므로 숫자로 변환
    const page = parseInt(ctx.query.page || 1, 10);
    const { tag } = ctx.query;

    const query = tag ? {
      tags: tag // tags 배열에 tag를 가진 포스트 찾기
    } : {};

    // 잘못된 페이지가 주어졌다면 오류
    if (page < 1) {
      ctx.statue = 400;
      return;
    }

    try {
      const posts = await Post.find(query)
        .sort({ _id: -1})
        .limit(10)
        .skip((page - 1) * 10)
        .lean()
        .exec();
      const postCount = await Post.count(query).exec();
      const limitBodyLegth = post => ({
        ...post,
        body: post.body.length < 350 ? post.body : `${post.body.slice(0, 350)}...`
      });
      ctx.body = posts.map(limitBodyLength);
      // 마지막 페이지 알려주기
      // ctx.body = posts.map(limitBodyLength);
      ctx.set('Last-page', Math.ceil(postCont / 10));
    } catch(e) {
      ctx.throw(500, e);
    }
  };
  (...)

  /*
    URL 쿼리 중 tag 존재 유무에 따라 find 함수에 넣을 파라미터를 다르게 설정한다.
    여기에서 무조건 { tags: tag } 객체를 넣지 않고 tag가 비어 있을 때 빈 객체 { }를 전달한 것은,
    tag가 없다면 find 함수에 { tags: undefined }를 전달하면서 아무 데이터도 나타나지 않는
    이슈가 발생한다.
    
    이제 태그 분류도 완성. 태그가 있는 포스트에서 태그 링크를 눌러보기
  */
```

## 포스트 수정 및 삭제
### 헤더에 버튼 보여주기
```javascript
  /*
    수정, 삭제 버튼 추가하기
    수정 버튼을 /editor?postId=ID 링크로 이동하게 설정하고, 
    삭제 버튼은 onRemove 함수를 props로 받아 와 호출하게 설정

    HeaderContainer를 만들어 포스트 페이지일 때는 포스트 아이디를 전달하도록 설정
  */
  // src/containers/common/HeaderContainer.js
  import React, { Component } from 'react';
  import Header from 'components/common/Header';
  import { withRouter } from 'react-router-dom';

  class HeaderContainer extends Component {
    handleRemove = () => {
      // 미리 만들어 두기
    }

    render() {
      const { handleRemove } = this;
      const { match } = this.props;

      const { id } = match.params;

      return (
        <Header
          postId={id}
          onRevmoe={handleRemove}
        ></Header>
      );
    }
  }

  export default withRouter(HeaderContainer);

  /*
    아직은 리덕스와 연결하지 않았지만, 나중에 관리자 기능 로그인을 구현할 때 connect를 사용하므로
    containers 디렉터리에 컨테이너 컴포넌트를 만들어 준다.
  */

  // PageTemplae에서 Header를 대체한다.
  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import className from 'classnames/bind';
  import HeaderContainer from 'containers/common/HeaderContainer';
  import Footer from 'components/common/Footer';

  const cx = classNames.bind(styles);

  const PageTemplate = ({children}) => (
    <div className={cx('page-template')}>
      <HeaderContainer>
        <main>
          {children}
        </main>
      </HeaderContainer>
    </div>
  );

  export default PageTemplate;

  /*
    이제 params에 id가 있을 때는 해당 값을 Header로 전달한다.
    Header 컴포넌트를 열어 postId를  전달 받았을 때 두 버튼이 나타나도록 설정한다.
  */
  // src/components/common/Header/Header.js
  (...)

  const Header = ({postId, onRevmoe}) => (
    <header className={cx('header')}>
      <div className={cx('header-content')}>
        <div className={cx('brand')}>
          <Link to="/">reactblog</Link>
        </div>
        <div className={cx('right')}>
          {
            // flex를 유지하려고 배열 형태로 렌더링 하기
            postId && [
              <Button key="edit" theme="outline" to={`/editor?id=${postId}`}>수정</Button>,
              <Button key="remove" theme="outline" onClik={onRemove}>삭제</Button>
            ]
          }
          <Button theme="outline" to="/editor">새 포스트</Button>
        </div>
      </div>
    </header>
  );

  export default Header;

  /*
    수정 버튼을 누르면 /editor/?id=ID 페이지로 전환하도록 설정 함
    삭제 버튼을 누르면 props로 전달받은 onRemvoe 함수를 호출하도록 설정함
    이 함수는 추후 구현
  */
```

### 수정 기능 구현
```javascript
  /*
    에디터에서 포스트 정보 불러오기
    
    수정 버튼을 눌러 에디터 페이지로 오면 id라는 쿼리가 설정됩니다. 에티터가 열릴 때 id 값이 
    존재한다면 해당 포스트 내용을 불러와 editor 상태에 넣어 주기

    기존에 만들었던 getPost API 함수를 재활용하여 editor 모듈에 GET_POST 액션 만들기
  */
  // src/store/modules/editor.js
  (...)
  const GET_POST = 'editor/GET_POST';

  // action creators
  (...)
  export const getPost = creatorAction('GET_POST', api.getPost);

  // initial state
  const initialState = Map({
    title: '',
    markdown: '',
    tags: '',
    postId: null
  });

  // reducer
  export default handleActions({
    (...)
    ...pender({
      type: GET_POST,
      onSuccess: (state, action) => {
        const { title, tags, body } = action.payload.data;
        return state.set('title', title)
                    .set('markdown', body)
                    .set('tags', tags.join(', '));  // 배열 -> ,로 구분된 문자열
      }
    })
  }, initialState);

  /*
    그 다음에는 EditorHeaderContainer.js location.search에서 id 값을 파싱하여 해당 값이 있다면
    EditorActions.getPost를 사용하여 포스트 정보를 가져오기
    EditorActions.initialize로 에디터 상태를 초기화한 후 진행
  */
  // src/containers/editor/EditorHeaderContainer.js
  (...)
  import queryString from 'query-string';
  
  class EditorHeaderContainer extends Component {
    componentDidMount() {
      const { EditorActions, location } = this.props;
      EditorAtions.initialize();  // 에디터 초기화

      // 쿼리 파싱
      const { id } = queryString.parse(location.search);
      if(id) {
        // id가 존재한다면 포스트 불러오기
        EditorActions.getPost(id);
      }
    }
  }
  (...)
  // 포스트를 수정할 때 초기 데이터를 제대로 불러오는지 확인하기
```

### 수정 API 함수 및 액션 생성
```javascript
  /*
    수정 API 함수는 writePost 함수와 비슷하지만, axios.patch를 사용하고 id 값을 추가로 전달 받는다.
    api 파일을 열어 다음 함수를 추가한다.
  */
  // src/lib/api.js
  (...)
  export const editPost = ({id, title, body, tags}) => axios.patch(`api/posts/${id}`, {title, body, tags});
  /*
    이제 이 함수를 호출하는 액션을 준비

    여기에서는 리듀서 부분(handleActions)에 따로 로직을 작성할 필요가 없음 현재 어떤 포스트를 수정하는 이미 알고 있으므로
  */
  // src/store/modules/editor.js
  import { createActions, handleActions } from 'redux-actions';

  import { Map } from 'immutable';
  import { pender } from 'redux-pender';
  import * as api from 'lib/api';

  // action types
  (...)
  const EDIT_POST = 'editor/EDIT_POST';

  // action creators
  (...)
  export const editPost = createAction(EDIT_POST, api.editPost);
  (...)
  /*
    액션을 작성한 후 EDitorHeaderContainer를 마저 구현한다.
    handleSubmit 부분에서 id 값이 있으면 writePost가 아닌 editPost를 호출하도록 설정한다.

    그 다음에는 렌더링 부분에서 id 값이 있을 때 isEdit라는 props를 true로 설정한다.
  */
  // src/containers/editor/EditorHeaderontainer.js
  (...)

  class EditorHeaderContainer extends Component {
    (...)
    handleSubmit = async() => {
      const { title, markdown, tags, EditorActions, History, location } = this.props;
      const post = {
        title,
        body: markdown,
        // 태그 텍스트를 ,로 분리하고 앞뒤 공백을 지운 후 중복되는 값을 제거한다.
        tags: tags === "" ? [] : [...new Set(tags.split(',').map(tag => tag.trim()))]
      };
      try {
        // id가 존재하면 editPost 호출
        const { id } = queryString.parse(location.search);
        if(id) {
          await EditorActions.editPost({id, ...post});
          history.push(`/post/${id}`);
          return;
        }
        await EditorAtions.writePost(post);
        // 페이지를 이동 한다. 주의: postId는 위쪽에서 레퍼런스를 만들지 말고
        // 이 자리에서 this.props.postId를 조회해야 한다.(현재 값을 불러오기 위함).
        history.push(`post/${this.props.postId}`);
      } catch(e) {
        console.log(e);
      }
    }

    render() {
      const { handleGoBak, handleSubmit } = this;
      cosnt { id } = queryString.parse(this.props.location.search);
      return (
        <EditorHeader
          onGoBack={handleGoBack}
          onSubmit={handleSubmit}
          isEdit={id ? true: false}
        ></EditorHeader>
      );
    }
  }
  (...)
  /*
    유저가 헷갈리지 않도록 EditorHeader에서 isEdit 값이 true면 작성하기가 아닌 수정하기라는 문구를 표시하도록 설정
  */
  // src/components/editor/EditorHeader/EditorHeader.js
  (...)

  const EditorHeader = ({onGoBack, onSubmit, isEdit}) => {
    return (
      (...)
        <Button onClick={onSubmit} theme="outline">{isEdit ? '수정' : '작성'}하기</Button>
      (...)
    )
  };

  export default EditorHeader;
  // 이제 수정 모드일 떄는 다음과 같이 수정하기 버튼이 나타남
  // 수정 클릭시 내용이 변경된 포스트 페이지로 이동한다.
```

### 삭제 기능 구현
```
  이 프로젝트에서 포스트와 관련된 마지막 기능인 삭제 기능을 구현하기
  삭제 기능은 포스트 페이지에서 수정 버튼 오른쪽에 있는 삭제 버튼을 누르면 발생한다.
  모달 팝업 알림 띄워주기
```

#### ModalWrapper와 AskRemovModal 컴포넌트 생성
```javascript
  /*
    ModalWrapper 컴포넌트를 만들어 포스트 삭제 모달을 구현하기
      - state가 있는 클래스형 컴포넌트
      - 전체 화면을 불투명한 회색 배경으로 바꾸고 그 위에 흰색 박스를 보여 준다.
      - 모달의 가시성 상태와 전환 효과 상태를 관리하기

    ModalWrapper 컴포넌트는 나중에 비밀번호 로그인을 구현할 때 로그인 모달을 만드는 과정에서 재사용한다.

    components 디렉터리에 modal 디렉터리를 만든 후 ModalWrapper 컴포넌트를 생성
  */
  // src/components/modal/ModalWrapper/ModalWrapper.js
  import React, { Component } from 'react';
  import styles from './ModalWrapper.scss';
  import classNames from 'classNames/bind';

  const cx = classNames.bind(styles);

  class ModalWrapper extends Component {
    render() {
      const { children } = this.props;
      return (
        <div>
          <div className={cx('gray-background')}></div>
          <div className={cx('modal-wrapper')}>
            <div className={cx('modal')}>
              {children}
            </div>
          </div>
        </div>
      )
    }
  }

  export default ModalWrapper;

  /*
    이 컴포넌트는 children props를 받아 와 modal 엘리먼트 내부에서 보여준다. 상태관리는 나중에 하고, 
    지금은 컴포넌트 layout 부터 만든다.
  */
```
```scss
  @import 'utils';
  
  .gray-background {
    background: rgba(100, 100, 100, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
  }

  .modal-wrapper {
    z-index: 10;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .modal {
      @include material-shadow(3, 0.5);
      background: white;
    }
  }
```
```javascript
  /*
    AskRemoveModal 컴포넌트를 modal 디렉토리에 만든다.
    ModalWrapper 컴포넌트를 불러와 children 부분에는 "내용"이라는 텍스트를 넣어 렌더링한다.
  */
  // src/components/modal/AskRemoveModal/AskRemoveModal.js
  import React from 'react';
  import styles from './AskRemoveModal.scss';
  import classNames from 'classNames/bind';
  import ModalWrapper from 'components/modal/ModalWrapper';

  const cx = classNames.bind(styles);

  const AskRemoveModal = () => (
    <ModalWrapper>
      내용
    </ModalWrapper>
  )

  export default AskRemoveModal;

  // PostPage에 불러와 렌더링하기
  // src/pages/PostPage.js
  import AskRemoveModal from 'components/modal/AskRemoveModal';
  (...)
  const PostPage = ({match}) => {
    const { id } = match.params;
    return (
      <PageTemplate>
        <Post id={id}></Post>
        <AskRemoveModal></AskRemoveModal>
      </PageTemplate>
    );
  }

  export default PostPage;
```

#### AskRemoveModal 컴포넌트 생성
```javascript
  /*
    이제 이 모달에서 보일 내용을 설정하기
    이 컴포넌트는 두 가지 영역으로 나뉜다.
    위에는 모달 제목과 내용이 있고,
    아래에는 유저가 선택할 수 있는 버튼이 있다.
  */
  // src/components/modal/AskRemoveModal/AskRemoveModal.js
  import React from 'react';
  import styles from './AskRemoveModal.scss';
  import classNames from 'classnames/bind';
  import ModalWrapper from 'components/modal/ModalWrapper';
  import Button from 'components/common/Button';

  const cx = classNames.bind(styles);

  const AskRemoveModal = () => (
    <ModalWrapper>
      <div className={cx('question')}>
        <div className={cx('title')}>포스트 삭제</div>
        <div className={cx('description')}>이 포스트를 정말로 삭제하시겠습니까?</div>
      </div>
      <div className={cx('options')}>
        <Button theme="gray">취소</Button>
        <Button>삭제</Button>
      </div>
    </ModalWrapper>
  );

  export default AskRemoveModal;
```
```scss
  // src/components/modal/AskRemoveModal/AskRemoveModal.scss
  @import 'utils';

  .question {
    background: white;
    padding: 2rem;
    .title {
      font-size: 1.25rem;
      font-weight: 500;
    }
    .description {
      margin-top: 0.25rem;
    }
  }

  .options {
    padding: 1rem;
    background: $oc-gray-1;
    text-align: right;
  }
```

#### 모달 상태 관리
```javascript
  /*
    모달은 기본 상태에서는 보이지 않고, 유저가 삭제버튼을 누를 때만 보임
    따라서 이 컴포넌트가 어떤 상황에서 나타나야 하는지 설정
    ModalWrapper 컴포넌트에서 visible이란 props를 받아 와 상황에 따라 null을 구현하도록
    렌더링 함수를 수정하기
  */
  // src/components/modal/ModalWrapper/ModalWrapper.js
  (...)
  class ModalWrapper extends Component {
    render() {
      const { children, visible } = this.props;
      if(!visibe) return null;
      (...)
    }
  }
  /*
    이렇게 하면 visible 값이 true일 때만 컴포넌트가 보이기 때문에 화면에는 나타나지 않는다.

    리덕스 모듈 중 base.js 파일을 수정
    이 모듈은 모달의 가시성을 관리하며,
    추후 로그인 기능을 구현할 때 로그인 모달 상태와 로그인 상태도 관리한다.
  */
  // src/store/modules/base.js
  import { createAction, handleAction } from 'redux-actions';
  import { Map } from 'immutable';
  import { pender } from 'redux-pender';

  // action types
  const SHOW_MODAL = 'base/SHOW_MODAL';
  const HIDE_MODAL = 'base/HIDE_MODAL';

  // action creators
  export const showModal = createAction(SHOW_MODAL);
  export const hideModal = createAction(HIDE_MODAL);

  const initalState = Map({
    // 모달의 가시성 상태
    modal: Map({
      remove: false,
      login: false  // 추후 구현할 로그인 모달
    })
  });

  // reducer
  export default handleACtions({
    [SHOW_MODAL]: (state, action) => {
      const { payload: modalName } = action;
      return state.setIn(['modal', modalName], true);
    },
    [HIDE_MODAL]: (state, action) => {
      const { payload: modalName } = action;
      return state.setIn(['modal', modalName], false);
    }
  }, initialState);
  /*
    SHOW_MODAL 과 HIDE_MODAL 액션을 만든다.
    이 액션은 주어진 payload 값에 따라서 modal Map 내부에 있는 값을 true 또는 false로 전환한다.
    굳이 액션을 두 개로 나누지 않고, SET_MODAL_VISIBILITY 같은 액션을 만들어 payload 부분에
    modalName visible 값을 받아 와 구현해도 무방
  */

  // AskRemoveModalConainer.js
  import React, { Component } from 'react';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as baseActions from 'store/modules/base';
  import * as postAtions from 'store/modules/post';
  import AskRemoveModal from 'components/modal/AskRemoveModal';

  class AskRemoveModalContainer extends Component {
    handleCancel = () => {

    }
    handleConfirm = () => {

    }
    render() {
      const { visible } = this.props;
      const { handleCancel, handleConfirm } = this;

      return (
        <AskRemoveModal visible={visible} onCancel={handleCancel} onConfirm={handleConfirm}></AskRemoveModal>
      );
    }
  }

  export default connet(
    (state) => ({
      visible: state.base.getIn(['modal', 'remove'])
    }),
    (dispatch) => ({
      BaseAtion: bindActionCreators(baseActions, dispatch),
      PostAction: bindActionCreators(postActions, dispatch)
    })
  )(AskRemoveModalContainer);

  /*
    visible 값을 리덕스에서 받아 와 AskRemoveModal에 전달했으며, base와 post 모듈의 액션들은 미리 연결해 놓았다.
    그리고 확인 버튼을 누르면 실행하는 handleConfirm과 취소 버튼을 누르면 실행하는 handleCancel 메서드에 비어 있는 함수를 미리 설정해 놓고, 이를 onConfirm/onCancel 이름으로 AskRemoveModal에 전달하기

    그리고 이렇게 넣은 props를 AskRemoveModal에 반영한다.
  */
  // src/components/modal/AskRemoveModal/AskRemoveModal.js
  (...)
  const AskRemoveModal = ({visible, onConfirm, onCancel}) => (
    <ModalWrapper visible={visible}>
      <div classNmae={cx('question')}>
        <div className={cx('title')}>포스트 삭제</div>
        <div classsName={cx('description')}>이 포스트를 정말로 삭제 하시겠습니까?</div>
      </div>
      <div className={cx('options')}>
        <Button theme="gray" onClick={onCancel}>취소</Button>
        <Button onClick={onConfirm}>삭제</Button>
      </div>
    </ModalWrapper>
  );

  export default AskRemoveModal;

  // src/pages/PostPage.js
  (...)
  import AskRemoveModalContainer from 'containers/modal/AskRemoveModalContainer';

  const PostPage = ({ match }) => {
    const { id } = match.params;
    return (
      <PageTemplate>
        <Post id={id}></Post>
        <AskRemoveModalContainers></AskRemoveModalContainers>
      </PageTemplate>
    );
  };

  export default PostPage;

  /*
    HeaderContainer 컴포넌트에서 만들어 둔 handleRemove 메서드를 호출하면 모달을 띄우도록 코드를 입력
    아직도 this에 대해서 헤멘다. 헷갈린땐 이 블로그들을 참고하자.
    https://hanjungv.github.io/2018-02-03-1_JS_arrow_function/
    https://poiemaweb.com/es6-arrow-function
  */
  (...)
  import * as bindActions from 'store/modules/base';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';

  class HeaderContainer extends Component {
    handleRemove = () => {
      const { BaseActions } = this.props;
      BaseActions.showModal('remove');
    }

    render() {
      (...)
    }
  }

  export default connect(
    (state) => ({}),
    (dispatch) => ({
      BaseActions: bindActionsCreators(baseActions, dispatch);
    })
  )(withRouter(HeaderContainer));
```

### 삭제 모달 버튼 기능 구현
```javascript
  /*
    모달에서 사게 버튼을 누르면 현재 보고 있는 포스트를 삭제하고, 취소 버튼을 누르면 모달이 종료 하도록 설정

    취소 버튼부터 구현하기

    AskRemoveModalContainer 컴포넌트의 handleCancel 메서드에서 BaseActions.hideModal을 호출한다.
  */
  // src/containers/modal/AskRemoveModalontainer.js
  handleCancel = () => {
    const { BaseActions } = this.porps;
    BaseActions.hideModal('remove');
  }

  // 삭제 버튼 구현하기 api.js 파일에 포스트 삭제 API 함수를 만들고 액션을 준비한후 handleConfirm에서 호출
  // src/lib/api.js
  (...)
  export const removePost = (id) => axios.delete(`/api/posts/${id}`);
  // src/store/modules/post.js
  (...)
  // action types
  const GET_POST = 'post/GET_POST';
  const REMOVE_POST = 'post/REMOVE_POST';

  // action creators
  export const getPost = createAction(GET_POST, api.getPost);
  export const removePost = createAction(REMOVE_POST, api.removePost);
  (...)
  /*
    삭제 액션은 post 모듈에서 작성하고, 리듀서에 상태 관리는 따로 하지 않다도 된다.

    액션을 작성한 후 AskRemoveModalContainer에서 라우터 정보를 조회할 수 있도록 코드 아래쪽에서
    컴포넌트를 withRouter로 감싸주고 handleConfirm에서 방금 만든 액션 생성 함수에 현재 포스트 아이디를 파라미터로 넣어 호출한다.
    마지막으로 삭제 요청이 완료된 후에는 웹 사이트로 주소를 이동시키도록 코드를 작성한다.
  */
  // src/containers/modal/AskRemoveModalContainer.js
  (...)
  import { withRouter } from 'reat-router-dom';

  class AskRemoveModalContainer extends Component {
    (...)
    handleConfirm = async () => {
      const { BaseActions, PostActions, history, match } = this.props;
      const { id } = match.params;

      try {
        // 포스트 삭제 후, 모달 닫고 웹 사이트로 이동
        await PostActions.removePost(id);
        BaseActions.hideModal('remove');
        history.push('/');
      } catch(e) {
        console.log(e);
      }
    }
    (...)
  }

  export default connect(
    (state) => ({
      visible: state.base.getIn(['modal', 'remove'])
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch),
      PostAction: bindActionCreators(postAction, dispatch)
    })
  )(withRouter(AskRemoveModalContainer));
  // 삭제 기능 완료
```

### 모달 전환 효과 구현
```scss
  /*
    전환 애니메이션 효과를 설정하면 좀 더 자연스럽게 모달이 나타나고 사라진다.
    전환 효과는 CSS의 @keyframes를 사용하여 구현
    @keyframes를 사용하여 전환 효과의 시작 부분, 마지막 부분의 스타일을 지정해 주면
    스타일이 서서히 변화하면서 애니메이션 효과가 구현 된다.

    ModalWrapper.scss 총 네 가지 종류의 @keyframes를 사용
      - fadeIn: 투명도가 0% -> 100%
      - fadeOut: 투명도가 100% -> 0%
      - slideUp: 아래에서 위로 올라오는 효과
      - slideDown: 위에서 아래로 내려가는 효과
  */
  // src/components/modal/ModalWrapper/ModalWrapper.scss
  @import 'utils';

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fadeOut {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes slideUp {
    0% { transform: translateY(50vh); }
    100% { transform: translateY(0); }
  }

  @keyframes slideDown {
    0% { transform: translateY(0); }
    100% { transform: translateY(50vh); }
  }
  (...)
  // gray-backround modal 클래스 내부에 &.enter 와 &.leave 클래스를 만들어 각각 알맞은 animation을 설정하기
  // src/components/modal/ModalWrapper/ModalWrapper.scss
  .gray-background {
    (...)
    &.enter {
      animation: fadeIn 0.25s ease-in both;
    }
    &.leave {
      animation: fadeOut 0.25s ease-in both;
    }
  }

  .modal-wrapper {
    (...)
    .modal {
      (...)
      &.enter {
        animation: slideUp 0.25s ease-in both;
      }
      &.leave {
        animation: slideDown 0.25s ease-in both;
      }
    }
  }
  // ModalWrapper 컴포넌트에서 visible 값이 바뀌면 내부 state를 설정하여 enter 또는 leave 애니메이션을 적용시켜 본다.
```
```javascript
  // src/components/modal/ModalWrapper/ModalWrapper.js
  (...)
  class ModalWrapper extends Component {
    state = {
      animate: false
    }

    startAnimation = () => {
      // animate 값을 true로 설정 후
      this.setState({
        animate: true
      });
      // 250ms 이후 다시 false로 설정
      setTimeout(() => {
        this.setState({
          animate: false
        });
      }, 250)
    }

    componentDidUpdate(prevProps, prevState) {
      if(prevProps.visible !== this.props.visible) {
        this.startAnimation();
      }
    }

    render() {
      const { children, visible } = this.props;
      const { animate } = this.state;

      // visible과 animate 값이 둘 다 false일 때만
      // null을 리턴
      if(!visible && !animate) return null;

      // 상태에 따라 애니메이션 설정
      const animation = animate && (visible ? 'enter' : 'leave');

      return (
        <div>
          <div className={cx('gray-background', animation)}></div>
          <div className={cx('modal-wrapper')}>
            <div className={cx('modal', animation)}>
              {children}
            </div>
          </div>
        </div>
      );
    }
  }

  export default ModalWrapper;
  /*
    startAnimation 메서드를 만들고, componentDidUpdate에서 visible 값이 바뀔 때마다
    이 메서드를 호출하도록 설정한다.
    startAnimation을 호출하면 내부 state인 animate 값을 true로 설정하고, 250ms 후에는 
    다시 false로 설정한다. 여기에서 1ms는 0.001초이다.

    animate가 true일 때는 visible 값에 따라서 'enter' 또는 'leave'를 배경 화면과
    모달에 클래스로 넣어 준다. 애니메이션이 진행되는 동안에는 컴포넌트가 화면에서 사라지지 
    않도록 visible 값과 animate 값이 둘 다 false일 때만 null을 리턴하도록 설정한다.

    자, 이제 삭제 모달의 애니메이션 구현까지 끝났다. 제대로 구현했다면 모달이 아래에서 위로
    솟아오르고, 취소 버튼을 누르면 다시 아래로 사라질 것이다.
    이제 프로젝트의 마지막 단계인 관리자 로그인 인증 기능을 구현하기
  */
```

###  로그인 모달 생성
```javascript
  /*
    다시 프론트엔드 프로젝트로 돌아와서 로그인 모달을 만들기
    ModalWrapper 컴포넌트를 재사용하자.
  */
  // src/components/modal/LoginModal/LoginModal.js
  import React from 'react';
  import styles from './LoginModal.scss';
  import classNames from 'classnmaes/bind';
  import ModalWrapper from 'components/modal/ModalWrapper';

  const cx = classNames.bind(styles);

  const LoginModal = ({
    visible, password, error, onCancel, onLogin, onChange, onKeyPress
  }) => (
    <ModalWrapper visible={visible}>
      <div className={cx('from')}>
        <div onClick={onCancel} className={cx('close')}>&times;</div>
        <div className={cx('title')}>로그인</div>
        <div className={cx('description')}>관리자 비밀번호를 입력하세요</div>
        <input autoFocus type="password" placeholder="비밀번호 입력" value={password} onChange={onChange} onKeyPress={onKeyPress} />
        { error && <div className={cx('error')}>로그인 실패</div> }
        <div className={cx('login')} onClick={onLogin}>로그인</div>
      </div>
    </ModalWrapper>
  );

  export default LoginModal;
  /*
    전달받은 props가 7개
    password: 로그인 창에 있는 input의 value 값이며 나중에 base 모듈에서 가져옴
    error 값은 유저가 잘못된 비밀번호를 입력햇을 때 오류를 표시하는 값

    onCancel은 닫기 버튼(&times: 문자는 x이다.)을 누르면 실행하는 함수고,
    onLogin은 로그인 버튼을 누르면 실행하는 함수이다.
    onChange와 onKeyPress는 비밀번호를 입력할 떄 호출되는 함수이다.
    onChange 함수는 값을 변경하려고 설정했고, onKeyPress 함수는 나중에 버튼 클릭뿐만 아니라
    인풋 입력 후 Enter를 눌렀을때도 로그인 작업을 수행할고 설정한다.
  */
```
```scss
  // src/components/modal/LoginModal/LoginModal.scss
  @import 'utils';

  .form {
    background: white;
    padding: 2rem;
    position: relative;
    padding-top: 2.5rem;
    width: 20rem;
    .close {
      line-height: 2rem;
      font-size: 2rem;
      position: absolute;
      right: 1rem;
      top: 0.5rem;
      cursor: pointer;
      &:hover {
        color: $oc-gray-6;
      }
    }
    .title {
      font-size: 1.25rem;
      font-weight: 500;
    }
    .description {
      margin-top: 0.25rem;
    }
    .error {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      color: $oc-red-6;
      text-align: center;
      font-size: 0.85rem;
    }
    
    input {
      width: 100%;
      font-size: 1.25rem;
      margin-top: 0.5rem;
      border: none;
      border-bottom: 1px solid $oc-gray-3;
      padding: 0.25rem;
      outline: none;
      border-radius: 4px;
    }

    .login {
      background: $oc-blue-6;
      text-align: center;
      color: white;
      font-weight: 500;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      cursor: pointer;
      margin-top: 1rem;
      font-size: 1.25rem;
      &:hover {
        background: $oc-blue-5;
      }
      &:active {
        background: $oc-blue-6;
      }
    }
  }
```
```javascript
  // 로그인 모달을 위한 컨테이너 컴포넌트인 LoginModalContainer를 containers/modal 디렉터리 만들기
  // src/containers/modal/LgoinModalContainer.js
  import React, { Component } from 'react';
  import LoginModal from 'components/modal/LoginModal';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as baseActions from 'store/modules/base';

  class LoginModalContainer extends Component {
    handleLogin = () => {

    }
    handleCancel = () => {
      const { BaseActions } = this.props;
      BaseActions.hideModal('login');
    }
    handleChange = (e) => {

    }
    handleKeyPress = (e) => {

    }
    render() {
      const {
        handleLogin, handleCancel, handleCahnge, handleKeyPress
      } = this;
      const {visible} = this.props;

      return (
        <LoginModal
          onLogin={handleLogin}
          onCancel={handleCancel}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          visible={visible}
        ></LoginModal>
      );
    }
  }

  export default connet(
    (state) => ({
      visible: state.base.getIn(['modal', 'login'])
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  )(LoginModalContainer)
  
  /*
    지금은 바로 구현 가능한 handleCancel 메서드만 준비하고, 나머지는 추후 구현
    로그인 모달은 전역적으로 사용하는 모달이기 때문에  App에서 렌더링한다.
    전역에서 사용할 컴포넌트가 많아지면 App 컴포넌트의 렌더 함수가 복잡해지므로 주의한다.

    따라서 Base 컨테이너 컴포너트를 만들어 그 안에 LoginModalContainers를 렌더링 하기
    Base를 컨테이너로 만드는 이유는 페이지를 새로고침할 때마다 현재 유저가 로그인 중인지 검증 하는데
    이 작업을 Base 컴포넌트에서 처리한다.
  */

  // src/containers/common/Base.js
  import React, { Component } from 'react';
  import LoginModalContainer from 'containers/modal/LoginModalContainer';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as baseActions from 'store/modules/base';

  class Base extends Component {
    initialize = async () => {
      // 로그인 상태 확인(추후 작성)
    }
    componentDidMount() {
      this.initialize();
    }
    render() {
      return (
        <div>
          <LoginModalContainer>
            {/*전역적으로 사용하는 컴포넌트들이 있다면 여기에서 렌더링 한다.*/}
          </LoginModalContainer>
        </div>
      )
    }
  }
  
  export default connect({
    null,
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  })(Base);

  // 이 컴포넌트는 App에서 Switch 아래쪽에서 렌더링 된다.
  // src/components/App.js
  import React from 'react';
  import { Switch, Route } from 'react-router-dom';
  import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';
  import Base from 'containers/ommon/Base';

  const App = () => {
    return (
      <div>
        <Switch>
          (...)
        </Switch>
      </div>
    );
  }

  export default App;
```

### Footer에서 관리자 로그인 버튼을 누르면 로그인 모달 띄우기
```javascript
  /*
    Footer에서 나타나는 관리자 로그인 버튼을 누르면 로그인 모달 띄우기
    Footer에서 리덕스 액션 호출을 통해야 하므로 FooterContainer 컴포넌트를 만든다.
  */
  // src/containers/common/FooterContainer.js
  import React, { Component } from 'react';
  import Footer from 'components/common/Footer';
  import { connect } from 'react-redux';
  import { bindActionCreators } from 'redux';
  import * as baseActions from 'store/modules/base';

  class FooterContainer extends Component {
    handleLoginClick = async () => {
      const { BaseActions } = this.props;
      return (
        <Footer onLoginClick={handleLoginClick}></Footer>
      );
    }
  }

  export default connect(
    (state) => ({
      // 추후 입력
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  )(FooterContainer)

  /*
    handleLoginClik 메서드를 만들어 이를 Footer에 onLoginClick props로 전달한 후
    Footer 컴포넌트에서 이 함수를 받아 와 로그인 버튼에 onClik으로 설정해야 한다.
  */
  // src/components/common/Footer/Footer.js - Footer
  const Footer = ({onLoginClick}) => (
    <footer className={cx('footer')}>
      <Link to="/" className={cx('brand')}>reactblog</Link>
      <div onClick={onLoginClick} className={cx('admin-login')}>관리자 로그인</div>
    </footer>
  );

  // PageTemplate 컴포넌트에서 기존 Footer 컴포넌트를 대체한다.
  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import classNames from 'classnames/bind';
  import HeaderContainer from 'containers/common/HeaderContainer';
  import FooterConrainer from 'containers/common/FooterContainer';

  const cx = classNames.bind(styles);

  const PageTemplate = ({ children }) => {
    <div className={cx('page-template')}>
      <HeaderContainer>
        <main>
          {children}
        </main>
      </HeaderContainer>
    </div>
  }

  export default PageTemplate;
```

### 로그인 기능 구현
```javascript
  /*
    로그인 모달을 띄웠으니 로그인 API를 연동해 주기
    API 추가
  */
  // src/lib/api.js
  (...)
  export const login = (password) => axios.get('/api/auth/login', { password });
  export const checkLogin = () => axios.get('api/auth/check');
  export const logout = () => axios.get('api/auth/logout');

  /*
    이제 base 리덕스 모듈을 열어 이 함수들을 사용하는 액션 만들기

    로그인 모달에 있는 인풋 값을 설정하는 액션과 로그인 모달 상태를 초기화 하는 액션 만들기
  */
  // src/store/modules/base.js
  (...)
  import * as api from 'lib/api';

  // action types
  const LOGIN = 'base/LOGIN';
  const LOGOUT = 'base/LOGOUT';
  const CHECK_LOGIN = 'base/CHECK_LOGIN';
  const CHANGE_PASSWORD_INPUT = 'base/CHANGE_PASSWORD_INPUT';
  const INITALIZE_LOGIN_MODAL = 'base/INITALIZE_LOGIN_MODAL';

  // action creators
  (...)

  export const login = createAction(LOGIN, api.login);
  export const logout = createAction(LOGOUT, api.logout);
  export const checkLogin = createAction(CHECK_LOGIN, api.checkLogin);
  export const changePasswordInput = createAction(CHANGE_PASSWORD_INPUT);
  export const initializeLoginModal = createAction(INITIALIZE_LOGIN_MODAL);

  // initial state
  const initialState = Map({
    // 로그인 모달 상태
    loginModal: Map({
      password: '',
      error: false
    }),
    logged: false // 현재 로그인 상태
  });

  // reducer
  export default handleActions({
    (...)
    ...pender({
      type: LOGIN,
      onSuccess: (state, action) => { // 로그인 성공할 때
        return state.set('logged', true);
      },
      onError: (state, action) => { // 오류가 발생할 때
        return state.setIn(['loginModal', 'error'], true)
                    .setIn(['loginModal', 'password'])
      }
    }),
    ...pender({
      type: CHECK_LOGIN,
      onSuccess: (state, action) => {
        const { logged } = action.payload.data;
        return state.set('logged', logged);
      }
    }),
    [CHAGE_PASSWORD_INPUT]: (state, action) => {
      const { payload: value } = action;
      return state.setIn('loginModal', 'password'], value);
    },
    [INITIALIZE_LOGIN_MODAL]: (state, action) => {
      // 로그인 모달의 상태를 초기 상태로 설정(텍스트/오류 초기화)
      return state.set('loginModal', initialState.get('loginModal'));
    }
  }, initialState)

  /*
    이제 로그인 기능을 구현할 준비가 끝났으니 컴포넌트를 수정하기
    먼저 LoginModalContainer쪽에 아직 구현하지 않은 메서드를 완성하기
    이 컴포넌트에서 필요한 리덕스 스토어 안에 있는 정보를 가져오려면,
    LoginModal의 error 값과 password 값을 받아 와서 컴포넌트 파일 아래쪽 connect 부분의 props에 넣기
  */
  // src/containers/modal/LoginModalContainer.js - 내부 메서드
  (...)
  class LoginModalContainer extends Component {
    handleLogin = async() => {
      const { BaseActions, password } = this.props;
      try {
        // 로그인 시도, 성공하면 모달 닫기
        await BaseActions.login(password);
        BaseActions.hideModal('login');
      } catch(e) {
        console.log(e);
      }
    }
    handleCancel = () => {
      const { BaseActions } = this.props;
      BaseActions.hideModal('login');
    }
    handleChange = (e) => {
      const { value } = e.target;
      const { BaseActions } = this.props;
      BaseActions.changePasswordInput(value);
    }
    handleKeyPress = (e) => {
      // 엔터 키를 누르면 로그인 호출
      if(e.key === 'Enter') {
        this.handleLogin();
      }
    }
    render() {
      const {
        handleLogin, handleCancel, handleCahnge, handleKeyPress
      } = this;
      const { visible, error, password } = this.props;

      return (
        <LoginModal
          onLogin={handleLogin}
          onCancel={handleCancel}
          onChange={handleChange}
          onKeyPress={handlKeyPress}
          visible={visible}
          error={error}
          pssword={password}
        ></LoginModal>
      )
    }
  }

  export default connect(
    (state) => ({
      visible: state.base.getIn(['modal', 'login']),
      password: state.base.getIn(['loginModal', 'password']),
      error: state.base.getIn(['loginModal', 'error'])
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  )(LoginModalContainer);

  /*
    이제 페이지 아래쪽에 있는 관리자 로그인 버튼을 눌러 로그인 모달 띄우기
    비밀번호 입력후 로그인 확인하기
    모달이 자동으로 닫히며 정상 동작
    잘못된 비밀번호 입력시 오류가 나는지 확인
  */
```

### FooterContainer 완성
```javascript
  /*
    로그인 상태 일 때는 FooterContainer에서 로그아웃을 할 수 있도록 현재 로그인 상태를 Footer로 전달하기
    로그인 상태일 때는 로그아웃 API를 호출하고 새로 고침하도록 handleLoginClick메서드 실행하기
  */
  // src/containers/common/FooterContainer.js
  (...)
  class FooterContainer extends Component {
    handleLoginClick = async() => {
      const { BaseActions, logged } = this.props;
      if(logged) {
        try {
          await BaseActions.logout();
          window.location.reload();
        } catch (e) {
          console.log(e)
        }
        return;
      }
      BaseActions.showModal('login');
      BaseActions.initializeLoginModal();
    }
    render() {
      const { handleLoginClik } = this;
      const { logged } = this.props;

      return (
        <Footer onLoginClick={handleLoginClick} logged={logged}></Footer>
      );
    }
  }

  export default connect(
    (state) => ({
      logged: state.base.get('logged')
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  )(FooterContainer);
```

### 페이지 로딩할 때의 로그인 상태 확인
```javascript
  /*
    로그인 상태에서 페이지를 새로고침하면 상태가 초기화된다.
    리덕스 스토어 안에 있는 상태는 페이지를 새로 불러왔을때 보존되지 않기 때문

    현재 서버 세션상으로는 로그인 상태를 유지하기 때문에, 이전에 만든 checkLogin API를 호출하여 로그인 상태를 확인한 후 리덕스 스토어에 반영하기

    이 작업은 Base 컴포넌트에서 수행한다. initialize 함수 작성하기
  */
  // src/containers/common/Base.js - initialize
  initialize = async() => {
    const { BaseActions } = this.props;
    BaseActions.checkLogin();
  }

  /*
    아이디어가 좋다 새로고침시마다 함수를 호출하는 식으로 로그인을 확인하다니!!
    하지만 checkLogin API가 응답할 때까지는 클라이언트에서 로그아웃 상태로 간주한다.
    따라서 유저가 로그인 했다면 새로고침을 해도 checkLogin이 응답할 때까지는 임시적으로 로그인 상태를 유지해야 함
    이는 HTML5의 localStorage를 사용하여 구현 가능
    localStorage에 값을 넣으면 페이지를 새로고침하거나 웹 브라우저를 닫았다 열어도 값을 유지한다.
    하지만 주의할 점은 값이 문자열 형태로 들어가므로 객체, 숫자, Boolean등 값을 넣으면 JSON.stringify/JSON.parse를 사용하거나 문자열로 취급해야 한다.
    로그인 상태를 설정할 수 있도록 TEMP_LOGIN 액션을 준비한다.
  */
  // src/store/modules/base.js
  (...)

  // action types
  (...)
  const TEMP_LOGIN = 'base/TEMP_LOGIN';
  
  // action creators
  (...)
  export const tempLogin = createAction(TEMP_LOGIN);

  // initial state
  (...)

  // reducer
  export default handleACtions({
    (...)
    [TEMP_LOGIN]: (state, action) => {
      return state.set('logged', true);
    }
  }, initalState)

  /*
    이제 상황에 따라 localStorage에 값을 넣거나 조회하기
    먼저 로그인 성공했을 때 localStorage의 logged 값을 "true"로 설정하기
  */
  // src/containers/modal/LoginModalContainer.js - handleLogin
  handleLogin = async() => {
    const { BaseActions, password } = this.props;
    try {
      // 로그인 시도, 성공하면 모달 닫기
      await BaseActions.login(password);
      BaseActions.hideModal('login');
      localStorage.logged = "true";
    } catch(e) {
      console.log(e);
    }
  }
  /*
    페이지를 로딩할 때 localStorage의 logged 값을 불러온 후 이 값에 따라 
    TEMP_LOGIN 액션을 호출한다.
  */
  // src/containers/common/Base.js - initialize
  initialize = () => {
    const { BaseActions } = this.props;
    if(localStorage.logged === "true") {
      BaseActions.tempLogin();
    }
    BaseActions.checkLogin();
  }
  /*
    로그인했을때 localStorage에 로그인 상태를 저장하여 이 상태가 존재한다면 checkLogin API가 응답하기 전부터 로그인 중인것으로 간주한다.

    이는 임시적으로 로그인 상태로 만든 것이므로, 서버 세션에서 로그인 상태가 아니라면 다시 로그인
    상태가 비활성화 된다.
  */
  // src/FooterContainer.js
  /*
    로그 아웃 했을 때 localStorage: logged 삭제하기
  */
  if(logged) {
    try {
      await BaseActions.logout();
      localStorage.removeItem('logged');
      window.location.reload();
    } catch(e) {
      console.log(e);
    }
    return;
  }
```

### 로그인할 때만 포스트 작성, 수정, 삭제 버튼 보여 주기
```javascript
  /*
    로그인 기능을 구현했으니, 이에 따라 비로그인 상태일 때는 기능을 제한한다.
    비로그인 상태에서는 포스트 작성, 수정, 삭제를 할 수 없다.

    기능을 제한하려면 먼저 HeaderContainer에서 스토어의 logged 값을 연동시키고, 이를 Header 컴포넌트로 전달한다.
  */
  // src/containers/common/HeaderContainer.js
    (...)
    render() {
      const { handleRemove } = this;
      const { match, logged } = this.props;

      const { id } = match.params;

      return (
        <Header
          postId={id}
          logged={logged}
          onRemove={handleRemove}
        ></Header>
      )
    }
  }

  export default connect(
    (state) => ({
      logged: state.base.get('logged')
    }),
    (dispatch) => ({
      BaseActions: bindActionCreators(baseActions, dispatch)
    })
  )(withRotuer(HeaderContainer));

  // src/components/common/Header/Headr.js
  (...)

  const Header = ({ postId, logged, onRemove }) => (
    <header className={cx('header')}>
      <div className={cx('header-content')}>
        <div className={cx('brand')}>
          <Link to="/">reactblog</Link>
        </div>
        { 
          logged && 
          <div className={cx('right')}>
            {
              // flex를 유지하려고 배열 형태로 렌더링 한다.
              postId && [
                <Button key="edit" theme="online" to={`/editor?id=${postId}`}>수정</Button>
                <Button key="remove" theme="online" onClick={onRemove}>삭제</Button>
              ]
            }
            <Button theme="outline" to="/editor">새 포스트</Button>
          </div> 
        }
      </div>
    </header>
  )

  export default Header;
  // 이제 로그인을 하지 않으면 헤더에서 오른쪽에 있던 버튼들이 사라지고, 로그인을 하면 다시 나타난다.
  /*
    정리
      1. UI 준비하기(프리젠테이셔널 컴포넌트 만들기)
      2. 리덕스 상태 관리하기
      3. 컨테이너 컴포넌트 만들기

    리액트로 웹 어플리케이션을 만든다는 것을 결국 이 세가지 작어을 반복
    요구 사항에 따라 사전에 백엔드를 개발 해야 함

    숙련공이 될수록 노하우 및 속도가 빨라질 것이다.
  */
```
