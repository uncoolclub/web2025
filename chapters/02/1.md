# 02 변수와 자료형 살펴보기

## 프로그램에서 입력받고 출력하는 방법

### `alert()` 함수

```javascript
alert(내용);
```

### `confirm()` 함수

```javascript
confirm(내용);
```

### `prompt()` 함수

```javascript
prompt(내용, 기본값);
```

### `console.log()` 함수

```javascript
console.log(내용);
console.log(변수);
```

## 변수

### 변수 선언

```javascript
let 변수명;
```

### 변수 할당

```javascript
변수명 = 값;
```

### 변수 선언과 할당

```javascript
let 변수명 = 값;
```

### 변수 재할당

```javascript
변수명 = 값;
```

## var 와 변수 호이스팅

- ECMA 2015 이전에는 변수를 선언할 때, `var` 예약어를 사용했다. 지금도 사용할 수 있지만, 변수에 이 예약어를 사용한 경우에는 '호이스팅 (hosting)' 이라는 개념을 조심해야 한다.

### 호이스팅

- 변수의 선언 부분을 스코프의 최상단으로 옮긴 것처럼 동작하는 것

```javascript
var x = 10;
var sum = x + y;
var y = 20;
console.log(sum);
```

- 위 코드는 아래와 같은 코드로 해석된다.

```javascript
var x = 10;
var y;
var sum = x + y;
y = 20;
console.log(sum);
```

## 변수 선언에 사용하는 각 예약어의 특징

| 예약어 | 선언하지 않고 사용할 경우 | 재선언 | 재할당 |
| ------ | ------------------------- | ------ | ------ |
| var    | 오류 없음 (호이스팅 발생) | 가능   | 가능   |
| let    | 오류 발생                 | 불가능 | 가능   |
| const  | 오류 발생                 | 불가능 | 불가능 |

## 자료형

### 자료형의 종류

- 원시 유형 (Primitive Type)
  - 숫자
  - 문자열
  - 불리언
  - null
  - undefined
  - Symbol
- 참조 유형 (Reference Type)
  - 객체
  - 배열
  - 함수
  - 날짜
  - 정규 표현식
