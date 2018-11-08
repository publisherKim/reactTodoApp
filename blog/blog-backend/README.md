
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

## nodemon 사용
```
  서버 코드가 변경할 때마다 서버를 재시작 할 필요가 없는 라이브러리
  yarn add --dev nodemon
```

## koa-router 사용
```
  다른 작업을 처리할 수 있도록 라워를 사용해야함
  koar-router 모듈을 설치해야 한다.
  yarn add koa-router
```

### 기본 사용법
```javascript
  // koa-router 모듈의 기본적인 사용법
  const koa = require('koa');
  const Router = require('koa-router');

  const app = new koa();
  const router = new Router();
  
  // 라우터 설정
  router.get('/', (ctx) => {
    ctx.body = '홈';
  });
  router.get('/about', (ctx) => {
    ctx.body = '소개';
  });

  // app 인스턴스에 라우터 적용
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(4000, () => {
    console.log('listening to port 4000');
  });
```

### 라우트 파라미터와 쿼리
```javascript
  /*
  라우트의 파라미터와 쿼리를 읽는 방법
    : 라우터의 파라미터를 설정할 때는 /about/:name (:)을 사용하여 라우트 경로를 설정
      파라미터가 있을 수도 있고 없을 수도 있다면 /about/:name? 같은 형식으로 파라미터 이름 뒤에 물음표를 사용
      설정한 파라미터는 함수의 ctx.params 객체에서 조회 가능
    
    URL 쿼리의 경우, 예를 들어 /posts/?id=10 같은 형식으로 요청했다면 { id: '10' } 형태의 객체를 ctx.query에서 조회 가능
    쿼리스트링을 객체 형태로 파싱해 주므로 별도로 파싱 함수를 돌릴 필요는 없다.(문자열 형태의 쿼리스트링을 조회해야 할 때는 ctx.querystring을 사용)
  */

  // koa-router 모듈의 기본적인 사용법
  const koa = require('koa');
  const Router = require('koa-router');

  const app = new koa();
  const router = new Router();

  // 라우터 설정
  router.get('/', (ctx) => {
    ctx.body = '홈';
  });

  router.get('/about/:name?', (ctx) => {
    const { name } = ctx.params;
    ctx.body = name ? `${name}의 소개` : '소개';
  });

  router.get('/posts', (ctx) => {
    const { id } = ctx.query;
    // id의 존재 유무에 따라 다른 결과 출력
    ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
  });


  // app 인스턴스에 라우터 적용
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(4000, () => {
    console.log('listening to port 4000');
  });

  // http://localhost:4000/about/react, http://localhost:4000/posts, http://loacalhost:4000/posts/?id=10
```

### REST API
```
  웹 애플리케이션을 만들려면 데이터베이스에 정보를 Input and Read
  웹 브라우저에서 데이터베이스에 직접 접속해서 데이터를 변경하면 보안상 문제가 생김
  그런 이유로 REST API를 만들어서 사용함.
      ->                      --
  DB        SERVER(REST API)      클라이언트
      --                      -->
      처리                    응답
  
  클라이언트가 서버에 자신의 데이터를 조회, 생성, 삭제, 업데이트하겠다고 요청하면, 
  서버는 필요한 로직에 따라 데이터베이스에 접근하여 작업을 처리.

  REST API는 요청 종류에 따라 다른 HTTP 메서드를 사용
  HTTP 메서드의 종류는 여러가지로, 주로 사용하는 메서드는 다음과 같다.

  메서드      설명
  GET         데이터를 조회할 때 사용
  POST        데이터를 등록할 때 사용. 인증 작업을 거칠 때 사용하기도 함
  DELETE      데이터를 지울 때 사용
  PUT         데이터를 새 정보로 통째로 교체할 때 사용
  PATCH       데이터의 특정 필드를 수정할 때 사용

  이 메서드의 종류에 따라 get, post, delete, put, patch를 사용하여 라우터에서 각 메서드의 요청을 처리
  router.get get이 바로 HTTP 메서드 GET입니다. POST 요청을 받고 싶다면 router.post(...)를 하면 됨

  REST API를 설계할 때는 API 주소와 메서드에 따라 어떤 역활을 하는지 쉽게 파악할 수 있게 작성 해야 함

  블로그 포스트용 REST API 예시
  POST/posts                                포스트 작성
  GET/posts                                 포스트 목록 조회
  GET/posts/:id                             특정 포스트 조회
  DELETE/posts/:id                          특정 포스트 삭제
  PATCH/posts/:id                           특정 포스트 업데이트(구현 방식에 따라 PUT으로 사용 가능)
  POST/posts/:id/comments                   특정 포스트에 덧글 등록
  GET/posts/:id/comments                    특정 포스트의 덧글 목록 조회
  DELETE/posts/:id/comments/:commentId      특정 포스트의 특정 덧글 삭제
```

