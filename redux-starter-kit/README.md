## redux-pender
```
  redux-pender Promise 기반 애션들을 관리하는 미들웨어가 포함된 라이브러리
  동작 결과
    - 액션 객체안에 payload가 Promise 형태라면 시작하기 전, 완료 또는 실패를 했을 때 뒤에 PENDING, SUCCESS, FAILURE 접미사를 붙임
  추가로 요청을 관리하는 리듀서가 포함되어 있고 요청 관리 액션들을 처리하는 액션 핸들러 함수들을 자동으로 만드는 도구도 제공
  요청중인 액션도 취소 가능
```
## 설치와 적용
```
  yarn add redux -pender
```