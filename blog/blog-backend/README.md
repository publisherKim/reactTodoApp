# moongoose를 이용한 MongoDB 연동 실습
```
  19.1 소개
  19.2 MongoDB 서버 준비
  19.3 mongoose 설치 및 적용
  19.4 데이터베이스의 스키마와 모델
  19.5 MongoDB 클라이언트 설치
  19.6 데이터 생성과 조회
  19.7 데이터 삭제와 수정
  19.8 요청 검증
  19.9 페이지네이션 구현
  19. 10 정리
```
```
  mongoose를 이용한 mongoDB 연동
    1. MongoDB 기본 지식 알아보기
    2. 작업환경 설정하기
    3. mongoose로 데이터베이스 연결하기
    4. 스키마와 모델 이해하기
    5. REST API 구현하기
    6. 페이지네이션 구현하기
```

## 소개
```
  데이터베이스로 웹 서비스에서 사용되는 데이터를 저장
  효휼적으로 조회 및 수정 용이
  기존 MySQL, OracleDB, PostgreSQL 같은 RDBMS(relation database management system)를 자주 사용

  관계형 데이터 베이스의 한계
    1. 데이터 스키마가 고정적(스키마란 데이터 베이스에 어떤 형식의 데이터를 넣을지 가리키는 정보)
      1.1 새로 등록하는 데이터 형식이 기존에 있던 데이터들과 다르면 기존 데이터를 모두 수정해야 등록가능(수정이 번거로움)
    2. 처리해야 할 데이터야이 늘어나면 여러 컴퓨터에 분산시키는것이 아니라 서버의 성능을 늘려야 함(scale up)

  MongoDB는 이런 한계를 극복한 문서 지향적 NoSQL 데이터베이스
    1. 등록하는 데이터들은 유동적인 스키마를 가짐
      1.1 종류가 같은 데이터라고 하더라도, 새로 등록해야 할 데이터 형식이 바뀐다고 하더라도 기존 데이터까지 수정할 필요가 없음
    2. 서버의 데이터양이 늘어나도 한 컴퓨터에만 처리하는 것이 아니라 여러 컴퓨터로 분산하여 처리할수 있도록 확장하기 쉬운 설계 가능
```

### 문서란?
```
  문서의 데이터 구조는 한 개 이상의 key-value 쌍
  
  {
    "_id": ObjectId("599865213146877"),
    "username": "ho",
    "name": {first: "gil-dong", last: "hong"}
  }

  문서는 BSON(바이너리 형태의 JSON) 형태로 저장
  JSON 형태의 객체를 데이터베이스에 저장할 때, 큰 공수를 들이지 않고도 데이터를 데이터베이스에 등록이 용이

  새로운 문서를 만들면 _id라는 고유 값을 자동으로 생성하는데, 이 값은 시간, 머신 아이디, 프로세스 아이디, 순차 번호로 되어 있어 값의 고유함을 보장함.

  여러 문서가 들어 있는 곳을 컬렉션이라고 함
  다른 스키마를 가지고 있는 문서들이 한컬렉션에 공존이 가능
  {
    "_id": ObjectId("599865213146877"),
    "username": "ho",
    "name": {first: "gil-dong", last: "hong"}
  }
  {
    "_id": ObjectId("599865213146878"),
    "username": "ho2",
  }  
```

### MongoDB structure
```
  서버 하나에 데이터베이스를 여러 개 가지고 있을 수 있음
  각 데이터베이스에는 컬렉션이 여러개 있으며, 컬렉션 내부에는 문서들이 존재함.
  서버
    데이터베이스
      컬렉션                  컬렉션
        문서                    문서
        문서                    문서
        문서                    문서

    데이터베이스
      컬렉션                  컬렉션                    컬렉션
        ...                     ...                     ...
```

