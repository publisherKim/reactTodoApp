# 19 mongoose를 이용한 MongoDB 연동 실습
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
  19.10 정리
```
## introduce
```
  Node.js 서버와 MongoDB를 연동할 수 있도록 MongoDB 기초 지식과
  mongoose를 이용하여 서버에서 직접 데이터를 추가, 조회, 삭제 수정 하는 방법

  1. MongoDB 기본 지식 알아보기
  2. 작업 환경설정하기
  3. mongoose로 데이터베이스 연결하기
  4. 스키마와 모델 이해하기
  5. REST API 구현하기
  6. 페이지네이션 구현하기
```
## 소개
```
  데이터베이스로 웹 서비스에서 사용되는 데이터를 저장하고, 효율적으로 조회 및 수정할 수 있다.
  기존에는 MySQL, OracleDB, PostgreSQL 같은 RDBMS(관계형 데이터베이스)를 자주 사용함
  관계형 데이터베이스에는 몇가지 한계가 존재함
  1. 스키마가 고정적
    - 스키마란 데이터베이스에 어떤 형식의 데이터를 넣을지 정보를 가리킴
    - ex: 회원정보 스키마라면 계정 이름, 이메일, 이름 등
    - 새로 등록하는 데이터 형식이 기존에 있던 데이터들과 다르다면? 기존 데이터를 모두 수정해야 새 데이터를 등록 가능
    - 그래서 데이터 양이 많을 때는 데이터베이스의 스키마를 변경하는 작업이 매우 번거로워 짐
  2. 확장성
    - RDBMS는 저장하고 처리해야 할 데이터양이 늘어나면 여러 컴퓨터에 분산시키는 것이 아님
    - 해당 데이터베이스 서버의 성능을 업그레이드 하는 방식으로 확장 해야함
  
  MongoDB는 이런 한계를 극복한 문서 지향적 NoSQL 데이터베이스이다.
  이 데이터베이스에 등록하는 데이터들은 유동적인 스키마를 가짐
  종류가 같은 데이터라고 하더라도, 새로 등록해야 할 데이터 형식이 바뀐다고 하더라도 기존 데이터까지 수정할 필요가 없음
  서버의 데이터양이 늘어나도 한 컴퓨터에서만 처리하는 것이 아니라 여러 컴퓨터로 분산하여 처리할 수 있도록 확장하기 쉽게 설계 됨
```

### 문서란?
```
  RDBMS의 record의 개념과 비슷
  문서의 데이터 구조는 한 개 이상의 key-value 쌍을 가짐
  ex:
    {
      "_id": ObjectId("5999520234564"),
      "username": "test",
      "name": { first: "K", last: "kkk"}
    }

    문서는 BSON(바이너리 형태의 JSON) 형태로 저장
    나중에 JSON 형태의 객체를 데이터베이스에 저장할 때, 큰 공수를 들이지 않고도
    데이터를 데이터베이스에 등록 할수 있어 편리

    새로운 문서를 만들면 _id라는 고유 값을 자동으로 생성 가능,
    이 값은 시간, 머신 아이디, 프로세스 아이디, 순차 번호로 되어 있어 값의 고유함을 보장함

    여러 문서가 들어 있는 곳을 컬렉션이라고 함.
    기존 RDBMS에서는 테이블 개념을 사용하기에 각 테이블마다 같은 스키마를 가지고 있어야 함
    새로 등록해야 할 데이터가 다른 스키마를 가지고 있다면 기존 데이터들의 스키마도 모두 바꾸어 주어야 함

    MongoDB는 다른 스키마를 가지고 있는 문서들이 한 컬렉션에서 공존할 수 있다.
    {
      "_id": ObjectId("5959898961231657"),
      "username": "test1"
    },
    {
      "_id": ObjectId("5646548732187353"),
      "username": "test2",
      "phone": "010-1234-1234"
    }

    처음에는 데이터 전화번호가 필요 없었는데, 나중에 필요해졌다고 가정했을때,
    RDBMS에서는 한 테이블의 모든 데이터가 같은 스키마를 가져야 하기 때문에,
    기존 데이터 전체를 일일이 수정해야 함
    하지만 MongoDB에서는 컬렉션 안의 데이터가 같은 스키마를 가지고 있을 필요가 없으므로
    바로 넣어 주면 된다.
