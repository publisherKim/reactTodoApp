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