### 스키마 디자인
```
  MongoDB에서 스키마 디자인하는 방식은 기존 RDBMS에 스키마를 디자인하는 방식과 다름
  RDBMS에서 블로그용 데이터 스키마를 설계한다면 각 포스트, 댓글마다 테이블을 만들어
  필요에 따라 JSON해서 사용하는 것이 일반적

  RDBMS에서 데이터베이스 설계했을때 구조
    RDBMS의 블로그 ERD
      post                                        comment
        *id                                         *id
        title                                       post_id
        body                                        user_id
        user_id                                     text
        created_date                                create_date
                                user
                                  *id
                                  username
  
  그러나 NoSQL에서는 그냥 모든 것을 Document 하나에 넣음. 다음과 같다.
  {
    _id: ObjectId,
    title: String,
    body: String,
    username: String,
    createDate: String,
    comments: [
      {
        _id: ObjectId,
        text: String,
        createDate: Date
      }
    ]
  }
  이런 상황에서 보통 MongoDB는 덧글들을 포스트 문서 내부에 가짐 문서 내부에 또 다른 문서들이 위치할 수 있는데, 이를 서브다큐먼트라고 함
  서브다큐먼트 또한 일반 문서를 다루는 것처럼 쿼리 가능

  문서에 하나에는 최대  16MB만큼 데이터 저장 가능 100자 댓글 데이터라면 대략 0.24KB를 차지함
  16MB는 1만 6,384KB이니 문서 하나에 댓글 데이터를 6만 8,000개 까지 입력 가능

  이용량을 초과할 가능성이 있다면 컬렉션을 분리시키는 것이 좋다.
```

## MongoDB 서버 준비
```
  MongoDB 서버 설치

  macOS home brew를 이용하여 간편하게 설치
  1. brew update
  2. brew install mongodb
  3. brew services start mongodb

  windows 
  1. https://www.mongodb.com/download-center?jmp=homepage#community 에서 인스톨러를 다운받아 설치
  2. 데이터베이스가 저장되는 경로: C:\data\db
  3. 기본 설치 경로: C:\Program Files\MongoDB\Server\버전\bin
  4. 해당 디렉터리로 이동하여 mongod 명령어를 입력해서 서버를 실행 가능
  5. 데이터베스 디렉토리 임의 설정: 디렉토리를 먼저 만들고, mongod -dbpath "c:\custom_folder" 형식으로 명령어를 실행

  mongoDB 환경변수 setting
  시스템창 -> 고급 시스템 설정 -> 환경변수 -> PATH 선택 -> 편집 -> 새로 만들기 -> C:\Program Files\MongoDB\Server\버전\bin입력 -> 확인
```

## mongoose 설치 및 적용
```
  mongoose는 Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modelling) 라이브러리이다.
  이 라이브러리는 데이터베이스 문서들을 자바스크립트 객체처럼 사용 가능하게 해줌
  
  yarn add mongoose dotenv

  dotenv는 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구
  mongoose를 연결할때, 서버 계정과 비밀번호를 입력시 민감한 정보는 코드에 직접 작성 하지 않고
  환경 변수로 설정하는 것이 좋다.
  .gitingnor를 작성하여 환경변수가 들어 있는 파일을 제외한다.
```

### .env 환경변수 파일 생성
```javascript
  // 환경변수에는 서버에서 사용할 포트와 MongoDB 주소를 넣어준다.

  // .env
  PORT=4000
  MONGO_URI=mongodb://localhost/blog
  
  // blog는 우리가 사용할 데이터베이스 이름으로 데이터베이스가 없을경우 자동으로 생성하므로 사전에 따로 생성하지 않아도 된다.

  // src/index.js
  require('dotenv').config();
  (...)
  const {
    PORT: port = 4000,
    MONGO_URI: mongoURI
  } = process.env;
  (...)
  app.listen(port, () => {
    console.log('listening to port', port);
  })
```

### mongoose로 데이터베이스에 연결
```javascript
  // mongoose를 이영하여 서버에데이터베이스를 연결하기

  // src/index.js
  (...)
  const mongoose = require('mongoose');

  const {
    PORT: port = 4000,
    MONGO_URI: mongoURI
  } = process.env;

  mongoose.Promise = global.Promise;
  mongoose.connect(mongoURI).then(() => {
    console.log('connected to mongodb');
  }).catch((e) => {
    console.error(e);
  });

  /*
    mongoose에서 데이터베이스에 요청할 때, 이를 Promise 기반으로 처리 가능
    이때 어떤 형식의 Promise를 사용할지 정해야 함
    Node v7 이전에는 공식적인 Promise가 없어 bluebird, Promise/A+등 여러 구현체중 선택
    이제는 Node.js 자체에 Promise를 내장하고 있어서 내장된 Promise를 사용하도록 설정해 주어야 함

    MongoDB 주소는 process.env 파일에 적어 놓았던 MONGO_URI 값이며, 이 주소를 사용하여 접속 하도록 설정
  */
```