```

### MongoDB structure
```
  MongoDB 구조는 다음과 같다.
  서버 하나에 데이터베이스를 여러 개 가지고 있을수 있다.
  그리고 각 데이터베이스에는 컬렉션이 여러 개 있으며, 컬렉션 내부에는 문서들이 들어 있다.
  서버
    데이터베이스
      컬렉션          컬렉션
        문서            문서
        문서            문서
        문서            문서
    
    데이터베이스
      컬렉션          컬렉션          컬렉션
      ...      
```

### 스키마 디자인
```
  MongoDB에서 스키마를 디자인하는 방식은 기존 RDBMS에서 스키마를 디자인하는 방식과 다르다.
  RDBMS에서 블로그용 데이터 스키마를 설계 했다면 각 포스트, 댓글마다 테이블을 만들어 필요에 따라
  JSON해서 사용하는 것이 일반적

  RDBMS에서 데이터베이스를 설계한다면 그 구조는 다음과 유사하다.
  post                              comment
    *id                               *id
    title                             post_id
    body                              user_id
    user_id                           text
    created_date                      created_date

                      user
                        *id
                        username
  
  하지만 NoSQL에서는 그냥 모든 것을 Document 하나에 넣음.
  {
    _id: ObjectId,
    title: String,
    body: String,
    username: String,
    createData: Date,
    comments: [
      {
        _id: ObjectId,
        text: String,
        createDate: Date
      }
    ]
  }

  이런 상황에서 보통 MongoDB는 덧글들을 포스트 문서 내부에 넣는다.
  문서 내붸 또 다른 문서들이 위치할 수 있는데, 이를 서브다큐먼트라고 함
  서브다큐먼트 또한 일반 문서를 다루는 것처럼 쿼리 가능하다.

  문서 하나에 최대 16MB만큼 데이터를 저장 가능
  100자 댓글 데이터라면 대략 0.24KB를 차지함
  16MB는 1만 6,384KB이니 문서 하나에 댓글 데이터를 6만 8,000개 저장 가능

  이용량을 초과할 가능성이 있다면 컬렉션을 분리시키는 것이 좋다.
```

## MongoDB 서버 준비

### 설치
```
  MongoDB 서버를 사용하려면 우선 설치 부터 해야 함

    macOs:
      brew update
      brew install mongodb
      서버 실행
      brew services start mongodb
        => Successfully started `mongodb` (label: homebrew.mxcl.mongodb)
    
    Windows
      https://wwww.mongodb.com/download-center?jmp=homepage#community
      사이트에 접속후 인스톨러를 다운
      data basic path: C:\data\db
      MongoDB basic path: C:\program Files\MongoDB\Server\버전\bin
      터미널을 열어 해당 경로로 이동 후 mongod 명령어를 입력해서 서버를 실행

      환경변수 설정하기
        : 시스템 창 -> 고급 시스템 설정 -> 환경변수 -> PATH 선택 -> 편집 -> 새로 만들기 -> C:\Program Files\MongoDB\Server\4.0\bin 입력 -> 확인
```

### MongoDB 작동 확인
```
  MongoDB를 설치하고 실행 
  제대로 설치 했는지 확인하려면 터미널에서 mongo를 입력하고
  version()을 입력하고 
  버전이 잘 나타나는지 확인 함
