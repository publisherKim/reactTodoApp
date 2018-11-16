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

### Footer 컴포넌트 생성
```javascript
  /*
    처음에는 별도의 인증없이 포스트 작성, 수정 삭제 가능
    후반에는 간단한 비밀번호 인증을 구현
      - 로그인
      - 로그아웃
  */

  // src/components/common/Footer/Footer.js
  import React from 'react';
  import styles from './Footer.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';

  const cx = classNames.bind(styles);

  const footer = () => (
    <footer className={cx('footer')}>
      <Link to="/" className={cx('brand')}>reactblog</Link>
      <div className={cx('admin-login')}>관리자 로그인</div>
    </footer>
  );

  export default Footer;
```
```scss
  // 푸터 스타일링
  // src/components/common/Footer/Footer.scss
  @import 'utils';

  .footer {
    background: $oc-gray-7;
    height: 10rem;

    // 내부 내용 가운데 정렬
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column; // 위에서 아래로

    .brand {
      // 로고
      color: white;
      font-size: 2rem;
      font-weight: 600;
    }

    .admin-login {
      // 로그인 버튼
      margin-top: 0.5rem;
      font-weight: 600;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      &:hover {
        color: white;
      }
    }
  }
```
```javascript
  // PageTemplate에서 렌더링 하기
  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import classNames from 'classnames/bind';
  import Header from 'components/common/Header';
  import Footer from 'components/common/Footer';

  const cx = classNames.bind(styles);

  const PageTemplate = () => (
    <div className={cx('page-template')}>
      <Header></Header>
      <Footer></Footer>
    </div>
  );

  export default PageTemplate;
```

### PageTemplate 중간 영역 설정
```javascript
  /*
    PagetTemplate에서 Header와 Footer 사이, 즉 중간 영역의 배경색을 회색으로 지정하고,
    Footer가 언제나 페이지 아래쪽에 위치하도록 중간 영역의 최소 높이를 설정
  */
  // src/components/common/PageTemplate/PageTemplate.js
  import React from 'react';
  import styles from './PageTemplate.scss';
  import classNames from 'classnames/bind';
  import Header from 'components/common/Header';
  import Footer from 'components/common/Footer';

  const cx = classNames.bind(styles);

  const PageTemplate = ({children}) => (
    <div className={cx('page-template')}>
      <Header></Header>
      <main>
        {children}
      </main>
      <Footer></Footer>
    </div>
  );

  export default PageTemplate;  
```

### 버튼 생성
```javascript
  /*
    to 값을 props로 전달했을 때는 Link 컴포넌트를 사용하고, to 값이 없을 때는 div 태그를 사용한다.
    theme props를 받아서, 이에 따라 다른 스타일을 설정
    Generate new component
  */

  // src/components/common/Button/Button.js
  import React from 'react';
  import styles from './Button.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';

  const cx = classNames.bind(styles);

  // 전달받은 className, onClick 등 값들이 rest 안에 들어 있음
  // JSX에서 ...을 사용하면 내부에 있는 값들을 props로 넣어 줌
  const Div = ({children, ...rest}) => <div {...rest}>{children}</div>;

  const Button = ({
    children, to, onClick, disabled, theme = 'default',
  }) => {
    // to 값이 존재하면 Link를 사용하고, 그렇지 않으면 div를 사용
    // 비활성화되어 있는 버튼일 때도 div를 사용
    const Element = ( to && !disabled ) ? Link : Div;

    // 비활성화하면 onClick은 실행되지 않음
    // disabled 값이 true가 되면 className에 disabled를 추가함
    return (
      <Element
        to={to}
        className={cx('button', theme, {disabled})}
        onClick={disabled ? () => null : onClick}
      >
        {children}
      </Element>
    );
  }

  export default Button;
  /*
    버튼에 옵션이 많은 이유 기능이 비슷한 컴포넌트를 여러 개 만드는 것보다 
    재사용 가능한 컴포넌트를 만드는게 좋다.
  */
```
```scss
  /*
    버튼 테마 
      - default
      - outline
      - gray
    비활성화시: disbled 클래스 적용
  */
  @import 'utils';

  .button {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-weight: 600;
    font-size: 0.9rem;
    color: white;
    cursor: pointer;
    user-select: none;  // 드래그 방지
    display: inline-flex;

    // default: 파란색 버튼
    &.default {
      background: $oc-blue-6;
      &:hover {
        background: $oc-blue-5;
      }
      &:active {
        background: $oc-blue-6;
      }
    }

    // gray: 회색 버튼
    &.gray {
      background: $oc-gray-7;
      &:hover {
        background: $oc-gray-6;
      }
      &:active {
        background: $oc-blue-7;
      }
    }

    // outline: 횐색 테두리 버튼
    &.outline {
      border: 2px solid white;
      border-radius: 2px;
      &:hover {
        background: white;
        color: $oc-blue-6;
      }
      &:active {
        background: rgba(255, 255, 255, 0.85);
        border: 2px solid rgba(255, 255, 255, 0.85);
      }
    }

    &:hover {
      @include material-shadow(2, 0.5); // 마우스 커서가 위에 있으면 그림자 생성
    }

    // 비활성화된 버튼
    &.disabled {
      background: $oc-gray-4;
      color: $oc-gray-6;
      cursor: default;
      &:hover, &:active {
        box-shadow: none;
        background: $oc-gray-4;
      }
    }

    // 버튼 두 개 이상이 함께 있다면 중간 여백
    & + & {
      margin-left: 0.5rem;
    }
  }
```
```javascript
  // 버튼 렌더링 하기
  // src/components/common/Header/Header.js
  import React from 'react';
  import styles from './Header.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';
  import Button from 'components/common/Header/Header.js';

  const cx = classNames.bind(styles);

  const Header = () => (
    <header className={cx('header')}>
      <div className={cx('header-content')}>
        <div className={cx('brand')}>
          <Link to="/">reactblog</Link>
        </div>
        <div className={cx('right')}>
          <Button theme="outline" to="/editor">새 포스트</Button>
        </div>
      </div>
    </header>
  );

  export default Header;
```

