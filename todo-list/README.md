# 리액트 리렌더링 최적화
```
  리액트 컴포넌트 리렌더링 최적화 하기
  1. 소규모 앱 (데이터의 변화 작은경우) 불필요
  2. 가상돔의 렌더링 체크하는것 조차 줄일 필요가 있다.(엔진의 연산 보호)
  3. 필수 라이프싸이클 shouldComponentUpdate (조건에따라 render()를 중지 가능)
  4. chrome: react 개발자도구를 활용한다.(performence tab을 활용해도 좋다.)
```

## test data ready
```
  1. 가상의 데이터를 만들어 채운다.
```

## Todolist 컴포넌트의 todos props가 변경될때만 리렌더링 되게 적용한다.
```javascript
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.todos !== nextProps.todos;
  }
  // 조건에따라 컴포넌트를 업데이트할지 말지 결정할 라이프 싸이클을 활용한다.
```
## TodoItem 컴포넌트의 최적화
```javascript
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.done !== nextProps.done;
  }
```