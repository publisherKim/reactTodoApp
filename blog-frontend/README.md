# 블로그 프로젝트
```
  20.1 프로젝트 구조 잡기
  20.2 기본 유저 인터페이스 생성
  20.3 PostList 페이지 UI 구현
  20.4 Post 페이지 UI 구현
  20.5 Editor 페이지 UI 구현
  20.6 마크다운 에디터 구현
  20.7 정리

  todo List
    - 기본 구조 잡기
    - 라우터 및 리덕스 설정
    - 프로젝트에 필요한 유저 인터페이스를 개발
```

## 프로젝트 구조 잡기
### 프로젝트 생성
```
  blog backend service 와 연동할 예정
  create-react-app blog-frontend

  Sass와 CSS 모듈을 결합하여 컴포넌트를 스타일링하고, 리덕스로 상태를 관리 하며, 리액트 라우터로는 여러 페이지를 관리한다.
  프로젝트를 완성한 후에는 추가로 코드 스플리팅과 서버사이드 렌더링을 구현함
  프로젝트의 디렉토리 구조 형성하기
```

### 주요 디렉토리 생성
```
  src 내부에 주요 디렉토리 만들기
    components
    containers
    lib
    pages
    store
    styles

    components: 리덕스 상태에 연결되지 않은 프리젠테이셔널 컴포넌트들이 들어 있음 각 스타일도 함께 넣음
    containers: 리덕스 상태와 연결된 컨테이너 컴포넌트들이 드어 있음
    lib: 백엔드 API 함수들과 코드 스플리팅할 때 사용하는 asyncRoute가 들어 있음
    pages: 라우터에서 사용할 각 페이지 컴포넌트 들이 들어 있음
    store: Ducks 구조를 적용시킨 리덕스 모듈들과 스토어 생성 함수가 들어 있음
    styles: 폰트, 색상, 반응형 디자인 도구, 그림자 생성 함수 등 프로젝트에서 전역적으로 필요한 스타일 관련 코드들이 들어 있음
```

### 불필요한 파일 제거
```
  기본 구조로 잡힌 불필요한 파일인 App.css, App.js, App.test.js, index.css, logo.svg를 제거한다.
```
### Sass 및 CSS 모듈 적용
```javascript
  /*
    config file: yarn eject
    yarn add node-sass sass-loader classnames
  */
  
  // config/paths.js 
  module.exports = {
    dotenv: resolveApp('.env'),
    appBuild: resolveApp('build'),
    appPublic: resloveApp('public'),
    appHtml: resolveApp('public/index.html'),
    appIndexJs: resolveApp('src/index.js'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    yarnLockFile: resolveApp('yarn.lock'),
    testSetup: resolveApp('src/setupTests.js'),
    appNodeModules: resolveApp('node_modules'),
    publicUrl: getPublicUrl(resolveApp('package.json')),
    servedPath: getServedPath(resolveApp('package.json')),
    globalStyles: resolveApp('src/styles')
  };

  // config/webpack.config.dev.js - sass-loader 설정
  {
    test: /\.css$/,
    (...)
  },
  {
    test: /\.scss$/,
    use: [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]',
          modules: 1,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          (...)
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: {
          includePaths: [paths.globalStyles]
        }
      }
    ],
  },
  // css-loader 옵션을 변경하고, 배열이 끝나기 전에 sass-loader를 설정, globalStyles를 includePaths로 설정 하면 스타일 설정 끝

  // config/webpack.config.prod.js - sass-loader 설정
  {
    test: /\.css$/,
    (...)
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      Object.assign(
        {
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true,
                sourceMap: shouldUseSourceMap,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                modules: 1,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                (...)
              }
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                includePaths: [paths.globalStyles]
              }
            },
          ]
        },
        extractTextPluginOptions
      )
    )
  }
```

## 라우터와 리덕스 적용
```
  yarn add react-router-dom redux redux-actions react-redux redux-pender immutable
```