## PostList 페이지 UI 구현
```
  PostList 페이지에 필요한 유저 인터페이스 구현
  포스트 목록과 관련된 컴포넌트들을 사용
  공용으로 쓰던 컴포넌트를 common 디렉토리에 넣었던 것처럼
  PostList에서 보이는 컴포넌트들을 list 디렉터리에 만들기

  components 디렉터리에 list 디렉터리를 만들고,
  내부에는 Generate new component 메뉴를 사용하여 다음 컴포넌트 만들기
    - ListWrapper: 페이지 내부의 컴포넌트들을 감싸 줌
    - Pagination: 다음 -> 이전 페이지로 이동
    - PostList: 포스트 목록을 보여 줌
```

### ListWrapper 컴포넌트
```javascript
  /*
    ListWrapper 컴포넌트는 내부 내용을 페이지 한가운데에 정렬시켜 주고,
    위아래에 패딩이 설정되어 있으며, 웹브라우저 크기에 따라 화면 크기를 조정
    컴포넌트들 감싸는 역활을 하므로, 내부에 children을 렌더링 한다.
  */
  // src/components/list/ListWrapper/ListWrapper.js
  import React from 'react';
  import styles from './ListWrapper.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  const ListWrapper = ({children}) => (
    <div className={cx('list-wrapper')}>
      {children}
    </div>
  );

  export default ListWrapper;
```
```scss
  @import 'utils';

  .list-wrapper {
    width: 1024px;
    margin: 0 auto;

    padding-top: 3rem;
    padding-bottom: 3rem;
    padding-left: 1rem;
    padding-right: 1rem;

    @include media("<wide") {
      width: 768px;
    }
    @include media("<large") {
      width: 512px;
    }
    @include media("<medium") {
      width: 100%;
    }
  }
```
```javascript
  // ListPage에 렌더링하기
  // src/pages/ListPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import ListWrapper from 'components/list/ListWrapper';

  const ListPage = () => {
    return (
      <PageTemplate>
        <ListWrapper>
          리스트
        </ListWrapper>
      </PageTemplate>
    );
  };

  export default ListPage;
```

### PostList 컴포넌트 생성
```javascript
  /*
    블로그 포스트 목록 데이터를 받아 와 이를 렌더링

    PostList 내부에 PostItem 컴포넌트를 만들고, 이를 반복적으로 렌더링
    아직 데이터가 없으므로 더미 데이터를 활용
  */
  // src/components/list/PosstList/PostList.js
  import React from 'react';
  import styles from './PostList.scss';
  import classNames from 'classnames/bind';
  import { Link } from 'react-router-dom';

  const cx = classNames.bind(styles);

  const PostItem = () => {
    return (
      <div className={cx('post-item')}>
        <h2><a>타이틀</a></h2>
        <div className={cx('date')}>2017-10-24</div>
        <p>내용</p>
        <div className={cx('tags')}>
          <a>#태그</a>
          <a>#태그</a>
          <a>#태그</a>
        </div>
      </div>
    )
  }
  const PostList = () => (
    <div className={cx('post-list')}>
      <PostItem></PostItem>
      <PostItem></PostItem>
      <PostItem></PostItem>
      <PostItem></PostItem>
    </div>
  );

  export default PostList;
```
```scss
  // src/components/list/PostList/PlstList.scss
  @import 'utils';

  .post-list {
    .post-item {
      padding: 1.5rem;
      transition: all .15s ease-in;
      h2 {
        font-size: 2rem;
        font-weight: 400;
        margin: 0;
        color: $oc-gray-8;
        a {
          transition: all .15s ease-in; // 스타일 바뀔 때 애니메이션 효과
          border-bottom: 1px solid transparent;
        }
        a:hover {
          color: $oc-blue-6;
          // 마우스 호버 시 밑줄(밑줄과 글자 사이 여백, 얇은 밑줄을 위해 border-bottom 사용)
          border-bottom: 1px solid $oc-blue-6; 
        }
      }
      .date {
        font-size: 0.85rem;
        color: $oc-gray-5;
      }
      p {
        font-weight: 300;
        color: $oc-gray-7;
      }
      .tags {
        font-size: 0.85rem;
        color: $oc-blue-6;
        a {
          &:hover {
            color: $oc-blue-5;
            text-decoration: underline;
          }
        }
        a + a { // 태그 사이 여백
          margin-left: 0.25rem;
        }
      }
      &:hover {
        // 호버 시 배경색 변경
        background: rgba($oc-blue-6, 0.05);
      }
    }
    .post-item + .post-item { // 아이템 사이 여백
      border-top: 1px solid $oc-gray-3;
    }
  }
```
```javascript
  //src/pages/ListPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import ListWrapper from 'components/list/ListWrapper';
  import PostList from 'components/list/PostList';

  const ListPage = () => {
    return (
      <PageTemplate>
        <ListWrapper>
          <PostList></PostList>
        </ListWrapper>
      </PageTemplate>
    );
  };

  export default ListPage;
```

