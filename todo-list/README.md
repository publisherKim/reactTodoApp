# Ducks 파일 구조
```
  리덕스 파일구조는 일반적으로 
    - 액션 타입
    - 액션 생성 함수
    - 리듀서 
  등으로 분리하여 관리 하지만 파일들을 어떻게 구조화 할지 정해진 방식은 없음

  덕스구조 배경: 여러 파일들을 쪼개서 관리하기가 귀찮음

  덕스구조 정의: '액션 타입,액션 생성 함수 리듀서'를 모두 한 파일에 모듈화 하여 관리
  출처: https://github.com/erikas/ducks-modulars-redux
```

## 예시
```javascript
  // 액션 타입
  const CREATE = 'my-app/todos/CREATE';
  const REMOVE = 'my-app/todos/REMOVE';
  const TOGGLE = 'my-app/todos/TOGGLE';

  // 액션 생성 함수
  export const create = (todo) => ({
    type: CREATE,
    todo
  });

  export const remove = (id) => ({
    type: REMOVE,
    id
  });

  export const toggle = (id) => ({
    type: TOGGLE,
    id
  });

  const initialState = {
    // 초기 상태...
  }

  // 리듀서
  export default function reducer( state = initialState, action) {
    switch (action.type) {
      // 리듀서 관련 코드...
    }
  }
  // duck structure: 액션 타입, 액션 생성 함수, 리듀서를 한꺼번에 관리하는 모듈 패턴
```
## 규칙
```
  - export default를 이용하여 리듀서를 내보내기
  - export를 이용하여 액션 생성 함수를 내보내기
  - 액션 타입이름은 npm-module-or-app/reducer/ACTION_TYPE 형식 권장 ex: counter/INCREMENT
  - 외부 리듀서에서 모듈의 액션 타입이 필요할 떄는 액션 타입을 내보내도 됨(타입은 공유해도 된다.)
```