## Immutable.js 익히기
```
  이뮤터블 js를 활용할 경우 객체 복사 참조 변경에 대한 걱정없이 값의 변경을 편리하게 사용해주는 라이브러리이다.
    - Immutable.js를 이용한 상태 업데이트
    - Ducks 파일 구조
    - redux-actions를 이용하여 더욱 쉽게 액션 생선 함수 만들기
  가장 먼저 Immutable.js를 익히자
```

### 객체 불변성
```javascript
  let a = 7;
  let b = 7;

  let object1 = { a: 1, b: 2 };
  let object2 = { a: 1, b: 2 };

  object1 === object2 // false

  let object3 = object1
  object1 === object3 // true 메모리의 주소지가 같은경우 자바스크립트는 식별이 불가능하다.

  object3.c = 3;

  object1 === object3 // true
  object1 // { a: 1, b: 2, c: 3 }

  let array1 = [0, 1, 2, 3, 4];
  let array2 = array1;
  array2.push(5);

  array1 === array2 // true
  
  /*
    즉 리액트 컴포넌트에서 값을 직접 변경할 경우 레퍼런스가 같기 때문에 자바스크립트 엔진의 특성상 똑같은 값으로 인식한다.
    그러므로 전개 연산자를 사용해서 기존 값을 가진 새 객체 또는 배열을 만들었던 것이다.

    이경우 객체의 계층이 깊어지면 상당히 코드가 복잡해 진다. 
    이걸 간소화하기 위한 라이브러리가 Immutable.js이다.
  */
  // old
  let object1 = {
    a: 1,
    b: 2,
    c: 3,
    d: {
      e: 4,
      f: {
        g: 5,
        h: 6
      }
    }
  }
  // h값을 10으로 업데이트 할경우
  let object2 = {
    ...object,
    d: {
      ...object.d,
      f: {
        ...object.d.f,
        h: 10
      }
    }
  }

  // Immutable.js를 활용할 경우
  let object1 = Map({
    a: 1,
    b: 2,
    c: 3,
    d: Map({
      e: 4,
      f: Map({
        g: 5,
        h: 6
      })
    })
  });

  let object2 = object1.setIn(['d', 'f', 'h'], 10);

  object1 === object2;  // false
  // 간략하고 편리하게 해준다.
```