### Pagination 컴포넌트 생성
```javascript
  // ListPage에 존재하는 마지막 컴포넌트인 Pagination 만들기
  // src/components/list/Pagination/Pagination.js
  import React from 'react';
  import styles from './Pagination.scss';
  import classNames from 'classnames/bind';
  import Button from 'components/common/Button';

  const cx = classNames.bind(styles);

  const Pagination = () => (
    <div classNmae={cx('pagination')}>
      <Button disabled>
        이전 페이지
      </Button>
      <div className={cx('number')}>
        페이지 1
      </div>
      <Button>
        다음 페이지
      </Button>
    </div>
  );

  export default Pagination;
```
```scss
  // src/list/Pagination/Pagination.scss
  @import 'utils';
  .pagination {
    margin-top: 2rem;

    display: flex;
    align-items: center;

    .number {
      font-size: 0.85rem;
      text-align: center;
      color: $oc-gray-6;
      flex: 1
    }
  }
```
```javascript
  // src/pages/ListPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import ListWrapper from 'components/list/ListWrapper';
  import PostList from 'compoentes/list/PostList';
  import Pagination from 'components/list/Pagination';

  const ListPage = () => {
    return (
      <PageTemplate>
        <ListWrapper>
          <PostList></PostList>
          <Pagination></Pagination>
        </ListWrapper>
      </PageTemplate>
    );
  };

  export default ListPage;
```

## Post 페이지 UI 구현
```
  포스트 내용을 볼 수 있는 Post 페이지 구현
    - 제목
    - 태그
    - 날짜
    - 내용
  src/components/post
  Generate new component
```

### PostInfo 컴포넌트
```javascript
  // PostInfo 컴포넌트에는 제목, 태그, 작성 날짜
  // src/components/post/PostInfo/PostInfo.js
  import React from 'react';
  import styles from './PostInfo.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  const PostInfo = () => (
    <div className={cx('post-info')}>
      <h1>타이틀</h1>
      <div className={cx('tags')}>
        <a>#태그</a><a>#태그</a><a>#태그</a>
      </div>
      <div className={cx('date')}>Oct 29, 2017</div>
    </div>
  );

  export default PostInfo;
```
```scss
  // src/components/post/PostInfo/PostInfo.scss
  @import 'utils';

  .post-info {
    background: $oc-blue-6;
    height: 24rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .info {
      margin-top: -5rem; // 헤더 크기만큼 위로
      width: 1024px;
      padding: 1rem;
      color: white;
      h1 {
        font-weight: 300;
        font-size: 3rem;
        margin: 0;
        word-wrap: break-word; // 내용이 너무 길면 다음 줄에 작성
      }
      .tags {
        margin-top: 1rem;
        font-size: 1.25rem;
        font-weight: 500;
        a { 
          &:hover {
            text-decoration: underline;
          }
        }
        a + a {
          margin-left: 0.25rem; // 사이 여백
        }
      }
      .date {
        text-align: right;
        opacity: 0.75;
        font-style: italic;
        font-size: 1.25rem;
      }
    }

    @include media("<large") {
      .info {
        h1 { 
          font-size: 2rem;
        }
        .tags, .date {
          font-size: 1rem;
        }
        width: 768px;
      }
    }
    @include media("<medium") {
      height: auto;
      padding-bottom: 4rem;
      .info {
        padding-top: 0;
        margin: 0;
        .tags {
          margin-top: 0.25rem;
        }
        .tags, .date {
          font-size: 0.85rem;
        }
      }
    }
  }
```
```javascript
  // src/pages/PostPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import PostInfo from 'components/post/PostInfo';

  const PostPage = () => {
    return (
      <PageTemplate>
        <PostInfo></PostInfo>
      </PageTemplate>
    )
  };

  export default PostPage;
```

### PostBody 컴포넌트
```javascript
  // 포스트 내용이 보이는 PostBody 컴포넌트 구현
  // src/components/post/PostBody/PostBody.js
  import React from 'react';
  import styles from './PostBody.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  const PostBody = () => (
    <div className={cx('post-body')}>
      <div className={cx('paper')}>
        내용
      </div>
    </div>
  );

  export default PostBody;
```
```scss
  // src/components/PostBody/PstBody.scss
  @import 'utils';

  .post-body {
    .paper {
      padding: 2rem;
      padding-top: 2.5rem;
      padding-bottom: 2.5rem;
      background: white;
      @include material-shadow(4, 0.5);
      // 위로 3rem 이동시켜 주어 파란색 배경을 침범하게 합니다.
      transform: translateY(-3rem); 
      margin: 0 auto;
      min-height: 20rem;

      // 해상도에 따라 다른 width를 설정합니다.
      width: 1024px;
      @include media("<large") { width: 768px; }
      @include media("<medium") { width: calc(100% - 2rem); }
    }
  }
```
```javascript
  // src/pages/PostPage.js
  import React from 'react';
  import PageTemplate from 'components/common/PageTemplate';
  import PostInfo from 'components/post/PostInfo';
  import PostBody from 'components/post/PostBody';

  const PostPage = () => {
    return (
      <PageTemplate>
        <PostInfo></PostInfo>
        <PostBody></PostBody>
      </PageTemplate>
    );
  };

  export default PostPage;
```

## Editor 페이지 UI 구현
```
  Editor 페이지는 기존에 만들었던 List와 Post 페이지와는 달리 PageTemplate를 사용하지 않음
    - 뒤로가기
    - 작성하기
    - 화면 분활 가운데영역 드래그 리사이징
    - 마크다운 작성 가능
    - CodeMirror: 텍스트에 색상 입혀주기
    - Marked와 Primjs 라이브러리를 사용하여 마크다운을 HTML 형태로 변환 시켜주고 코드에 색상을 줌

  먼저 에디터 페이지의 레이아웃과 리사이즈 기능만 구현
  Generate new component
    - EditorHeader: 에디터 위쪽 영역(뒤로가기, 작성하기)
    - EditorTemplate: 에디터 페이지를 위한 템플릿(리사이즈)
    - EditorPane: 글을 작성하는 영역
    - PreviewPane: 마크다운이 HTML로 렌더링 되는 영역

  EditorTmplate와 EditorPane은 상태관리가 필요한 컴포넌트이니, 컴포넌트를 만들떄 클래스형으로 생성
```

