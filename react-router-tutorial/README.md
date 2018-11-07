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

## 비동기적 코드 불러오기: 청크 생성
```javascript
  /*
    앞에서 진행한 vendor 처리는 단순히 원활하게 캐싱을 할 수 있게 하는 작업일 뿐,
    페이지를 로딩할 대 모든 코드를 불러오는 것은 동일함.
    페이지에 필요한 코드를 불러오려면, 청크를 생성해야함
    청크를 생성하면 페이지를 로딩할 때 필요한 파일만 불러올 수 있고,
    아직 불러오지 않은 청크 파일들은 나중에 필요할 때 비동기적으로 불러와 사용 가능
  */
  // 청크 생성
  import React from 'react';

  const SplitMe = () => {
    return (
      <h3>
        청크
      </h3>
    )
  };

  export default SplitMe;

  /*
    청크를 생성할 컴포넌트 자체는 특별히 하는것이 없다.
    다만 컴포넌트를 import 하는 방식이 다름
  */
  // 청크 컴포넌트 로드 
  import React, { Component } from 'react';

  class AsyncSplitMe extends Component {
    state = {
      SplitMe: null
    }

    loadSplitMe = () => {
      // 비동기적으로 코드를 불러옴. 함수는 Promise를 결과로 반환함
      // import()는 모듈의 네임 스페이스를 불러오므로, default를 직접 지겅해야함
      import('./SplitMe').then(({ default: SplitMe }) => {
        this.setState({
          SplitMe
        });
      });
    }

    render() {
      const { SplitMe } = this.state;
      // SplitMe가 있으면 이를 렌더링하고, 없으면 버튼을 렌더링 함
      // 버튼을 누르면 SplitMe를 불러옴
      return SplitMe ? <SplitMe/> : <button onClick={this.loadSplitMe}>SplitMe 로딩</button> 
    }
  }

  /*
    SplitMe 로딩 버튼을 누르면 우리가 준비한 SplitMe 컴포넌트가 나타나고, 네트워크에는 2, chunk.js 파일을 불러온 기록이 남음.
  */

  export default AsyncSplitMe;
```
## 라우트에 코드 스플리팅
```javascript
/*
  asyncComponent 함수 생성
    : 비동기적으로 불러올 코드가 많으면 청크를 생성할 때마다 파일에 비슷한 코드들을 반복하여 작성해야 함
      조금 더 편하게 구현할 수 있도록 이를 따로 함수화하여 재사용 함

*/
  import React from 'react';

  export default function asyncComponent(getComponent) {  // asynComponent 정의 인자로 getComponent 전달
    return class AsyncComponent extends React.Component { // React.Component AsyncComponent 활용
      static Component = null;                            // static 초기값 설정
      state = { Component: AsyncComponent.Component };    // state 초기값 할당

      constructor(props) {                                // 생성자에서 비동기적으로 생성 및 state에 할당
        super(props);
        if (AsyncComponent.Component) return;
        getComponent().then(({default: Component}) => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }

      render() {
        const { Component } = this.state
        if (Component) {
          return <Component {...this.props} />
        }
        return null
      }
    }
  }
/*
  이함 수는 컴포넌트를 import하는 함수를 호출하는 함수를 파라미터로 받습니다.
  사용예시: asyncCompoonent(() => import('./Home'));

  파라미터로 받은 함수는 constructor에서 실행하여 컴포넌트를 불러옴
  해당 컴포넌트를 실제로 렌더링할 때 파일을 불러오도록 설정
  컴포넌트가 로딩되면 컴포넌트를 state에 집어넣고 또 static 값으로도 설정

  컴포넌트가 언마운트 되었다가 나중에 다시 마운트 될 때는 컴포넌트를 다시 새로 불러오지 않고,
  static 값으로 남아 있는 이전에 불러온 컴포넌트 정보를 재사용함

  정리
    : 즉 최초에는 처음 렌더링할때 생성해서 상태로 할당하고,  static으로 설정되어 이후에는 재사용됨
*/

## 라우트 코드 스플리티용 인덱스 생성
```
  pages/index.async.js 파일 생성
  index.js와 index.async.js 파일을 분리하는 이유
    : 나중에 개발 서버에서 비동기 라우트를 비활성화할 것
      개발 서버에서 청크를 생성하여 코드 스플리팅을 하면 코드 내용을 변경했을 때 자동으로 새로고침이 안됨
      라우트 코드 스플링은 시레로 나중에 사용자에게 전달할 프로덕션 빌드에만 적용 가능(개발 편의성 목적이 크다.)
``` 