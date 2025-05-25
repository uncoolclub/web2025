# 04 함수와 스코프

## 함수

- 동작해야 할 목적대로 여러 개의 명령을 묶는 것

### 매개변수와 인수

- `매개변수`는 <span style="text-decoration:underline">함수에 전달되는 값을 저장하는 변수</span>
- `인수`는 <span style="text-decoration:underline">함수를 호출할 때 전달되는 값</span>

```js
function add(a, b) {
  // a, b는 매개변수
  return a + b;
}

add(1, 2); // 1, 2는 인수
```

> 매개변수와 인수를 통틀어 `인자`라고 부른다.

### `return` 문

- `return` 문은 함수의 실행을 중단하고, 함수의 결과 값을 반환한다.

```js
function add(a, b) {
  return a + b; // 함수의 결과 값을 반환
}

add(1, 2); // 3
```

### 기본 매개변수

- 기본 매개변수는 함수를 호출할 때, 매개변수를 전달하지 않았을 때 사용되는 값

```js
function add(a = 1, b = 2) {
  // 기본 매개변수 지정
  return a + b;
}

add(); // 3
add(1); // 3
add(1, 2); // 3
```

### 나머지 매개변수

- 나머지 매개변수는 함수에 전달된 인자들의 목록을 배열로 저장하는 매개변수

```js
function add(...args) {
  // args는 배열
  return args.reduce((acc, cur) => acc + cur, 0);
}

add(1, 2, 3, 4, 5); // 15
```

## 스코프

- 스코프는 변수의 유효 범위를 의미
- 스코프는 변수가 선언된 위치에 따라 결정된다.

```js
var a = 1; // 전역 변수

function add(a, b) {
  var a = 2; // 지역 변수
  return a + b;
}
```

### 블록 스코프

- 블록 스코프는 블록 내에서 선언된 변수의 유효 범위를 의미

### 함수 스코프

- 함수 스코프는 함수 내에서 선언된 변수의 유효 범위를 의미

## 함수

### 익명 함수

- 익명 함수는 이름이 없는 함수

```js
var add = function (a, b) {
  return a + b;
};

add(1, 2); // 3
```

### 즉시 실행 함수 (IIFE)

- 즉시 실행 함수는 함수를 선언하고 바로 실행하는 함수

```js
(function (a, b) {
  return a + b;
})(1, 2); // 3
```

### 화살표 함수

- 화살표 함수는 익명 함수를 축약하여 표현한 함수

```js
var add = (a, b) => a + b;

add(1, 2); // 3
```

### 콜백 함수

- 콜백 함수는 함수의 인자로 전달되는 함수

```js
function add(a, b, callback) {
  return callback(a + b);
}

add(1, 2, function (result) {
  console.log(result); // 3
});
```

## 타이머 함수

### 일정 시간마다 반복하기 - `setInterval`

- `setInterval`은 일정 시간마다 함수를 반복해서 실행하는 함수

```js
setInterval(function () {
  console.log("Hello");
}, 1000); // 1초마다 "Hello" 출력
```

### 반복 실행 멈추기 - `clearInterval`

- `clearInterval`은 `setInterval`을 중지하는 함수

```js
var interval = setInterval(function () {
  console.log("Hello");
}, 1000);

clearInterval(interval); // 1초마다 실행되는 "Hello" 출력 중지
```

### 일정 시간 후에 실행하기 - `setTimeout`

- `setTimeout`은 일정 시간 후에 함수를 실행하는 함수

```js
setTimeout(function () {
  console.log("Hello");
}, 1000); // 1초 후에 "Hello" 출력
```

### 실행 취소하기 - `clearTimeout`

- `clearTimeout`은 `setTimeout`을 취소하는 함수

```js
var timeout = setTimeout(function () {
  console.log("Hello");
}, 1000);

clearTimeout(timeout); // 1초 후에 실행되는 "Hello" 출력 취소
```