### Editor Template 컴포넌트
```javascript
  /*
    EditorTemplate 컴포넌트는 지금까지 다른 컴포넌트 들과 다름
    기존에는 컴포넌트의 props로 JSX 형태를 받아 올 때 children 값을 사용
  */
  import React from 'react';

  const Parent = ({children}) => {
    return (
      <div>
        {children}
      </div>
    );
  };

  export default Parent;

  // 이렇게 사용하면 JSX 태그 사이의 내용드이 childen 으로 전달됨
  <Parent>
    <div>Hello World</div>
  </Parent>

  /*
    하지만 지금 블로그 프로젝트에는 children처럼 JSX 형태로 전달받아 사용할 내용이 세 종류나 됨
    세 종류의 JSX가 블록 형태 하나로 붙어 있는 것이 아니라, 각자 다른 곳에 렌더링해야 하므로 
    children을 사용하지 않고 header, editor, preview라는 props를 받아 알맞은 곳에 렌더링 해줌
  */
  header={<EditorHeder/>}
  editor={<EditorPane/>}
  preview={<PreviewPane/>}

  // src/components/editor/EditorTemplate/EditorTemplate.js
  import React, { Component } from 'react';
  import styles from './EditorTemplate.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  class EditorTemplate extends Component {
    render() {
      const { header, editor, preview } = this.props;
      return (
        <div className={cx('editor-template')}>
          {header}
          <div className={cx('panes')}>
            <div className={cx('pane', 'editor')}>
              {editor}
            </div>
            <div className={cx('pane', 'preview')}>
              {preview}
            </div>
          </div>
        </div>
      );
    }
  }

  export default EditorTemplate;
```
```scss
  @import 'utils';

  .editor-template {
    .panes {
      height: calc(100vh - 4rem); // 페이지 높이에서 EditorHeader 크기 빼기
      display: flex;
      position: relative; // separator의 위치 설정을 위하여 relative로 설정
      .pane {
        display: flex;
        min-width: 0; // 내부의 내용이 커도 반대편 영역을 침범하지 않게 해줍니다.
        overflow: auto; // 너무 많이 줄이면 스크롤바가 나타나게 해줍니다.
      }
      .separator {
        width: 1rem; // 클릭 영역을 넓게 설정하기 위함입니다.
        height: 100%;
        position: absolute;
        transform: translate(-50%); // 자신의 50%만큼 왼쪽으로 이동
        cursor: col-resize; // 리사이즈 커서
      }
      @include media("<medium") {
        .editor {
          flex: 1!important;
        }
        .preview, .separator {
          display: none;
        }
      }
    }
  }
```
```javascript
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header="헤더"
        editor="에디터"
        preview="프리뷰"
      >
      </EditorTemplate>
    );
  };
```

### 리사이즈 기능 구현
```javascript
  /*
    각 영역 사이에 separator를 렌더링한 후, 이 DOM을 클릭할 때 이벤트를 등록
    커서 위치에 따라 state를 변경하고, 이 state에 따라 각 영역의 크기를 변경하여 리렌더링 하도록 설정
  */
  import React, { Component } from 'react';
  import styles from './EditorTemplate.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  class EditorTemplate extends Component {
    state = {
      leftPercentage: 0.5
    }

    // sepatator를 클릭 후 마우스를 움직이면 그에 따라 leftPercentage 업데이트
    handleMouseMove = (e) => {
      this.setState({
        leftPercentage: e.clientX / window.innerWidth
      });
    };

    // 마우스를 뗐을 때 등록한 이벤트 제거
    handleMouseUp = (e) => {
      document.body.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
    };

    // separator 클릭할 때
    handleSeparatorMouseDown = (e) => {
      document.body.addEventListener('mousemove', this.handleMouseMove);
      widnow.addEventListener('mouseup', this.handleMouseUp);
    };

    render() {
      const { header, editor, preview } = this.props;
      const { leftPercentage } = this.state;
      const { handleSeparatorMouseDown } = this;

      // 각 영역에 flex 값 적용
      const leftStyle = {
        flex: leftPercentage
      };
      const rightStyle = {
        flex: 1 - leftPercentage
      };

      // separator 위치 설정
      const separatorStyle = {
        left: `${leftPercentage * 100}%`
      };

      return (
        <div className={cx('editor-template')}>
          {header}
          <div className={cx('panes')}>
            <div className={cx('pane', 'editor')} style={leftStyle}>
              {editor}
            </div>
            <div className={cx('pane', 'preview')} style={rightStyle}>
              {preview}
            </div>
            <div
              className={cx('separator')}
              style={separatorStyle}
              onMouseDown={handleSeparatorMouseDown}
            ></div>
          </div>
        </div>
      );
    }
  }

  export default EditorTemplate;
```

### EditorHeader 컴포넌트
```javascript
  /*
    EditorHeadr
      - 뒤로가기
      - 작성하기
  */
  // src/components/editor/EditorHeader/EditorHeader.js
  import React from 'react';
  import styles from './EditorHeader.scss';
  import classNames from 'classnames/bind';
  import Button from 'components/common/Button';

  const cx = classNames.bind(styles);

  const EditorHeader = ({onGoBack, onSubmit}) => {
    <div className={cx('editor-header')}>
      <div className={cx('back')}>
        <Button onClick={onGoBack} theme="outline">뒤로가기</Button>
      </div>
      <div className={cx('submit')}>
        <Button onClick={onSubmit} theme="outline">작성하기</Button>
      </div>
    </div>
  };

  export default EditorHeader
```
```scss
  // src/components/editor/EditorHeader/EditorHeader.scss
  @import 'utils';

  .editor-header {
    background: $oc-blue-6;
    height: 4rem;
    padding-left: 1rem;
    padding-right: 1rem;
    display: flex;
    align-items: center;

    .submit {
      margin-left: auto;
    }
  }
```
```javascript
  // src/pages/EditorPage.js
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header={<EditorHeader/>}
        editor="에디터"
        preview="프리뷰"
      >
      </EditorTemplate>
    );
  };

  export default EditorPage;
```