### 루트 컴포넌트 설정
```javascript
  /*
    설치를 완료한 후 src/Root 컴포넌트 만들기
    root 컴포넌트는 App 컴포넌트를 웹브라우저에서 사용하는 라우터인 BrowserRouter 컴포넌트 안에 감쌀 것
    나중에 서버사이드 렌더링을 구현할 때는 서버 렌더링 전용 라우터인 StaticRoutter 컴포넌트에 App을 감싸서 사용
  */
  
  // src/Root.js
  import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import App from 'components/App';

  const Root = () => {
    return (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  }

  export default Root;

  /*
    App 컴포넌트 만들기
    그전에 컴포넌트를 불러올 때 경로를 절대 경로로 입력할 수 있도록 NODE_PATH를 설정
    이전에는 package.json의 scripts 부분에서 설정했었던걸 .env 파일을 사용하게 변경
  */

  // .env
  NODE_PATH=src

  // src/components/App.js
  import React from 'react';

  const App = () => {
    return (
      <div>
        BlogApp
      </div>
    )
  };

  export default App;

  // index.js
  import React from 'react';
  import ReactDom from 'react-dom';
  import Root from './Root';
  import * as serviceWorker from './serviceWorker';

  React.DOM.render(<Root />, document.getElementById('root'));

  serviceWorker.register();
```

### 리덕스 설정
```javascript
  /*
    리덕스를 설정하려면 프로젝트에서 필요한 모듈들을 먼저 만들어야 함
    이 프로젝트에 필요한 리덕스 모듈은 모두 네 종류

    base: 로그인 상태, 삭제 및 로그인할 때 보이는 모달 상태를 다룸
    editor: 마크다운 에디터 상태를 다룸
    list: 포스트 목록 상태를 다룸
    post: 단일 포스트 상태를 다룸

    이 모듈들의 세부 코드는 나중에 작성함.
    지금은 store 디렉터리에 modules 디렉터리를 만들고 base.js, editor.js, list.js, post.js
    파일들을 내부에 생성하여 동일한 내용으로 코드를 작성
  */

  // src/store/modules/base.js, editor.js, list.js, post.js
  import { createAction, handleActions } from 'redux-actions';

  import { Map } from 'immutable';
  import { pender } from 'redux-pender';

  // action types

  // action creators

  // initial state
  const initialState = Map({});

  // reducer
  export default handleActions({

  }, initialState);

  /*
    다음으로 이 모듈을 전부 불러와 내볼낼 인덱스 파일을 만듬
    이 과정에서 비동기 액션을 관리하는 redux-pender의 penderReducer도 불러와 내보내기
  */

  // src/store/modules/index.js
  export { default as editor } from './editor';
  export { default as list } from './list';
  export { default as post } from './post';
  export { default as base } from './base';
  export { penderReducer as pender } from 'redux-pender';

  /*
    리덕스 모듈을 준비했으니 configure.js 파일을 만들어 스토어를 생성하는 함수인 configure를 구현
    함수를 따로 만드는 이유는 스토어를 크라이언트에서 생성하지만, 추후 서버사이드 렌더링을 할 때 서버에서도 호출해야 하기 때문

    방금 만든 모듈을 combineReducers로 합쳐 주고, penderMiddleware도 적용하고
    개발 환경에서는 Redux Devtiiks를 사용하도록 설정
  */
  // src/store/configure.js
  import { createStore, applyMiddleware, compose, comibneReducers } from 'redux';
  import penderMiddleware from 'redux-pender';
  import * as modules from './modules';

  const reducers = combineeducers(modules);
  const middlewares = [penderMiddleware()];

  // 개발 모드일 때만 Redux Devtools를 적용
  const isDev = process.env.NODE_ENV === 'development';
  const devtools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const comoseEnhancers = devtools || compose;

  // perloadedState는 추후 서버사이드 렌더링을 했을 때 전달받는 초기 상태
  const configure = (preloadedState) => createStore(reducers, preloadedState, composeEnhancers(applyMiddleware(...middlewares)));

  export default configure;

  /*
    스토어 생성 준비 끝
    Root 컴포넌트에서 configure 함수를 호출하여 스토어를 생성하고, Provider 컴포넌트로 BrowserRouter를 감싼다.
  */

  // src/Root.js
  import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import App from 'components/App';
  import { Provider } from 'react-redux';
  import configure from 'store/configure';

  const store = configure();

  const Root = () => {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <App></App>
        </BrowserRouter>
      </Provider>
    );
  };

  export default Root;
```

