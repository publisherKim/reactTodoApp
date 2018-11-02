## redux-promise-middleware
```
  redux-promise-middleware는 Promise 기반의 비동기 작업을 좀더 편하게 해주는 미들웨어이다.
```

### 설치와 적용
```
  yarn add redux-promise-middleware
  이 미들웨어는 Promise 객체를 payload로 전달하면 요청을 시작 성공 실패할 때 액션의 뒷부분에 
  _PENDING, _FUFILLED, _REJECTED를 붙여서 반환
  이 세가지 값의 임으로 설정이 가능
```

### 액션 생성자 수정
```
  성공실패에 따라 SUCCESS || FAILURE 액션을 디스패치 하는 과정을 생략해도 됨
  문법이 매우 thunk에 비해 간단해 졌으나 매번 관리해주어야함 
  요소가 늘어날수록 작업이 반복적으로 증대됨 
  이에대한 대안으로 redux-pender가 나옴
```