### EditorPane 컴포넌트 생성
```javascript
  /*
    EditorPane 컴포넌트의 인풋은 총 세개
      - 제목 
      - 내용
      - 태그
    
    내용은 CodeMirror 라이브러리를 연동하혀 구현 하므로 추후 구현
  */
  // src/components/editor/EditorPane/EditorPane.js
  import React, { Component } from 'react';
  import styles from './EditorPane.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  class EditorPane extends Component {
    render() {
      return (
        <div className={cx('editor-pane')}>
          <input className={cx('title')} palceholder="제목을 입력하세요" name="title" />
          <div className={cx('code-editor')}></div>
          <div className={cx('tags')}>
            <div className={cx('description')}>태그</div>
            <input name="tags" palceholder="태그를 입력하세요 (쉼표로 구분)" />
          </div>
        </div>
      );
    }
  }

  export default EditorPane;
```
```scss
  @import 'utils';

  .editor-pane {
    flex: 1; // 자신에게 주어진 영역을 다 채우기
    // 세로 방향으로 내용 나열
    display: flex;
    flex-direction: column;

    .title {
      background: $oc-gray-7;
      border: none;
      outline: none;
      font-size: 1.5rem;
      padding: 1rem;
      color: white;
      font-weight: 500;
      &::placeholder {
        color: rgba(255,255,255,0.75);
      }
    }

    .code-editor {
      flex: 1; // 남는 영역 다 차지하기
      background: $oc-gray-9;
      display: flex;
      flex-direction: column; // .CodeMirror가 세로 영역을 전부 차지
      :global .CodeMirror {
        font-size: 1rem;
        flex: 1;
        font-family: 'D2 Coding';
      }
    }

    .tags {
      padding-left: 1rem;
      padding-right: 1rem;
      height: 2rem;
      background: $oc-gray-7;
      display: flex;
      align-items: center;
      .description {
        font-size: 0.85rem;
        color: white;
        font-weight: 600;
        margin-right: 1rem;
      }

      input {
        font-size: 0.85rem;
        border: none;
        flex: 1;
        background: none;
        outline: none;
        font-weight: 600;
        color: rgba(255,255,255,0.9);
        &::placeholder {
          color: rgba(255,255,255,0.75);
        }
      }
    }
  }
```
```javascript
  // src/pages/EditorPage.js
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';
  import EditorPane from 'components/editor/EditorPane';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header={<EditorHeader/>}
        editor={<EditorPane/>}
        preview="프리뷰"
      ></EditorTemplate>
    );  
  };

  export default EditorPage;  
```

### PreviewPane 컴포넌트
```javascript
  // src/components/editor/PreviewPane/PreveiwPane.js
  import React from 'react';
  import styles from './PreveiwPane.scss';
  import classNames from 'classnames/bind';

  const cx = classNames.bind(styles);

  const PreviewPane = ({markdown, title}) => (
    <div className={cx('preview-pane')}>
      <h1 className={cx('title')}>
        제목
      </h1>
      <div>
        내용
      </div>
    </div>
  );

  export default PreviewPane;
```
```scss
  // src/components/editor/Preview/PreviewPane.scss
  @import 'utils';
  .preview-pane {
    flex: 1;
    padding: 2rem;
    overflow-y: auto; // 크기가 초과할 때 스크로라 나타나게 설정
    font-size: 1.125rem;
    .title {
      font-size: 2.5rem;
      font-weight: 300;
      padding-bottom: 2rem;
      border-bottom: 1px solid $oc-gray-4;
    }
  }
```
```javascript
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';
  import EditorPane from 'components/editor/EditorPane';
  import PreveiwPane from 'components/editor/PreviewPane';

  const EditorPae = () => {
    return (
      <EditorTempalte
        header={<EditorHeder/>}
        editor={<EditorPane/>}
        preview={<PreviewPane/>}
      >
      </EditorTempalte>
    );
  };

  export default EditorPage;
```

## 마크다운 에디터 구현
```
  마크다운 에디터를 구현하기 위해 라이브러리가 세게 필요함
    - codemirror
    - marked
    - prismjs

  yarn add codemirror marked prismjs
```