### 라우트 지정
```javascript
  /*
    프로젝트에 필요한 라우트에서 사용할 페이지 컴포넌트 만들기
    라우터는 총 6 종류
      1. 홈
      2. 포스트 목록
      3. 포스트 목록(태그 설정)
      4. 포스트 읽기
      5. 에디터
      6. 404 페이지
  */

  // src/pages/ListPage.js
  import React from 'react';

  const ListPage = () => {
    return (
      <div>
        List
      </div>
    );
  };

  export default ListPage;

  // src/pages/PostPage.js
  import React from 'react';

  const PostPage = () => {
    return (
      <div>
        Post
      </div>
    );
  };

  export default PostPage;

  // src/pages/EditorPage.js
  import React from 'react';

  const EditorPage = () => {
    return (
      <div>
        Editor
      </div>
    );
  };

  export default EditorPage;

  // src/pages/NotFoundPage.js
  import React from 'react';

  const NotFoundPage = () => {
    return (
      <div>
        Not Found
      </div>
    );
  };

  export default NotFoundPage;

  // src/pages/index.js
  export { default as ListPage } from './ListPage';
  export { default as PostPage } from './PostPage';
  export { default as EditorPage } from './EditorPage';
  export { default as NotFoundPage } from './NotFoundPage';

  /*
    이제 이 컴포넌트들을 불러와 App 컴포넌트에서 라우트를 적용하기
  */

  // src/components/App.js
  import React from 'react';
  import { Switch, Route } from 'react-router-dom';
  import { ListPage, PostPage, EditorPage, NotFoundPage } from 'pages';

  const App = () => {
    return (
      <div>
        <switch>
          <Route exact path="/" component={ListPage}></Route>
          <Route exact path="/page/:page" component={ListPage}></Route>
          <Route exact path="/tag/:tag/:page?" component={ListPage}></Route>
          <Route exact path="/post/:id" component={PostPage}></Route>
          <Route exact path="/editor" component={EditorPage}></Route>
          <Route component={NotFoundPage}></Route>
        </switch>
      </div>
    );
  };

  export default App;

  /*
    여기에서 사용한 리액트 라우터의 Switch 컴포넌트는 설정된 라우트 중에서 일치하는 라우트 하나만 보여줌
    맨 아래쪽에 설정된 NotFoundPage에는 path를 지정하지 않았기 때문에 어떤 경우에도 렌더링이 됨
    Switch로 감쌌으므로 먼저 매칭된 라우트 하나만 보여줌
    따라서 ListPage, PostPage, EditorPage를 보여야 할 때는 렌더링 하지 않지만, 그 어떤 라우트에도 일치하지 
    않을 경우 NotFoundPage를 보여 줌
  */
```

## 기본 유저 인터페이스 생성
```
  프로젝트의 구조 잡기가 끝났으니 이번에는 기본 유저 인터페이스를 구성해 보자.
```

### PageTemplate, Header, Footer 컴포넌트 생성

### 컴포넌트 생성
```javascript
  /*
    유저 인터페이스 컴포넌트 만들기
    컴포넌트는 종류별로 디렉터리를 나누어 만듬
    Sass와 CSS 모듈을 사용하므로 각 컴포넌트마다 디렉토리를 하나씩 만듬

    컴포넌츠 디렉토리애 커몬 디렉터리를 만듬
    커먼 디렉터리에는 페이지 두 개 이상에서 사용하는 컴포넌트들을 넣기

    common 내부에 PageTemplate 디렉터리를 만들고, 다음 파일들을 생성
  */
  
  // src/components/common/PageTemplate/PageTemplate.scss
  .page-Template {

  }

  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  const PageTemplate = () => (
    <div className={cx('page-template')}>
      PageTemplate
    </div>
  );

  export default PageTemplate;

  // src/components/common/PageTemplate/index.js
  export { default } from './PageTemplate';

  // VS Code의 generate-react-component를 사용하는 것
```

### VSCODE generate-react-component
```
  plugin: generate-react-component 설치
  template 내려 받기
  git clone https://github.com/vlpt-playground/react-sass-component-template.git
  cd react-sass-component-template
  pwd(경로 확인)

  vscode 기본설정 세팅하기
  {
    "generate-react-component.componentTemplatePath":
    "C:\study\chapter10\react-sass-component-template"
  }

  Generate new component 메뉴를 선택해서 템플릿 만들기
```

### 글로벌 스타일 및 스타일 유틸 설정
```scss
  /*
    프로젝트의 폰트 및 전역적으로 사용되는 스타일 지정
    styles 디렉토리에 base.scss 파일을 만들기
  */

  // src/styles/base.scss
  /* body, 타이포그래피 등 기본 스타일 설정 */
  @import url("//fonts.googlepis.com/earlyaccess/notosankr.css");
  @import url("//cdn.jsdelivr.net/gh/velopert/font-d2coding@1.2.1/d2coding.css");

  body {
    margin: 0;
    box-sizing: border-box;
    font-family: "Noto Sans KR", san-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // box-sizing 일괄 설정
  * {
    box-sizing: inherit;
  }

  // 링크 스타일 밑줄 및 색상 무효화
  a {
    text-decoration: inherit;
    color: inherit;
  }
```

