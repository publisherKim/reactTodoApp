# 리덕스 개념 이해
```
  정의: 리덕스는 상태관리 라이브러이다.
  목적: 상태 관리를 쉽게하기 위해서이다.
  사례: 컴포넌트가 복잡할수록 리액트의 단 방향성 특징 떄문에 props로 내려줘야할 것들이 늘고 최적화도 어려워지기 때문에 store를 통해서 바끼어야할 컴포넌트와 다이텍트로 연결하여 사용한다.
  결론: 복잡도를 처리하고 상태관리(데이터)를 한곳에서 처리한다. component의 코드를 상당량 줄일수 있다.
  ps: 단방향을 쓰는 목적에대해서 생각해 보아야 한다.
```

## 소개
```
  리덕스는 쉽게 설명하면 상태 관리의 로직을 컴포넌트 밖에서 처리하는 것이다.
  스토어라는 내부 객체에 상태를 담고 컴포넌트와 다이렉트로 상태관리 및 통신이 가능하다.

  스토어: 애플리케이션의 상태값들을 내장
  액션: 상태 변화를 일으킬때 참조하는 객체
  디스패치: 액션을 스토어에 전달하는 것을 의미
  리듀서: 상태를 변화시키는 로직이 있는 함수
  구독: 스토어 값이 필요한 컴포넌트는 스토어를 구독
```

## 리덕스 사용
```
  리액트와 리덕스는 분리된 개념이다.
  즉 리액트를 쓰지 않아도 리덕스 라이브러리만 따로 사용이 가능하다.
  1. 액션과 액션 생성 함수: 액션은 스토어에서 상태 변화를 일으킬 대 참조하는 객체 tpye이 필수이다.
```

### 액션과 액션 생함수 사용예
```javascript
  const INCREMENT = 'INCREMENT';
  const DECREMENT = 'DECREMENT';

  const incerement = (diff) => ({
    type: INCREMENT,
    diff: diff
  });

  const decrement = (dife) => ({
    type: DECREMENT,
    diff
  })
```

### 변화를 일으키는 함수, 리듀서
```javascript
  // 1. 초기값 필요
  const initialState = {
    number: 0
  };

  // 상태값이 하나일 경우
  function counter(state=initialState, action) {
    switch(action.type) {
      case INCREMENT:
        return { number: state.number + action.diff }
      case DECREMENT:
        return { number: stgate.number + action.diff }
      default: 
        return state;
    }
  }

  // 상태값이 복수일 경우
  const initialState = {
    number: 1,
    foo: 'bar',
    baz: 'qux'
  };

  function counter(state = initalState, action) {
    switch(action.type) {
      case INCREMENT:
        return Object.assign({}, state, {
          number: state.number + action.diff
        });
      case DECREMENT:
        return Object.assign({}, state, {
          number: state.number - action.diff
        });
      default: 
        return state;
    }
  }

  // 상태값 복수일때 전개 연산자 활용
  function counter(state = initialState, action) {
    switch(action.type) {
      case INCREMENT:
        return {
          ...state,
          number: state.number + action.diff
        };
      case DECREMENT:
        return {
          ...state,
          number: state.number + action.diff
        };
      default:
        return state;
    }
  }
```

### 리덕스 스토어 생성
```javascript
  const { createStore } = Redux;
  const store = createStore(counter);
  /*
    1. store를 생성할때는 createStore 함수를 사용 
    2. 파라미터로는 리듀서 함수를 전달
    3. 두 번째 파라미터 설정시: 스토어의 기본값으로 사용가능, 생략시 리듀서 초깃값을 스토어 기본값으로 사용
  */
```

### 구독
```javascript
  /*
    지금은 직접 구현하지만 react-redux connect함수를 쓰면 편하다.
  */
  const unsubscribe = store.subscribe(() => {
    console.log(store.getState());
  });
  /*
    1. 스토어를 구독할때는 subscribe함수를 사용
    2. 함수형태의 파라미터를 받음
    3. 파라미터로 전달된 함수는 스토어 상태에 변화가 일어날 때마다 호출
    4. subscribe 함수가 호출되면 반환 값으로 구독을 취소하는 unscribe 함수를 반환
    5. 구독을 취소하고 싶을때는 unscribe()를 입력하여 호출 하면 됨
  */
```

### dispatch로 액션 전달
```javascript
  store.dispatch(increment(1));
  store.dispatch(decrement(5));
  store.dispatch(increment(10));
```