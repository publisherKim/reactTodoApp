# 코드 스플리팅
```
  17.1 코드 스플리팅
  17.2 비동기적 코드 불러오기: 청크 생성
  17.3 라우트에 코드 스플리팅
  17.4 정리
```

## 싱글페이지 어플리케이션의 단점
```
  페이지 로딩 속도가 지연될 수 있음
  로딩 속도가 지연되는 이유는 자바스크립트 번들 파일에 모든 애플리케이션의 로직을 불러오므로 규모가 커지면서 용량도 커지기 때문

  코드 스플링을 통해 해결
    : 코드를 분활 한다는 의미
    webpack에서 프로젝트를 번들링 할 때 파일 하나가 아니라 파일 여러 개로 분리시켜서 결과물을 만듬
    또 페이지를 로딩할 때 한꺼번에 불러오는 것이 아니라 필요한 시점에 로드 간능

  1. 라이브러리 분리하기
  2. 비동기 렌더링하기
  3. 빌드 후 확인하기
```

## 코드 스플링팅의 기본
```
  1. webpack 설정 밖으로 꺼내기
    yarn eject
  2. vender 설정
    코드 스플리팅을 진행하려면 우선 vendor를 설정해야함
    모든 페이지 사용: react, react-dom, redux, react-redux, styled-components
    주로 서드파티 라이브러리들의 경우 vendor로 분리해냄 (특정 컴포넌트에서 사용될 경우)
    컴포넌트에 필요한 라이브러리 들만 업데이트 
    이경우 더욱 오랫동안 캐싱 효과를 누릴수 있으므로 트래픽 절감 및 속도 개선 가능
```

## 스플링팅 예시
```javascript
  // before
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // Finally, this is your app's code:
    paths.appIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ]  
  // after
  entry: {
    app: [
      require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs.js
    ],
    vendor: [
      require.resolve('./polyfills'),
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },

  // before
  plugins: [
      // Adds support for installing with Plug'n'Play, leading to faster installs and adding
      // guards against forgotten dependencies and such.
      PnpWebpackPlugin,
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
    ],
    // after
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.js'
      }),
      new InterpolateHtmlPlugin(env.raw),
    ],
```