### CodeMirror 적용
```javascript
  /*
    CodeMirror는 코드 에디터 라이브러리
    코드에 색상을 입혀 주는 역활
    마크다운을 작성할 떄 각 문법에 따라 다른 색상을 입혀 주고, 
    마크다운 내부에 입력하는 코드(예: 자바스크립트)에도 문법에 따라 색을 입혀 준다.

    EditorPane에서 CodeMirror 관련 자바스크립트 파일과 스타일을 불러오고,
    componentDidMount가 되었을 대 CodeMirror 인스턴스를 만들어 페이지에 나타나게 함
    code-editor 클래스를 가진 div에 ref를 설정하여 해당 DOM에 CodeMirror를 삽입한다.
  */
  // src/components/editor/EditorPane/EditorPane.js
  import React, { Component } from 'react';
  import styles from './EditorPane.scss';
  import classNames from 'classnames/bind';

  import CodeMirror from 'codemirror';

  import 'codemirror/mode/markdown/markdown';  // 마크다운 문법 색상
  // 마크다운 내부에 들어가는 코드 색상
  import 'codemirror/mode/javascript/javascript';
  import 'codemirror/mode/jsx/jsx';
  import 'codemirror/mode/css/css';
  import 'codemirror/mode/shell/shell';

  // CodeMirror를 위한 CSS 스타일
  import 'codemirror/lib/codemirror.css';
  import 'codemirror/theme/monokai.css';

  const cx = classNames.bind(styles);

  class EditorPane extends Component {
    editor = null;  // 에디터 ref
    codeMirror = null // CodeMirror 인스턴스

    initializeEditor = () => {
      this.codeMirror = CodeMirror(this.editor, {
        mode: 'markdown',
        theme: 'monokai',
        lineNubmers: true,  // 왼쪽에 라인 넘버 띄우기
        lineWrapping: true  // 내용이 너무 길면 다음 줄에 작성
      })
    }

    componentDidMount() {
      this.initializeEditor();
    }

    render() {
      return (
        <div className={cx('editor-pane')}>
          <input className={cx('title')} placeholder="제목을 입력하세요" name="title" />
          <div className={cx('code-editor')} ref={ref => this.editor=ref}></div>
          <div className={cx('tags')}>
            <div className={cx('description')}>태그</div>
            <input name="tags" placeholder="태그를 입력하세요 (쉼표로 구분)" />
          </div>
        </div>
      );
    }
  }

  export default EditorPane;
```
```scss
  /*
    html을 조사하면 code-editor 클래스를 가진 div 내부에 CodeMirror가 생성 됨
    이 부분을 스타일링 하기
    폰트를 우리가 이전에 설정한 D2 Coding으로 지정하고, 세로 크기를 전부 차지하게 스타일 작성
  */
  .code-editor {
    flex: 1;  // 남는 영역 다 차지하기
    background: $oc-gray-9;
    display: flex;
    flex-direction: column; // .CodeMirror가 세로 영역을 전부 차지
    :global .CodeMirror {
      font-size: 1rem;
      flex: 1;
      font-family: 'D2 Coding';
    }
  }
  /*
    CodeMirror라고 하면 CSS Module을 적용하여 고유 id를 가진 클래스 이름을 생성한다.
    앞부분에 :global 키워드를 붙여 주면 해당 클래스에는 CSS Module를 적용하지 않음

    에티터가 세로길이를 전부 차지하며, 에디터 폰트도 변경 됨
  */
```

## 에디터 상태 관리

### editor 모듈 생성
```javascript
  /*
    Editor에서 작성할 제목, 내용, 태그들의 상태를 리덕스에서 관리
  */
  // src/stor/modules/editor.js
  import { createAction, handleActions } from 'redux-actions';

  import { map } from 'immutable';
  import { pender } from 'redux-pender';

  // action types
  const INITIALIZE = 'editor/INITIALIZE';
  const CHANGE_INPUT = 'editor/CHANGE_INPUT';

  // action creators
  export const initialize = createAction(INITIALIZE);
  export const changeInput = createACtion(CHANGE_INPUT);

  // initial state 
  const initialState = Map({
    title: '',
    markdown: '',
    tags: ''
  });

  // reducer 
  export default handleACtions({
    [INITIALIZE]: (state, action) => initialState,
    [CHANGE_INPUT]: (state, action) => {
      const { name, value } = action.payload;
      return state.set(name, value);
    }
  }, initialState);

  // INITIALIZE와 CHANGE_INPUT 액션을 만들어 줌
```

### EditorPaneContainer 컴포넌트 생성
```javascript
  // src/containers/editor/EditorPaneContainer.js
  import React, { Component } from 'react';
  import EditorPane from 'components/editor/EditorPane';
  import { bindActionCreators } from 'redux';
  import { connect } from 'react-redux';
  import * as editorActions from 'store/modules/editor';

  class EditorPaneContainer extends Component {
    handleChangeInput = ({name, value}) => {
      const { EditorActions } = this.props;
      EditorActions.changeInput({name, value});
    }

    render() {
      const { title, tags, markdown } = this.props;
      const { handleChangeInput } = this;

      return (
        <EditorPane
          title={title}
          markdown={markdown}
          tags={tags}
          onChangeInput={handleChangeInput}
        >
        </EditorPane>
      )
    }
  }

  export default connect(
    (state) => ({
      title: state.editor.get('title'),
      markdown: state.editor.get('markdown'),
      tags: state.editor.get('tags')
    }),
    (dispatch) => ({
      EditorActions: bindActionsCreators(editorActions, dispatch)
    })
  )(EditorPaneContainer);

  /*
    title, markdown, tags를 연결했고, handleChangeInput 메서드를 만들어 CHANGE_INPUT 액션을 실행하도록 설정
  */
```
```javascript
  // src/pages/Editor
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';
  import EditorPaneContainer from 'components/editor/EditorPaneContainer';
  import PreviewPane from 'components/editor/PreviewPane';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header={<EditorHeader/>}
        editor={<EditorPaneContainer/>}
        preview={<PreviewPane/>}
      ></EditorTemplate>
    );  
  };

  export default EditorPage;
```
```javascript
  // provider를 통해 스토어 주입하기
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
          <App/>
        </BrowserRouter>    
      </Provider>

    );
  };

  export default Root;
```

