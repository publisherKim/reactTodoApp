# react-router로 SPA 개발
```
  16.1 SPA란?
  16.2 프로젝트 구성
  16.3 Route와 파라미터
  16.4 라우트 이동
  16.5 라우트 안의 라우트
  16.6 라우트로 사용된 컴포넌트가 전달받는 props
  16.7 withRouter로 기타 컴포넌트에서 라우터 접근
  16.8 정리
```

## SPA란?
```
  SPA는 Single Page Application
  -SSR-
          pageA           <->
    서버  pageB           <->                    컴퓨터
          pageC           <->
          통신 비용이 발생(data 뿐만 아니라 전체 페이지 관련된 자원들 다 주고 받아야 함)
    기존 페이지 라우터로 변경 될때마다 통신을 요청함
    웹에서 제공하는 정보가 많아 질수록 속도 문제 발생 이를 개선하기 위해 캐싱과 압축을 해서 서비스를 제공 
    이 방식은 사용자와 인터렉션이 많아 질수록 충분하지 않음
    서버에서 렌더링을 담당하는 것은 그만큼 서버 자원을 렌더링 한다는데 사용한다는 의미
  -SPA-
          pageA           <->
    서버  pageB           <->                    컴퓨터
          pageC           <->
          통신 비용이 발생(꼭 필요한 데이터만 주고 받을수 있음)
    애플리케이션을 우선 웹브라우저에 로드 시킨 후 필요한 데이터만 전달 받아 보여줌
    서버의 리소스 자원 절약(기존의 markup css 이런 자원들을 계속 전달해 주는 양을 꼭 필요한 데이터만 보내줌으로써 리소스 절약이 됨)
    초기 로딩이 길지만 한번 로드하고 나면 웹 브라우저에서 나머지 페이질을 정의함
    주소에따라 다른 뷰를 보여 주는 것을 라우팅이라고 함
    리액트 자체에 이 기능이 내장되어 있지는 않지만 라우팅 관련 라이브러리인 react-router를 설치하여 구현 가능

    리액트 라우터는 서드 파티 라이브러리(제작사에서 만든게 아닌 제3자에서 제공하는 것을 써드파티라고 함)로 비록 공식 라이브러리는 아니지만 자주 쓰인다.

    리엑트 라우터를 사용하면 페이지 주소를 변경했을때 주소에따라 다른 컴포넌트를 렌더링해 주고 주소정보(파라미터, URL쿼리 등)을 컴포넌트의 props로 전달해서 
    컴포넌트 단에서 주소 상태에 따라 다른 작업을 하도록 설정이 가능하다.

    초기 로딩이 크긴 하지만 이에 대한 대응 방법으로 코드 스플리팅을 통해 라우트별로 파일을 나누어 트래픽과 로딩 속도를 개선이 가능하다.
```

## 프로젝트 구성
```
  1. 프로젝트 준비하기
  2. 리액트 라우터 적용하기
  3. 라우트 생성 및 파라미터 사용하기
  4. 라우트 이동하기
  5. 라우터 관련 객체 알아보기
  
  create-react-app react-router-tutorial
  yarn add react-router-dom
  
  프로젝트 초기화 및 구조 설정
  1. src/App.css
  2. src/App.test.js
  3. src/logo.svg

  make it directory
  1. src/components: 컴포넌트들이 위치하는 디렉토리
  2. src/pages: 각 라우트들이 위치하는 디렉토리
```
## NODE_PATH 설정
```javascript
  /*
    컴포넌트나 모듈을 import할 때 보통 상대 경로로 불러온다
    ex) ../components/A.js ../../../../components/B.js
    구조가 깊어질수록 복잡하고 헷갈림
    프로젝트의 루트 경로를 지정하거나 alias를 통해 인지의 용이성을 높임
  */
  // page.json mac
    "start": "NODE_PATH=src react-scripts start",
    "build": "NODE_PATH=src react-scripts build",
  // window
  // yarn add cross-env
    "start": "cross-env NODE_PATH=src react-scripts start",
    "build": "cross-env NODE_PATH=src react-scripts build",
```
## 라우트 파라미터와 쿼리 읽기
```
  라우트의 경로에 특정 값을 넣는 방법
    1. params
    2. Qyery String
```