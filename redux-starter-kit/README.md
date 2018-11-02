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