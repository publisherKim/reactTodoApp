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
  export default function reducer(state = initialState, action) {
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

## reducks를 편리하게 쓰기위한 모듈 추가
```
  yarn add redux-actions
```
### createAction을 이용한 생성 자동화
```javascript
  export const increment = (index) => ({
    type: types.INCREMENT,
    index
  });

  export const decrement = (index) => ({
    type: types.DECREMENT,
    index
  });

  // createAction을 통한 간소화
  export const increment = createAction(types.INCREMENT);
  export const decrement = createAction(types.DECREMENT);
  // 사용 방법과 결과
  increment(3);
  {
    type: 'INCREMENT',
    payload: 3
  }
  
  // parameter가 복수일때
  export const setColor = createAction(types.SET_COLOR);
  setColor({index: 5, color: '#fff'});
  {
    type: 'SET_COLOR',
    payload: {
      index: 5,
      color: '#fff'
    }
  }
  // 명시화 하는 방법
  export const setColor = createAction(types.SET_COLOR, ({index, color}) => ({index, color});

  // 리듀서에 switch 문 대신 handleActions 사용
  const reducer = handleActions({
    INCREMENT: (state, action) => ({
      counter: state.counter + action.payload
    }),
    DECREMENT: (state, action) => ({
      counter: state.counter - action.payload
    })
  }, {counter: 0});
```
## ducks 구조 리팩토링 하기
```
  리덕스 관련 모듈 설치하기(yarn add redux react-redux redux-actions immutable)
  모듈 만들기
  스토어 만들기
  컨테이너 컴포넌트 만들기
```

## ducks 구조 모듈 작성 순서
```
  1. 액션 타입 정의하기
  2. 액션 생성 함수 만들기
  3. 초기 상태 정의하기
  4. 리듀서 정의하기
```