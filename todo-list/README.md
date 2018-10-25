# crud
```
  create 쓰다(생성)
  read  읽다(불러오다)
  update 수정(최신화, 동기화)
  delete 삭제(지우다)
```
## create
```
  0. 추가된 데이터를 list에 렌더링하기
  1. handleInsert 메서드 정의
  2. 새로운 데이터 객체를 만들어 todos데이터 값 전달하기
  3. id 값은 새로 추가 될때마다 1씩 더해주기
```

## update
```
  0. 체크박스를 클릭한 데이터 업데이트하기
  1. 원하는 데이터를 아이디로 찾기
  2. slice와 전개연산자를 사용해서 새배열 업데이트하기
  3. handleToggle method 정의해서 TodoList에 onToggle props로 전달하기
```