### EditorPane 수정
```javascript
  /*
    props로 받은 값들을 각 input에 설정하고, 변화가 일어나면 props로 전달받은 onChangeInput을 호출
    
    제목과 태그는 인풋에 onChange 이벤트를 설정하여 값을 줄 수 있지만, CodeMirror는
    initializeEditor 함수가 호출될 때 이벤트를 직접 등록해야 함

    또 props로 받은 markdown 값을 CodeMirror 인스턴스에 반영해야 하기 때문에,
    componentDidUpdate 부분에서 markdown 값을 바꾸면 setValue를 사용하여 내용을 변경해 주어야 함

    이 과정에서 cursor 위치가 초기화될 수 있기 때문에 setCursor를 사용하여 cursor 값을
    유지해야 함
  */
  
  // src/components/editor/EditorPane/EditorPane.js
  (...)
  class EditorPane extends Component {
    editor = null;  // 에디터 ref
    codeMirror = null;  // CodeMirror 인스턴스
    cursor = null;  // 에디터의 텍스트 cursor 위치

    initalizeEditor = () => {
      this.codeMirror = CodeMirror(this.editor, {
        mode: 'markdown',
        theme: 'monokai',
        lineNumbers: true,  // 왼쪽에 라인 넘버 띄우기
        lineWrapping: true  // 내용이 너무 길면 다음 줄에 작성
      });
      this.codeMirror.on('change', this.handleChangeMarkdown);
    }
  }

  componentDidMount() {
    this.initializeEditor();
  }

  handleChange = (e) => {
    const { onChangeInput } = this.props;
    const { value, name } = e.target;
    onChangeInput({name, value});
  };

  handleChangeMarkdown = (doc) => {
    const { onChangeInput } = this.props;
    this.cursor = doc.getCursor();  // 텍스트 cursor 위치 저장
    onChangeInput({
      name: 'markdown',
      value: doc.getValue()
    })
  };

  componentDidUpdate(prevProps, prevState) {
    // markdown이 변경되면 에디터 값도 변경
    // 이 과정에서 텍스트 커서의 위치가 초기화 되기 때문에,
    // 저장한 커서의 위치가 있으면 해당 위치로 설정 됨
    if(prevProps.markdown !== this.props.markdown) {
      if(!codeMirror) return; // 인스턴스를 아직 만들지 않았을 때
      codeMirror.setValue(this.props.markdown);
      if(!cursor) return; // 커서가 없을때
      codeMirror.setCursor(cursor);
    }
  }

  render() {
    const { handleChange } = this;
    const { tags, title } = this.props;

    return (
      <div classNmae={cx('editor-pane')}>
        <input 
          className={cx('title')}
          placeholder="제목을 입력하세요"
          name="title"
          value={title}
          onChange={handleChange}
        />
        <div className={cx('code-editor')} ref={ref => this.editor=ref}></div>
        <div className={cx('tags')}>
          <div className={cx('description')}>태그</div>
          <input
            name="tags"
            placeholder="태그를 입력하세요 (쉼표로 구분)"
            value={tags}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  }

  export default EditorPane;
```

## 마크다운 변환
```
  에디터로 작성한 마크다운을 HTML로 변환하여 화면에 띄우기

  마크다운을 렌더링하는 것은, 에디터에서도 가능하지만, 포스트를 볼 때도 가능
  MarkdownRender 컴포넌트를 common 경로에 만들어서 사용
```

### MarkdownRender 컴포넌트 생성
```javascript
  /*
    components/common 경로에 MarkdownRender 컴포넌트를 클래스 형태로 만들기
    marked를 사용하여 마크다운을 html로 변환하고, 이를 렌더링하는 코드 입력하기
  */
  // src/components/common/MarkdownRender/MarkdownRender.js
  import React, { Component } from 'react';
  import styles from './MarkdownRender.scss';
  import classNames from 'classnames/bind';

  import marked from 'marked';

  const cx = classNames.bind(styles);

  class MarkdownRender extends Component {
    state = {
      html: ''
    }

    renderMarkdown = () => {
      const { markdown } = this.props;
      // 마크 다운이 존재하지 않는다면 공백 처리
      if(!markdown) {
        this.setState({html: ''});
        return;
      }
      this.setState({
        html: marked(markdown, {
          breaks: true, // 일반 엔터로 새 줄 입력
          sanitize: true  // 마크다운 내부 html 무시
        })
      });
    }

    constructor(props) {  
      super(props);
      const { markdown } = props;
      // 서버사이드 렌더링에서도 마크다운 처리가 되도록 constructor 쪽에서도 구현함
      this.state = {
        html: markdown ? marked(props.markdown, {breaks: true, sanitize: true}) : ''
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // markdown 값이 변경되면 renderMarkdown을 호출한다.
      if(prevProps.markdown !== this.props.markdown) {
        this.renderMarkdown();
      }
    }

    render() {
      const { html } = this.state;

      // React에서 html을 렌더링하려면 객체를 만들어 내부에
      // __html 값을 설정해야 함
      const markup = {
        __html: html
      };

      // dangerouslySetInnerHTML 값에 해당 객체를 넣어주면 됨
      return (
        <div className={cx('markdown-render')} dangerouslySetInnerHTML={markup} />
      );
    }
  }

  export default MarkdownRender;

  /*
    컴포넌트를 만들 때는 호출되는 constructor와 componentDidUpdate에서 마크다운 변환 작업을 허락해 줌
    constructor에서 마크다운 변환 작업을 하는 이유는 constructor 함수는 버서 사이드 렌더링을 할 때도 
    호출하기 때문이나 이 작업을 componentDidMount에서 한다면 웹 브라우저 쪽에서만 실행하고,
    나중에 서버쪽에서는 호출하지 않는다.

    next 
      : MarkdownRender 컴포넌트를 사용할 차례
        PreviewPaneContainer를 만들어 주고, PreviewPane에서는 전달받은 markdown을 MarkdownRender를 사용하여 렌더링하기
  */
```

### PreviewPaneContainer 컴포넌트 생성
```javascript
  // title 값과 markdown 값을 스토어에서 받아 와 PreviewPane에 넣어줌
  // src/containers/editor/PreviewPaneContainer.js
  import React, { Component } from 'react';
  import { connect } from 'react-redux';
  import PreviewPane from 'components/editor/PreviewPane';

  class PreviewPaneContainrer extends Component {
    render() {
      const { markdown, title } = this.props;
      return (
        <PreviewPane title={title} markdown={markdown}/>
      );
    }
  }

  export default connect(
    (state) => ({
      title: state.editor.get('title'),
      markdown: state.editor.get('markdown')
    })
  )(PreviewPaneContainer);

  // 그다음에는 EditorPage에서 PreviewPane을 PreviewPaneContainer로 교체
  // src/pages/EditorPage.js
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';
  import EditorPaneContainer from 'containers/editor/EditorPaneContainer';
  import PreviewPaneContainer from 'containers/editor/PreveiwPaneContainer';

  const EditorPage = () => {
    return (
      <EditorTemplate
        header={<EditorHeader/>}
        editor={<EditorPaneContainer/>}
        preview={<PreviewPaneContainer/>}
      >
      </EditorTemplate>
    )
  };

  export default EditorPage;
```

