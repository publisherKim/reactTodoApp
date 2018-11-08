
## 백엔드 프로그래밍: Node.js의 Koa 프레임워크
```
  18.1 소개
  18.2 프로젝트 생성
  18.3 Koa 기본 사용법
  18.4 Nodemon 사용
  18.5 koa-router 사용
  18.6 정리
```

## 소개
```
  웹 애플리케이션을 만들 때, 보통은 리액트 같은 프런트엔드 기술만으로 필요한 기능들을 구현하기에 부족함
  데이터를 여러 사람과 공유하려면 저장할 공간이 필요하기 때문(server)
```

### 백엔드
```
  우리는 데이터를 담기위한 서버가 필요함
  서버에 다음때 여러가지 규칙이 필요함
  예를들어
    : 특정 데이터를 등록할 대 사용자 인증 정보가 필요할수도 있고,
      등록할 데이터는 어떻게 검증할지,
      데이터 종류가 여러 가지라면 어떻게 구분할지 등을 고려해야 함
  
  데이터를 조회 할때도 마찬가지 
    : 어떤 종류의 데이터를 몇 개씩 보여 줄지,
      어떻게 보여 줄지 등

  이런 로직들을 만드는 것을 서버 프로그래밍 또는 백엔드 프로그래밍이라고 함

  백엔드 프로그래밍 특징
    : 다양한 환경,
      언어에 구애 x
  백엔드 언어 종류
    : PHP, 파이썬, Golang, 자바, 자바스크립트, 루비 등

  이 프로젝트에서 사용할 언어는 node
```

### Node.js
```
  처음에는 자바스크립트를 웹브라우저에서만 사용
  속도가 빠른 편은 아니었음
  시간이 지나면서 발전
  크롬이 만든 V8 엔진이다.
  서버에서도 자바스크립트를 사용할 수 있는 런타임 엔진
```

### Koa
```
  Node.js 환경에서 웹 서버를 구축할 때는 보통 Express, Hapi, Koa 등 웹 프레임워크를 사용
  현재 엡프로임워크중 hot: Express 소유권이 IBM -> StrongLoop로 이전 인지도 하향세
  Koa 프레임워크는 Express falk refactoring 결과물
  기존 Express에서 아키텍처에서 버전이 많이 바뀌어서 버전을 높이지 않고 새 이름을 붙임

  Koa 특징(Express와 비교)
    - Koa는 훨씬 가볍고
    - Node v7.6부터 정식으로 지원하는  async/await 문법 사용 가능
    - 콜백 지옥 겪을일 없고, 비동기 작업도 편하게 관리 가능
  
  Node.js 기초 실습 흐름
    - 작업 환경 준비 및 프로젝트 만들기
    - Koa로 하는 Hello World
    - 미들웨어 알아보기
    - koa-router로 하는 백엔드 라우팅
    - 라우트 모듈화 하기
```

## 프로젝트 생성

### 작업 환경 준비
```
  Koa는 v7 이상부터 사용하는 것을 권장
  v7 이상부터는 async/await를 바벨을 이용하여 트렌스파일링 하지 않고 바로 실행 가능
```

### 프로젝트 생성
```
  블로그 서비스와 연동할 서버 만들기
    : mkdir blog
      cd blog
      mkdir blog-backend
      blog-backend
      yarn init
      cat package.json
      yarn add koa
```

### ESLint config
```
  자바스크립트 문법과 코드스타일 검토 도구인 ESLint 설치 및 적용하기
  yarn global eslint
  eslint -v
  yarn add eslint
  eslint --init
```

### ESLint customizing
```
  ESLint 규칙이 너무 엄격해서 
  몇가지를 좀 느슨하게 만들기
```

## Koa 기본 사용법

### hello world 띄우기
```javascript
  // koa framework load
  const Koa = require('koa');

  // instance make it
  const app = new Koa();

  // ctx.body 에 문자열 할당
  app.use((ctx) => {
    ctx.body = 'hello world';
  });

  // port config
  app.listen(4000, () => {
    console.log('listening to port 4000');
  });
```

### 미들웨어
```javascript
  /*
  Koa 애플리케이션은 미들웨어의 배열로 구성
  use 함수를 이용해 등록
  */
  app.use(ctx => ctx.body = 'hello wrold');
  /*
    app.use 파라미터로 함수가 하나의 미들웨어 이다.
    Koa의 미들웨어 함수에서는 두가지 파라미터를 받을수 있다.
    첫번째는 ctx, 두번째는 next이다.
    ctx는 웹 요청과 응답 정보를 가짐
    next는 현재 처리중인 미들웨어의 다음 미들웨어를 호출하는 함수
    미들웨어를 등록하고 next를 실행하지 않으면 그 다음 미들웨어를 처리하지 않는다.
    미들웨어는 app.use로 등록하는 순서대로 처리함
  */
  const Koa = require('koa');

  const app = new Koa();

  app.use( _ => {
    console.log(1);
  });

  app.use( _ => {
    console.log(2);
  });

  app.use( ctx => ctx.body = 'hello world');

  app.listen( 4000, _ => console.log('listening to port 4000'));
```

### next()는 프로미스다.
```javascript
  /*
  next를 실행하면 프로미스를 반환
  따라서 다음 작업들이 끝나고 난 후 특정 작업을 수행 가능
  */
  app.use((ctx, next) => {
    console.log(1);
    next().then(() => {
      console.log('bye');
    })
  });
  // console result: excute order thinking
  1
  2
  bye
```
### async/await 사용
```javascript
  /*
  Koa에서는 async/await를 정식으로 지원하기 때문에 편하게 사용가능(express의경우 편법을 동원해서 사용해야함)
  async/await는 서버에서 매우 유용하게 사용가능
  특히 데이터베이스에 요청할 때 콜백을 사용 할 필요가 없어서 깔끔하게 작성 가능
  */
  app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log('bye');
  });
```