```

## mongoose 설치 및 적용
```
  mongoose는 Node.js 환경에서 사용하는 MongoDB 기반 ODM(Object Data Modeling) 라이브러리이다.
  이 라이브러리는 데이터베이스 문서들을 자바스크립트 객체처럼 사용할 수 있게 함
  19.6 mongoose
  yarn add mongoose dotenv

  dotenv는 환경변수들을 파일에 넣고 사용할 수 있게 하는 개발 도구입니다.
  mongoose를 연결할때, 서버 계정과 비밀번호를 입력하게 됨
  민감한 정보는 코드에 직접 작성하지 않고, 환경 변수로 설정하는 것이 좋다.
  프로젝트를 오픈 소스로 공개할 때는 .gitignore를 작성하여 환경 변수가 들어 있는 파일을 제외시킨다.
```
### .env 환경변수 파일 생성
```javascript
  /*
  환경벼수에는 서버에서 사용할 포트와 MonggoDB 주소를 넣어줌
  프로젝트 루트경로에 .env 파일을 만들고 다음과 같이 입력한다.
  */
  .env 
    PORT=4000
    MONGO_URI=mongodb://localhost/blog
  /*
  여기에서 blog는 우리가 사용할 데이터베이스 이름이다.
  데이터베이스가 없다면 자동으로 만드므로 사전에 따로 생성할 필요가 없다.
  src/index.js 파일 맨 위쪽에 다음과 같이 dotenv를 적용하자.
  Node.js에서 환경변수는 process.env 파일로 조회 가능

  src/index.js
  */
    require('dotenv').config();
    const Koa = require('koa');
    const Router = require('koa-router');
    const bodyParser = require('koa-bodyparser');
  /*
  그리고 비구조화 할당 문법을 사용하여 process.env 파일 내부 값에 대한 레퍼런스를 만들고, port에는 기본 값이 없으면 4000을 사용하도록 작성
  /src/index.js
  */
    const {
      PORT: port = 4000,
      MONGO_URI: mongoURI,
    } = process.env;

    const app = new Koa();
    const router = new Router();
  /*
  마지막으로 코드 아래쪽 서버 포트를 설정하는 부분에서 4000 대신 port 값을 넣어 준다.
  src/index.js
  */
    app.listen(port, () => {
      console.log('listening to port', port)
    });
  /*
  코드를 저장하고 서버가 오류 없이 제대로 구동되는 확인.
  그리고 .env 파일에서 PORT를 4001로 변경하고, 서버를 재시작해 보자.
  (.env 파일을 변경 했을때는 nodemon에서 자동으로 재시작 하지 않으므로 직접 재시작해 주어야 함)
  바뀐 포트로 서버가 실행되었는지 확인
  */
```

### mongoose로 데이터베이스에 연결
```javascript
  // src/index.js
  const mongoose = require('mongoose');

  const {
    PORT: prot = 4000,
    MONGO_URI: mongoURI
  } = process.env;

  mongoose.Promise = global.Promise;  // Node의 Promise를 사용하도록 설정
  mongoose.connect(mongoURI).then(() => {
    console.log('connected to mongodb');
  }).catch((e) => {
    console.log(e);
  });
  /*
    mongooe에서 데이터베이스에 요철할 때, 이를 Promise 기반으로 처리할 수 있다.
    이때 어떤 형식의 Promise를 사용할지 정해야 한다.
    (Node v7 이전에는 공식적인 Promise가 없어 bluebird Promise/A+ 등 여러 구현체가 있다.)

    MongoDB 주소는 process.env 파일에 적어 놓았던 MONGO_URI 값이며, 이 주소를 사용하 여 접속 하도록 설정
  */
```

### mongoose로 데이터베이스에 연결
```javascript
  mongoose.Promise = global.Promise;  // Node의 Promise를 사용하도록 설정
  mongoose.connect(mongoURI).then(() => {
    console.log('connected to mongodb');
  }).catch((e) => {
    console.error(e);
  });
