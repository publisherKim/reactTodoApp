# redux-starter-kit

리덕스 스타터킷으로 사용되는 프로젝트입니다.
[Ducks 구조](https://velopert.com/3358) 가 적용된 카운터 코드가 안에 들어있습니다.

# 리덕스 미들웨어와 외부 데이터 연동
```
  1. 미들웨어 이해
  2. 비동기 작업을 처리하는 미들웨어 사용
  3. 정리
```
## 웹브라우 서버 사이의 할일
```
  웹 애플리케이션을 만들 때는 대부분 서버와 데이터를 연동해야 함.
  클라이언트 기능만으로는 제한 됨
  데이터 연동시 일반적으론 REST API에 Ajax를 요청하여 데이터를 가져오거나 입력해야 함
  서버의 API를 호출할 대는 총 세가지 상태를 관리해야 함
  
  웹브라우저 
    req
      로딩
    res
      성공, 실패
  서버

  요청시 서버가 응답할때까지 로딩 상태를 설정해야 하고 해당 요청이 성공했을 때와 실패했을 때 상태를 어떻게 업데이트 할지 결정한다.
  
  컴포넌트의 state만으로도 관리가 가능하지만 리덕스와 리덕스 미들웨어를 사용하여 상태 관리시 작업이 훨씬 간편해 짐

  1. 미들웨어 개념 이해하기
  2. 비동기 작업 처리하기
```

## 미들웨어의 이해

### 미들웨어란?
```
  리덕스 미들웨어는 액션을 디스패치했을때 리듀서에서 이를 처리하기 전에 사전에 지정된 작업들을 실행
  미들웨어는 액션과 리듀서사이의 중간자라고 볼수 있음
  즉 사용자가 액션을 날리고 req res를 받아와서 값을 변경하기 중간상태

  액션 - 미들웨어 - 리듀서 -> 스토어
```

### 미들웨어 생성
```
  git clone https://github.com/vlpt-playground/redux-starter-kit.git
  cd redux-starter-kit
  yarn
```
### 미들웨어 도식화
```
  stroe.dispatch
    
    미들웨어1         ->          next()        ->          미들웨어2
    
    유저엑션                                                리듀서

    1. 유저액션 발생
    2. store.dispatch
    3. 미들웨어1
    4. next호출
    5. 미들웨어2
    6. 리류서로 전달
```
### redux-logger 라이브러리 사용
```
  yarn add redux-logger
```

### 비동기 작업을 처리하는 미들웨어 사용
```
  현재 공개된 3가지
  1. redux-thunk
  2. redux-promise-middleware
  3. redux-pender
```

### redux-thunk 비동기 액션처리
```
  1. redux-thunk 사용하기
  2. thunk로 웹 요청 다루기
  3. redux-promise-middleware로 웹 요청 다루기
  4. redux-pender로 웹 요청 다루기
```

### redux-thunk란 ?
```javascript
  /*
  리덕스를 사용하는 어플리케이션에서 비동기 작업을 처리할때 가장 기본적인 방법은 redux-thunk 미들웨어를 이용
  매우 직관적이며 간단하게 비동기 작업을 관리 가능
  */

  //thunk란 특정 작업을 나중에 할수 있도록 미루려고 함수 형태로 감싼 것을 의미 
  const x = 1 + 2; // (즉시에 연산이 처리되어 할당됨)
  const foo = () => 1 + 2 // (함수 호출시 연산되어 값을 반환함)
```

### redux-thunk role
```javascript
  /*
  이 미들웨어는 객체가 아닌 함수도 디스패치 할수 있게 해준다.
  일반 액션 객체로는 특정 액션을 디스패치 한 후 몇 초 뒤에 실제로 반영시키거나 현재 상태에 따라 아예 무시하게 만들수 없다.
  redux-thunk 미들웨어는 함수를 디스패치 할 수 있게 함으로써 일반 액션 객체로는 할 수 없는 작업들도 할 수 있게 한다.
  1초뒤 액션이 디스패치 되는 예제코드
  */
  const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

  function increment() {
    return {
      type: INCREMENT_COUNTER
    }
  }

  // store.dispatch(incrementAsync())를 했을때 INCREMENT_COUNTER 액션을 1초 뒤에 디스패치한다.
  function incrementAsync() { // dispatch를 파라미터로 가지는 함수를 리턴
    return dispatch => {
      setTimeout(() => {
        dispatch(increment());
      }, 1000);
    }
  }

  // 조건에따라 액션을 디스패치하거나 무시하는 코드
  function incrementIfOdd() {
    return (dispatch, getState) => {
      // dispatch, getState를 파라미터로 전달하면 스토어상태에도 접근 가능
      const { counter } = getState();

      if (counter % 2 === 0) {
        return;
      }

      dispatch(increment());
    }
  }

  /*
    객체가 아니라 이렇게 함수를 반환하는 함수는 액션 생성 함수라 하지 않고 thunk 생성 함수라고 한다.
    thunk 생성 함수에서는 dispatch와 getState를 파라미터로 가지는 새로운 함수를 만들어서 반환해야 한다.
    thunk 생성 함수는 내부에서 여러가지 작업이 가능
    네크워크 요청도 가능
    또 다른 종류의 액션들을 여러번 디스패치 가능
  */
```

### 설치와 적용
```
  yarn add redux-thunk
```

### 웹 요청 처리
```
  redux-thunk를 이용한 비동기 작업 처리
  axios라는 promise 기반 HTTP 클라인언트 라이브러리를 사용하여 웹 요청 처리하기
```

### Promise란?
```javascript
  /*
  Promise는 ES6 문법에서 비동기 처리를 다루는데 사용하는 객체
  숫자를 1초뒤에 프린하는 코드 예제
  */
  function printLater(number) {
    setTimeout(function() {
      console.log(number)
    }, 1000);
  }

  printLater(1);

  // 숫자를 1 초간격으로 출력하는 예제
  function printLater(number, fn) {
    setTimeout(function() {
      console.log(number);
      if(fn) fn();
    }, 1000);
  }

  printLater(1, function(){
    printLater(2, function() {
      printLater(3, function() {
        printLater(4);
      });
    });
  });
  // 구조가 복잡해진다. 소위 콜백헬

  // 대안책 Promise 객체 반환 함수 정의
  function printLater(number) {
    return new Promise(
      resolve => {
        setTimeout(() => {
          console.log(number);
          resolve();
        }, 1000)
      }
    )
  }

  // 사용법
  printLater(1)
    .then(() => printLater(2))
    .then(() => printLater(3))
    .then(() => printLater(4));
  
  /*
    Promise에서 결과 값을 반환할 때는 resolve(결과 값)을 작성하고, 오류를 발생시킬 때는 reject(오류)를 작성한다.
    반환하는 결과 값과 오류는 .then || .catch 에 전달하는 함수의 파라미터로 설정된다.
  */
  function printLater(number) {
    return new Promise(
      (resolve, reject) => {
        if (number > 4) {
          return reject('reason: number is greater than 4');
        }
        setTimeout(() => {
          console.log(number);
          resolve(number + 1);
        }, 1000);
      }
    )
  }

  printLater(1)
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .then(num => printLater(num))
    .catch(e => console.log(e));
```