### 라우트 모듈화
```javascript
  /*
  프로젝트를 진행하다 보면 여러 종류의 라우트를 만듬
  하지만 각 라우트를 index.js 파일 하나에 모두 작성하면 코드가 너무 길고, 유지보수도 어려움
  라우터를 여러 파일에 분리시켜서 작성하고, 이를 불러와 적용하는 방법
  */
  // src/api/index.js
  const Router = require('koa-router');

  const api = new Router();

  api.get('/test', (ctx) => {
    ctx.body = 'test 성공';
  });

  // 라우터 내보내기
  module.exports = api;

  // src/index.js
  const Koa = require('koa');
  const Router = require('koa-router');

  const api = require('./api');

  const app = new Koa();
  const router = new Router();

  // 라우터 설정
  router.use('/api', api.router()); // api 라우트 적용

  // app 인스턴스에 라우턱 적용
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(4000, () => {
    console.log('listening to port 4000');
  });
```

### posts 라우트 생성
```javascript
  /*
  api 라우트 내부에 posts 라우트 만들기
  src/api/posts
  */
  const Router = require('koa-router');

  const posts = new Router();

  const printInfo = (ctx) => {
    ctx.body = {
      method: ctx.method,
      path: ctx.path,
      prams: ctx.params
    };
  };

  posts.get('/', printInfo);
  posts.post('/', printInfo);
  posts.get('/:id', printInfo);
  posts.delete('/:id', printInfo);
  posts.put('/:id', printInfo);
  posts.patch('/:id', printInfo);

  module.exports = posts;
  /*
    posts 라우트에 여러 종류의 라우트를 설정한 후 모두 printInfo 함수를 호출하도록 설정
    문자열이 아닌 JSON 객체를 반환하도록 설정했고
    이 객체에는 현재 요청의 메서드, 경로, 파라미터를 담음
  */

  // api 라우트에 posts 라우트 연결하기
  const Router = require('koa-router');
  const posts = require('./posts');

  const api = new Router();

  api.use('/posts', posts.routes());

  module.exports = api;

  // posts 라우트를 불러와 설정
```

