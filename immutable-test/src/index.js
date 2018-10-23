let a = 7;
let b = 7;

let object1 = { a: 1, b: 2};
let object2 = { a: 1, b: 2};

const isBoolean = (arg1, arg2) => arg1 === arg2;


// primative value vs reference value 
const primativeValue = isBoolean(a, b);
const referenceDiff = isBoolean(object1, object2);
console.log(primativeValue, referenceDiff);

let object3 = object1;
const referenceSame = isBoolean(object1, object3);
console.log(referenceSame);

object3.c = 3;
const isSameTo = isBoolean(object1, object3);
console.log(isSameTo);

let array1 = [0, 1, 2, 3, 4];
let array2 = array1;
array2.push(5);

console.log(isBoolean(array1, array2));