## 데이터베이스의 스키마와 모델
```
  mongoose에는 스키마(scheme)와 모델(model)이라는 개념이 있는데, 둘을 혼동하기 쉽다. 
  스키마는 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체
  반면 모델은 스키마를 사용하여 만드는 인스턴스로, 데이터베이스에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체

  스키마와 모델:
    스키마
      {
        title: String,                mongoose.model(...)
        active: Boolean,                    ->                    모델
        date: Date...                 모델로 만들기
      }

                            데이터베이스(모델을 사용하여 데이터 읽고 쓰기)
```

### 스키마생성
```javascript
  /*
    모델을 만들려면 사전에 스키마를 만들어 주어야 함.
      - 제목
      - 내용
      - 태그
      - 작성일
    포스트 하나에는 이렇게 총 네 가지 정보가 필요함.
    각 정보에 대한 필드 이름과 데이터 타입을 설정하여 스키마를 만듬
  */

  // 필드 이름과 데이터 타입 설정
  /*
    필드이름                    데이터 타입                   설명
    title                       string                      제목
    body                        string                      내용
    tags                        array                       태그 목록
    publishDate                 date                        작성 날짜

    title, body, tags, publishedDate 총 네 가지 필드가 있는 스키마를 작성
  */

  // 스키마와 모델에 관련된 코드는 src/models
  const mongoose = require('mongoose');

  const { Schema } = mongoose;

  const Post = new Schema({
    title: String,
    body: String,
    tags: [String], // 문자열 배열
    publishDate: {
      type: Date,
      default: new Date() // 현재 날짜를 기본 값으로 지정
    }
  });

  /*
    스키마를 만들 때는 mongoose 모듈의 Schema를 사용하여 정의 함 그리고 각 필드 이름과 필드의 데이터 타입 정보가 들어 있는 객체를 작성함
    필드 기본 값은 default를 설정해 주면 됨
  */

  // Schema에서 지원하는 타입
  /*
    타입                    
    String: 문자열       
    Number: 숫자
    Date: 날짜
    Buffer: 파일을 담을수 있는 버퍼
    Boolean: true || false value
    Mixed(Schema, Types, Mixed): 어떤 데이터도 넣을 수 있는 형식
    ObjectId(Schema, Types, ObjectId): 객체 아이디, 주로 다른 객체를 참조 할 때 넣음
    Array: 배열 형태의 값으로 []로 감싸서 사용
  */

  // 좀더 복잡한 방식의 데이터도 저장 가능 ex
  const Author = new Schema({
    name: String,
    email: String
  });

  const Book = new Schema({
    title: String,
    description: String,
    authors: [Author],
    meta: {
      likes: Number
    },
    extra: Schema.Types.Mixed
  });
  // 이렇게 다른 스키마 내부에 스키마를 내장 가능
```

### 모델 생성
```javascript
  // src/models/post.js
  (...)
  module.exports = mongoose.model('Post', Post);

  /*
    모델 인스턴스를 만들고, module.exports로 내보내 줌
    여기에서 사용한 model() 함수는 기본적으로 파라미터가 두 개 필요함.
    첫 번째 파라미터는 스키마 이름이고,
    두 번째 파라미터는 스키마 객체이다.
    데이터베이스는 스키마 이름을 정해 주면 이름의 복수 형태로 데이터베이스에 컬렉션 이름을 만듬

    예를 들어 스키마 이름을 Post로 설정하면 실제 데이터베이스에 만드는 컬렉션 일므은 posts이다.
    BookInfo로 설정시 bookinfos로 만듬

    MongoDB에서 컬렉션 이름을 만들 때 컨벤션은 구분자를 사용하지 않고, 복수 형태로 사용하는 것
    이 컨번벤션을 따르고 싶지 않다면 세번째 파라미터에 컬렉션 이름을 설정하면 됨
  */
  mongoose.model('Post', Post, 'custom_book_collection');
  // 모델을 만들 때 첫 번째 파라미터로 쓰는 이름은 나중에 다른 스키마에서 현재 스키마를 참조해야 하는 상황에서 사용함.
```

## MongoDB 클라이언트 설치
```
  스키마와 모델을 만들었다면 이번에는 이 모델을 사용하여 직접 데이터베이스에 데이터를 읽고 쓰기
```