### 스타일 유틸 설정
```scss
  /*
    open-color: 색상 선택 용이
    include-media: 반응형 디자인 적용 용이
    yarn add open-color include-media
  */
  
  // src/styles/lib/_all.scss
  @import '~open-color/open-color';
  @import '~include-media/dist/include-media';

  // material-shadow: 그림자를 쉽게 서렁할수 있음
  // src/styles/lib/_mixins.scss
  // source: https://codepen.io/dbox/pen/RawBEW
  @mixin material-shadow($z-depth: 1, $strength: 1, $color: black) {
    @if $z-depth == 1 {
      box-shadow: 0 1px 3px rgba($color, $strength * 0.14), 0 1px 2px rgba($color, $strength * 0.24);
    }
    @if $z-depth == 2 {
      box-shadow: 0 3px 6px rgba($color, $strength * 0.16), 0 3px 6px rgba($color, $strength * 0.23);
    }  
    @if $z-depth == 3 {
      box-shadow: 0 10px 20px rgba($color, $strength * 0.19), 0 6px 6px rgba($color, $strength * 0.23);
    }    
    @if $z-depth == 4 {
      box-shadow: 0 15px 30px rgba($color, $strength * 0.25), 0 10px 10px rgba($color, $strength * 0.22);    
    }
    @if $z-depth == 5{
      box-shadow: 0 20px 40px rgba($color, $strength * 0.30), 0 15px 12px rgba($color, $strength * 0.22);   
    }
    @if ($z-depth < 1) or ($z-depth > 5) {
      @warn "$z-depth must be between 1 and 5";
    }
  }

  // 믹스인을 작성한 후에는 이 파일을 styles/lib/_all.scss에서 불러오기
  // src/styles/lib/_all.scss
  @import '~open-color/open-color';
  @import '~include-media/dist/include-media';
  @import 'mixins';

  // styles/utils.scss 파일을 만들어 작성한 것들을 불러오기, 추가로 반응형 디자인을 참조할 구간을 변수로 저장하기
  // src/styles/utils.scss
  @import 'lib/all';

  $breakpoints(small: 320px, medium: 768px, large: 1024px, wide: 1400px);
  // 반응형 디자인 화면 크기가 클때, 중간 크기일 때, 모바일 크기일 때에 따라 다른 스타일을 보여줌

  /*
    색상 팔레트는 https://yeun.github.io/open-color/ 확인 가능
    앞으로 컴포넌트 스타일을 작성할 때  유틸에 적용한 코드를 사용하려면
    스타일 파일 위쪽에 다음 코드를 삽입해야 함
  */
  @import 'utils';
```

### Header 컴포넌트 생성
```javascript
  // src/components/common/Header/Header.js
  import React from 'react';
  import styles from './Header.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';

  const cx = classNames.bind(styles);

  const Header = () => (
    <header className={cx('header')}>
      <div className={cx('header-content')}>
        <div className={cx('brand')}>
          <Link to="/">reactblog</Link>
        </div>
        <div className={cx('right')}>
          {/* 조건에 따라 버튼 렌더링 */}
          오른쪽
        </div>
      </div>
    </header>
  );

  export default Header;
```

```scss
  // src/components/common/Header/Header.scss
  @import 'utils';

  .header {
    background: $oc-blue-6;
      .header-content {
        height: 5rem;
        width: 1400px;
        margin: 0 auto;
        padding-left: 3rem;
        padding-right: 3rem;

        // 내부 아이템 세로 가운데 정렬
        display: flex;
        align-items: center;

        // 반응형 레이아웃
        @include media("<wide") {
          width: 100%;
        }
        @include media("<medium") {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .brand {
          // logo
          colo: white;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .right {
          // 오른쪽 내용
          margin-left: auto;
        }
      }
  }
```

```javascript
  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import classNames from 'classnames/bind';
  import Header from 'components/common/Header';

  const cx = classNames.bind(styles);

  const PageTemplate = () => (
    <div className={cx('page-template')}>
      <header></header>
    </div>
  );

  // src/pages/ListPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';

  const ListPage = () => {
    return (
      <PageTemplate>
        List
      </PageTemplate>
    );
  };
  
  export default ListPage;
```