```

## 데이터베이스의 스키마와 모델
```
  mongoose에는 스키마(schema)와 모델(model)이라는 개념이 있는데, 둘을 혼동하기 쉽다.
  스키마는 컬렉션에 들어가는 문서 내부의 각 필드가 어떤 형식으로 되어 있는지 정의하는 객체이다.
  반면 모델은 스키마를 사용하여 만드는 인스턴스로, 데이터베이스에서 실제 작업을 처리할 수 있는 함수들을 지니고 있는 객체이다.

  스키마와 모델
    스키마
    {
      title: String,
      active: Boolean,          ->          모델          ->          데이터베이스(모델을 사용하여 데이터 읽고 쓰기)
      data: Date,
    }
```

### 스키마 생성
```javascript
  /*
  모델을 만들려면 사전에 스키마를 만들어 주어야 한다.
  우리는 블로그 포스트에 대한 스키마를 준비 한다.

    - 제목
    - 내용
    - 태그
    - 작성일

  포스트는 하나에는 이렇게 총 네 가지 정보가 필요함.
  각 정보에 대한 필드 이름과 데이터 타입을 설정하여 스키마를 만듬

  필드이름                    데이터타입                    설명
  title                       문자열                       제목
  body                        문자열                       내용
  tags                        문자열 배열                  태그목록
  publishedDate               날짜                         작성날짜

  이렇게 title, body, tags, publishedDate 총 네 가지 필드가 있는 스키마를 만듬
  */
  // src/model/post.js
  const mongoose = require('mongoose');

  const { Schema } = mongoose;

  const Post = new Schema({
    title: String,
    body: String,
    tags: [String],         // 문자열 배열
    publishDate: {
      type: Date,
      default: new Date()   // 현재 날짜를 기본 값으로 지정
    }
  });

  /*
    스키마를 만들 때는 mongoose 모듈의 Scheme를 사용하여 정의
    각 필드 이름과 필드의 데이터 타입 정보가 들어 있는 객체를 작성
    필드 기본 값은 default를 설정해 주면 됨

    Schema에서 기본적으로 지원하는 타입은 다음과 같다.
    타입                                        설명
    String                                      문자열
    Number                                      숫자
    Date                                        날짜
    Buffer                                      파일을 담을 수 있는 버퍼
    Boolean                                     true || false
    Mixed(Schema, Types, Mixed)                 어떤 데이터도 넣을 수 있는 형식
    ObjectId(Schema, Types, ObjectId)           객체 아이디 주로 다른 객체를 참조할 때 넣음
    Array                                       배열 형태의 값으로 []로 감싸서 사용
  */

  // 좀 더 복잡한 방식의 데이터도 저장 가능
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
  // 모델을 만들 때는 mongoose.model 함수를 사용
  
  // src/models/post.js
  module.exports = mongoose.model('Post', Post);

  /*
    모델 인스턴스를 만들고, module.exports로 내보냄
    여기에서 사용한 model() 함수는 기본적으로 파라미터가 두개 필요
    첫 번째 파라미터는 스키마 이름이고, 두 번째 파라미터는 스키마 객체
    데이터베이스는 스키마 이름을 정해 주면 이 이름의 복수 형태로 데이터베이스에 컬렉션을 만듬

    예를 들어 스키마 이름을 Post로 설정하면 실제 데이터베이스에 만드는 컬렉션 이름은 posts 입니다.
    BookInfo로 입력하면 bookinfos를 만듬

    MongoDb에서 컬렉션 이름을 만들 때 컨벤션은 구분자를 사용하지 않고, 복수 형태로 사용하는 것
    이 컨벤션을 따르고 싶지 않다면 다음 코드처럼 세 번째 파라미터에 여러분이 원하는 이름을 입력하면 됨

    mongoose.model('Post', Post, 'custom_book_collection');

    모델을 만들 때 첫 번째 파라미터로 쓰는 이름은 나중에 다른 스키마에서 현재 스키마를 참조해야 하는 상황에서 사용
  */