### Robo 3T 설치
```
  MongoDB를 PC에 설치했다면 터미널에서 mongo 명령어를 입력하여 데이터베이스에 직접 접속해서 
  데이터를 조회하고 변경 가능 하지만 mongo 명령어에 익숙하지 않은 상태라면 Robo 3T를 이용해 
  MongoDB를 편하게 조회하고 변경가능하다.
  https://robomonog.org/download 에서 운영체제에 맞게 설치 가능
```

## 데이터 생성과 조회
```
  데이터베이스를 연동해서 MongoDB 내부에 데이터를 등록해 보기
```

### NODE_PATH와 jsconfig.json
```javascript
  /*
    상대경로로 설정한걸 절대 경로로 설정 바꾸기
  */

  // package.json - scripts
  "scripts": {
    "start": "NODE_PATH=src node src",
    "start:dev": "NODE_PATH=src nodemon --watch src/ src/index.js"
  }

  // window case:  yarn add --dev cross-env
  "scripts": {
    "start": "cross-env NODE_PATH=src node src",
    "start:dev": "cross-env NODE_PATH=src nodemon --watch src/ src/index.js"
  }

  // jsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src"
    }
  }

  // .eslintrc.js
  const path = require('path');

  module.exports = {
    "extends": "airbnb-base",
    "settings": {
      "import/resolver": {
        node: { paths: [path.resolve('./src')] }
      }
    },
    "rules": {
      "no-unused-vars": 1,
      "comma-dangle": 0,
      "no-console": 0,
      "eol-last": 0
    }
  };
```

### 데이터 생성
```javascript
  const Post = require('models/post');

/*
  POST /api/posts
  { title, body, tags }
*/
exports.write = async (ctx) => {
  const { title, body, tags } = ctx.request.body;
  // 새 Post 인스턴스를 생성합니다.
  const post = new Post({
    title, body, tags
  });
  try {
    await post.save(); // 데이터베이스에 등록합니다.
    ctx.body = post; // 저장된 결과를 반환합니다.
  } catch(e) {
    // 데이터베이스의 오류 발생
    ctx.throw(e, 500);
  }
}

/*
  GET /api/posts
*/
  // src/api/posts/posts.ctrl.js
  const Post = require('model/post');

  exports.write = (ctx) => {

  };

  exports.list = (ctx) => {

  };

  exports.read = (ctx) => {
    
  };

  exports.remove = (ctx) => {

  };

  exports.update = (ctx) => {
    
  };

  // src/api/posts/index.js
  const Router = require('koa-router');
  const postsCtrl = require('./posts.ctrl');

  const posts = new Router();

  posts.get('/', postsCtrl.list);
  posts.post('/', postsCtrl.write);
  posts.get('/:id', postsCtrl.read);
  posts.delete('/:id', postsCtrl.remove);
  posts.patch('/:id', postsCtrl.update);

  module.exports = posts;

  // write 함수 먼저 구현하기 src/api/posts/posts.ctrl.js
  /*
    POST /api/posts
    { title, body, tags } 
  */
  exports.write = async (ctx) => {
    const { title, body, tags } = ctx.request.body;

    // 새 Post 인스턴스를 만듬
    const post = new Post({
      title, body, tags
    });

    try {
      await post.save();  // 데이터베이스에 등록
      ctx.body = post;  // 저장된 결과를 반환
    } catch(e) {
      // 데이터베이스의 오류가 발생
      ctx.throw(e, 500);  
    }
  };
  /*
    포스트의 인스턴스를 만들 떄는 new 키워드를 사용
    생성자 함수의 파라미터에 정보를 지닌 객체를 넣음

    인스턴스를 만든다고 해서 바로 데이터베이스에 저장되는건 아님
    .save() 함수를 실행시켜야 데이터베이스에 저장됨
    이 함수의 반환 값은 Promise여서 async/await 문법으로 데이터베이스
    저장 요청을 완료할 때까지 await를 사용하여 대기 가능
    await를 사용 하려면 함수를 선언하는 부분 앞에 async 키워드를 넣어야 하고,
    await를 사용할 때는 try~catch문으로 오류를 처리해 준다.
  */
```

### 데이터 조회
```javascript
  // src/api/posts/posts.ctrl.js - list
  /*
    GET /api/posts
  */
  exports.list = async (ctx) => {
    try {
      const posts = await Post.find().exec();
      ctx.body = posts;
    } catch(e) {
      ctx.throw(e, 500)
    }
  };

  /*
    find() 함수를 호출한 후에는 exec()를 붙어 주어야 서버에 쿼리를 요청한다.
    데이터를 조회할때 특정 조건을 설정할 수 있으며, 불러오는 제한도 설정 가능하다.
  */
```