### PreviewPaneContainer 컴포넌트
```javascript
  // src/containers/editor/PreviwPaneContainer.js
  import React, { Component } from 'react';
  import { connect } from 'react-redux';
  import PreviewPane from 'components/editor/PreveiwPane';

  class PreveiwPaneContainer extends Component {
    render() {
      const { markdown, title } = this.props;
      return (
        <PreviewPane title={title} markdown={markdown}/>
      );
    }
  }

  export default connect({
    (state) => ({
      title: state.editor.get('title'),
      markdown: state.editor.get('markdown')
    })
  })(PreviewPaneContainer);
```
```javascript
  // src/pages/EditorPage.js
  import React from 'react';
  import EditorTemplate from 'components/editor/EditorTemplate';
  import EditorHeader from 'components/editor/EditorHeader';
  import EditorPaneContainer from 'containers/editor/EditorPaneContainer';
  import PreviewPaneContainer from 'containers/editor/PrevewPaneContianer';

  const EditorPage = () => {
    <EditorTemplate
      header={<EditorHeader/>}
      editor={<EditorPaneContainer/>}
      preview={<PreviewPaneContainer/>}
    >
    </EditorTemplate>
  };

  export default EditorPage
```

### PreviewPane 컴포넌트에서 MarkdonRender 컴포넌트 사용
```javascript
  /*
    컨테이너 컴포넌트를 사용하여 전달받은 title 값과 markdown 값을 보여주기
    title 부분은 기존 텍스트가 있던 부분을 교체하면 되고, markdown에는 MarkdownRender
    컴포넌트를 불러와 props로 markdown을 전달하세요.
  */
  // src/components/editor/PreviewPane/PreveiwPane.js
  import React from 'react';
  import styles from './PreviewPane.scss';
  import classNames from 'classnaems/bind';
  import MarkdownRender from 'components/common/MarkdownRender';

  const cx = classNames.bind(styles);

  const PreviewPane = ({markdown, title}) => (
    <div className={cx('preview-pane')}>
      <h1 className={cx('title')}>
        {title}
      </h1>
      <div>
        <MarkdownRender markdown={markdown}/>
      </div>
    </div>
  );
```

### Prismjs를 사용하여 코드에 색상 입히기
```javascript
  /*
    Prismjs를 사용하여 코드 블록을 꾸미기
    Prismjs 관련 코드를 불러온 후 Prism.highlightAll() 함수를 호출하면 
    화면에 있는 코드 블록에 스타일 입히기

    이 함수는 마크다운이 변환되어 html을 렌더링한 후 반영해야 함
    componentDidUpdate에서 state 값이 바뀔때 이 코드를 호출한다.
  */
  // src/components/MarkdownRender/MarkdownRender.js
  import React, { Component } from 'react';
  import styles from './MarkdownRender.scss';
  import classNames from 'classnames/bind';

  import marked from 'marked';

  // prism 관련 코드 불러오기
  import Prism from 'prismjs';
  import 'prismjs/themes/prism-okadia.css';
  // 지원할 코드 형식들을 불러오기
  // http://prismjs.com/#languages-list 참조
  import 'prismjs/components/prism-bash.min.js';
  import 'prismjs/components/prism-javascript.min.js';
  import 'prismjs/components/prism-jsx.min.js';
  import 'prismjs/components/prsm-css.min.js';

  const cx = classNames.bind(styles);

  class MarkdownRender extends Component {
    (...)
    componentDidUpdate(prevProps, prevState) {
      // markdown 값이 변경되면 renderMarkdown을 호출한다.
      if(prevProps.markdown !== this.props.markdown) {
        this.renderMarkdown();
      }
      // state가 바뀌면 코드 하이라이팅
      if(prevState.html !== this.state.html) {
        Prism.highlightAll();
      }
    }
    (...)
  }

  export default MarkdownRender;
```
### 마크다운 스타일링
```scss
  // src/components/common/MarkdownRender/MarkdownRender.scss
  @import 'utils';

  .markdown-render {
    blockquote {
      border-left: 4px solid $oc-blue-6;
      padding: 1rem;
      background: $oc-gray-1;
      margin-left: 0;
      margin-right: 0;
      p {
        margin: 0;
      }
    }
  }

  h1, h2, h3, h4 {
    font-weight: 500;
  }

  // 텍스트 사이의 코드
  h1, h2, h3, h4, h5, p {
    code {
      font-family: 'D2 Coding';
      background: $oc-gray-0;
      padding: 0.25rem;
      color: $oc-blue-6;
      border: 1px solid $oc-gray-2;
      border-radius: 2px;
    }
  }

  // 코드 블록
  code[class*="language-"].pre[class*="language-"] {
    font-family: 'D2 Coding';
  }

  a {
    color: $oc-blue-6;
    &:hover {
      color: $oc-blue-5;
      text-decoration: underline;
    }
  }

  // 표 스타일
  table {
    border-collapse: collapse;
    width: 100%;
  }

  table, th, td {
    border: 1px solid $oc-gray-4;
  }

  th, td {
    font-size: 0.9rem;
    padding: 0.25rem;
    text-align: left;
  }

  // 이미지 최대 크기 설정 및 가운데 정렬
  img {
    max-width: 100%;
    margin: 0 auto;
    display: block;
  }
```