```
## MongoDB 클라이언트 설치
```
  스키마와 모델을 만들었다면 이번에는 이 모델을 사용하여 직접 데이터베이스에 데이터를 읽고 쓸 차례입니다.
  하지만 본격적으로 이 작업을 시작하기 전에 먼저 몇몇 준비 작업을 거치도록 함
```

### Robo 3T 설치
```
  MongoDB를 PC에 설치했다면 터미널에서 mongo 명령어를 입력하여 데이터베이스에 직접 접속해서 데이터를 조회하고 변경 가능 하지만
  mongo 명령어에 익숙하지 않은 상태라면 조금 불편할 수 도 있다.
  Robo 3T는 MongoDB를 편하게 조회하고 변경할 수 있는 GUI를 제공하므로 이를 사용하면 더욱 편하게 데이터베이스 관리 가능

  https://robomongo.org/download
```

## 데이터 생성과 조회
```
  앞서 임시로 REST API로 받은 데이터를 자바스크립트 배열안에 넣기
  이 데이터는 시스템 메모리 쪽에 위치하기 때문에 서버를 재시작하면 초기화 됨
  이번에는 데이터베이스를 연동해서 MongoDB 내부에 데이터를 등록
```

### NODE_PATH와 jsconfig.json
```javascript
  /*
  이전 리액트 프로젝트에서 NODE_PATH를 지정하여 상대 경로가 아닌 절대 경로로 파일을 불러옴

  api 컨트롤러에서 모델을 사용하려면 require('../../models/post') 형식으로 모델을 불러와야 하는데
  이 코드가 헷갈릴수 있으므로 백엔트 프로젝트에서도 NODE_PATH를 지정하여 require('model/post') 형식으로 불러올 수 있도록 설정
  */

  // package.json -scripts
  "scripts": {
    "start": "NODE_PATH=src node src",
    "start:dev": "NODE_PATH=src nodemon --watch src/ src/index.js"
  }
  // window cross-env
  yarn add --dev cross-env

  // jsconfig.json
  {
    "compilerOptions": {
      "baseUrl": "./src"
    }
  }

  // ESLint
  const path = require('path');

  module.exports = {
      "env": {
          "browser": true,
          "commonjs": true,
          "es6": true,
          "node": true
      },
      "extends": "eslint:recommended",
      "parserOptions": {
          "ecmaVersion": 2015,
          "sourceType": "module"
      },
      "settings": {
          "import/resolver": {
              node: { path: [path.resolve('./src')] }
          },
      },
      "rules": {
          "no-unused-vars": 1,
          "comma-dangle": 0,
          "eol-last": 0,
          "no-console": 0
      }
  };
```

### 데이터 생성
```javascript
  const Post = require('model/post');

  exports.write = (ctx) => {
    const { title, body, tags } = ctx.request.body;

    const post = new Post({
      title, body, tags
    });

    try {
      await post.save();
      ctx.body = post;
    } catch(e) {
      ctx.throw(e, 500);
    }
  };
  /*
    포스트의 인스턴스를 만들 때는 new 키워드를 사용
    생성자 함수의 파라미터에 정보를 지닌 객체를 넘김

    인스턴스를 만든다고 해서 바로 데이터베이스에 저장되는것은 아님
    .save() 함수를 실행시켜야 비로소 데이터베이스에 저장됨
    함수의 반환 값은 Promise여서 async/await 문법으로 데이터베이스 
    저장 요청을 완료할 때까지 await를 사용하야 대기 가능
    await를 사용하려면 함수를 선언하는 부분 앞에 async 키워드를 넣어야 하고,
    await를 사용할 때는 try-catch문으로 오류를 처리해야 함
  */
  exports.list = (ctx) => {

  };

  exports.read = (ctx) => {

  };

  exports.remove = (ctx) => {

  };

  exports.update = (ctx) => {

  };
```