### 특정포스트 조회
```javascript
  // 특정 id를 가진 데이터를 조회할 떄는 모델의 findById 함수를 사용한다.
  // src/api/posts/posts.js - read
  /*
    GET /api/posts/:id
  */
  exports.read = async (ctx) => {
    const { id } = ctx.params;

    try {
      const post = await Post.findByid(id).exec();

      // 포스트가 존재하지 않습니다.
      if(!post) {
        ctx.status = 404;
        return;
      }
      ctx.body = post;
    } catch (e) {
      ctx.throw(e, 500);
    }
  };
```

## 데이터 삭제와 수정

### 데이터 삭제
```javascript
  /*
    데이터를 삭제할때 사용하는 함수들
      - remove: 특정 조건을 만족하는 데이터들을 모두 지움
      - findByIdAndRemove: id를 찾아서 지움
      - findOneAndRemove: 특정 조건을 만족하는 데이터 하나를 찾아서 제거
  */
  // src/api/posts/posts.ctrl.js - remove
  /*
    DELETE /api/posts/:id
  */
  exports.remove = async (ctx) => {
    const { id } = ctx.params;
    try {
      await Post.findByIdAndRemove(id).exec();
      ctx.status = 204;
    } catch(e) {
      ctx.throw(e, 500)
    }
  };
```

### 데이터 수정
```javascript
  /*
    데이터를 업데이트할 때는 findByIdAndUpdate 함수를 사용
    첫번째 parameter id
    두번째 parameter 업데이트 내용
    세번째 parameter 업데이트 설정 객체
  */
  // src/api/posts/posts.ctrl.js - update
  /*
    PATCH /api/posts/:id
    { title, body, tags }
  */
  exports.update = async (ctx) => {
    const { id } = ctx.params;

    try {
      const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
        new: true
        // 이값을 설정해야 업데이트 된 객체를 반환한다.
        // 설정하지 않으면 업데이트 되기전의 객체를 반환한다.
      }).exec();
      // 포스트가 존재하지 않을 때
      if(!post) {
        ctx.status = 404;
        return;
      }
      ctx.body = post;
    } catch(e) {
      ctx.throw(e, 500);
    }
  };
```

## 요청 검증
### ObjectId 검증
```javascript
  /*
    요청을 검증하기
    id가 올바바른 ObjectId 형식이 아니면 500 오류가 발생
    500 오류는 보통 서버에서 처리하지 않아 내부 적으로 문제가 생겼을때 발생

    잘못된 id를 전달했다면 클라이언트가 요청을 잘못 보낸 것이니 400 오류르 띄워주는게 맞음
    그러려면 id 값이 올바른 ObjcetId인지 확인이 필요함.
  */
  const { ObjectId } = require('mongoose').Types;
  ObjectId.isValid(id);

  /*
    Object Id를 검증해야 하는 API는 read, remove, update 이렇게 세 가지 이다.
    모든 함수에서 이를 확인하여 처리하는데, 일일이 작성하면 불필요한 코드가 중복
    이를 막기위해 미들웨어를 만들어 활용한다.
  */
  // src/api/posts.ctrl.js
  const Post = require('models/post');

  const { ObjectId } = require('mongoose').Types;

  exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;

    // 검증 실패
    if(!ObjectId.isValid(id)) {
      ctx.status = 400; // 400 Bad Request
      return null;
    }

    return next();
  };

  // 라우트를 설정하는 src/api/posts/index.js에서 ObjectId 검증이 필요한 부분에 추가한다.
  // src/api/posts/index.js
  const Router = require('koa-router');
  const postsCtrl = require('./posts.ctrl');

  const posts = new Router();

  // src/api/posts.ctrl.js
  const { ObjectId } = require('mongoose').Types;

  exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;

    // 검증 실패
    if(!ObjectId.isValid(id)) {
      ctx.status = 400; // 400 Bad Request
      return null;
    }

    return next();
  };

  // 라우트를 설정하는 src/api/post/index.js에서 ObjectId 검증이 필요한 부분에 방금 만든 미들웨어를 추가한다.
  posts.get('/:id', postsCtrl.checkObjectId, postsCtrl.read);
  posts.delete('/:id', postsCtrl.checkObjectId, postsCtrl.remove);
  posts.patch('/:id', postsCtrl.checkObjectId, postsCtrl.update);
```