### 컨트롤러 파일 작성
```javascript
  /*
  라우트를 작성할 때, 라우트를 설정하는 부분 중 파라미터 쪽에 화살표 함수 문법을 사용하여 라우트 처리 함수를 바로 선언 가능
  posts.get('/', (ctx) => {...});

  하지만 각 라우트 처리 함수의 코드 길이가 같다면 라우터 설정을 하눈에 보기가 어렵다.
  가독성을 위해 라우트 처리 함수들을 따로 다른 파일로 분리해서 관리가 가능
  이 라우읕 처리 함수만 모아 놓은 파일이 컨트롤러
  컨트롤러에서는 백엔드 기능을 구현

  koa-bodyparser 미들웨어를 적용해야 함
  이 미들웨어는 POST/PUT/PATCH 같은 메서드의 Requet Body JSON 형식으로 데이터를 넣어주면,
  이를 파싱하여 서버에서 사용 가능
  yarn add koa-bodyparser
  */
  const Koa = require('koa');
  const Router = require('koa-router');
  const bodyParser = require('koa-bodyparser');

  const api = require('./api');
  const app = new Koa();
  const router = new Router();

  // 라우터 설정
  router.use('/api', api.routes());

  // 라우터 적용 전에 bodyParser 적용
  app.use(bodyParser());

  // app 인스턴스에 라우터 적용
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(4000, () => console.log('listening to port 4000'));

  // 컨트롤러를 만든다.
  let postId = 1;

  const posts = [
    {
      id: 1,
      title: '제목',
      body: '내용'
    }
  ];

  /*
    포스트 작성
    POST /api/posts
    { title, body }
  */
  exports.write = (ctx) => {
    // REST API의 request body는 ctx.request.body에서 조회할 수 있다.
    const {
      title,
      body
    } = ctx.request.body;

    postId += 1; // 기존 postId 값에 1을 더합니다.

    const post = { id: postId, title, body };
    posts.push(post);
    ctx.body = post;
  }

  /*
    포스트 목록 조회
    GET /api/posts
  */
  exports.list = (ctx) => {
    ctx.body = posts;
  };

  /*
    특정 포스트 조회
      GET /api/posts/:id
  */
  exports.read = (ctx) => {
    const { id } = ctx.params;

    // 주어진 id 값으로 포스트를 찾음
    // 파라미터로 받아 온 값은 문자열 형식이니 파라미터를 숫자로 변환하거나,
    // p.id 값을 문자열로 변경해야 함
    const post = posts.find( p => p.id.toString() === id);

    // 포스트가 없으면 오류를 반환
    if (!post) {
      ctx.status = 404;
      ctx.body = {
        message: '포스트가 존재하지 않습니다.'
      };
      return;
    }

    ctx.body = post;
  };

  /*
    특정 포스트 제거
    DELETE /api/posts/:id
  */
  exports.remove = (ctx) => {
    const { id } = ctx.params;

    // 해당 id를 가진 post가 몇 번째인지 확인
    const index = posts.findIndex(p => p.id.toString() === id);

    // 포스트가 없으면 오류를 반환
    if (index === -1) {
      ctx.status = 404;
      ctx.body = {
        message: '포스트가 존재하지 않습니다.'
      };
      return;

      // index번째 아이템을 제거
      posts.splice(index, 1);
      ctx.status = 204; // No Content
    };

    /*
      포스트 수정(교체)
        PUT /api/posts/:id
        { title, body }
    */
    exports.replace = (ctx) => {
      // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용
      const { id } = ctx.params;

      // 해당 id를 가진 post가 몇 번쨰인지 확인 가능
      const index = posts.findIndex(p => p.id.toString() === id);

      // 포스트가 없으면 오류를 반환
      if (index === -1) {
        ctx.status = 404;
        ctx.body = {
          message: '포스트가 존재하지 않습니다.'
        };
        return;
      }

      // 전체 객체를 덮어 씌운다.
      // 따라서 id를 제외한 기존 정보를 날리고, 객체를 새로 만듬
      posts[index] = {
        id,
        ...ctx.request.body
      };
      ctx.body = posts[index];
    };

    /*
      포스트 수정(특정 필드 변경)
        PATCH /api/posts/:id
        { title, body }
    */

    exports.update = (ctx) => {
      // PATCH 메서드는 주어진 필드만 교체
      const { id } = ctx.params;

      // 해당 id를 가진 post가 몇 번째인지 확인 가능
      const index = posts.findIndex( p => p.id.toString() === id);

      // 포스트가 없으면 오류를 반환
      if (index === -1) {
        ctx.status = 404;
        ctx.body = {
          message: '포스트가 존재하지 않습니다.'
        };
        return;
      }

      // 기존 값에 정보를 덮어 씌움
      posts[index] = {
        ...posts[index],
        ...ctx.request.body
      };
      ctx.body = posts[index];
    };
  };

  // 내보낸 함수는 다음과 같이 로드하고 사용 가능
  const moduleName = require('fileName');
  moduleName.fileName();

  // 즉, 방금 만든 posts.ctrl 파일을 불러오면 다음 객체가 로드됨
  {
    write: [Function],
    list: [Function],
    read: [Function],
    remove: [Function],
    replace: [Function],
    update: [Function]
  }
  // 이제 컨트롤러 함수들을 각 라우트에 연결하기

  // src/api/posts/index.js
  const Router = require('koa-router');
  const postsCtrl = require('./posts.ctrl');

  const posts = new Router();

  posts.get('/', postsCtrl.list);
  posts.post('/', postsCtrl.write);
  posts.get('/:id', postsCtrl.read);
  posts.delete('/:id', postsCtrl.remove);
  posts.put('/:id', postsCtrl.replace);
  posts.patch('/:id', postsCtrl.update);

  module.exports = posts;

  /*
    posts 라우터를 완성

    list, read, remove를 제외한 API들은 요청할 때 Request Body가 필요
    Postman에서 이 값을 어떻게 넣는지 확인하자
  */
```

## 정리
```
  Koa를 사용하여 백엔드 서보를 만드는 기본 개념
  REST API를 이해하고 어떻게 작동하는지, 자바스크립트의 배열을 사용하여 구현
  다음 장에서는 MySQL, MongoDB 등 데이터베이스에 정보를 저장하여 관리
  데이터베이스를 사용하면 다양하고 효율적인 방식으로 많은 양의 데이터를 읽고 쓸수 있음
```