# 01 자바스크립트 시작하기

## JavaScript vs ECMAScript

- ECMAScript 는 JavaScript 를 기반으로 표준화된 스크립트 언어

### 🪄 ECMAScript 알쓸신잡

- 사라진 버전, `ES4`, `ES3` (1999년)와 `ES5` (2009년) 사이에는 무려 10년의 공백이 있었다. 그 사이에 `ES4`라는 야심찬 버전이 계획되었지만, 너무 급진적인 변화와 복잡성, 그리고 위원회 내의 의견 불일치로 인해 결국 폐기되었다. `ES4`에서 논의되었던 일부 기능들은 나중에 `ES6/ES2015`에 포함되기도 했다.
- `typeof null`은 `object`: JavaScript 초기 버전부터 내려오는 유명한 버그 🐛 중 하나. `typeof null`을 실행하면 'object'라는 문자열이 반환된다. 이는 명백히 설계상의 오류지만, 이미 수많은 웹사이트들이 이 동작에 의존하고 있어서 하위 호환성을 위해 수정되지 않고 현재까지 그대로 유지되고 있다.
  ```javascript
  typeof null; // 'object'
  ```
- 추천 블로그: ECMA의 TC39 위원회 멤버로서 JavaScript 의 표준을 만드는 일에 참여하셨던 서광열 님의 [블로그](https://kwangyulseo.wordpress.com/2015/05/23/javascript-%eb%b0%94%eb%a1%9c-%ec%95%8c%ea%b8%b0/) 에서 여러 가지 재미있는 글들을 볼 수 있다.

## 간단한 스크립트부터 시작하기

### 인라인 스크립트

- HTML 태그 안에서 직접 작성하는 자바스크립트

```html
<button onclick="alert('알림 메시지가 표시됩니다.')">클릭!</button>
```

### 내장 스크립트

- HTML 파일 안에서 `<script>` 태그를 사용하여 작성

```html
<script>
  const button = document.querySelector("button");
  button.onclick = () => {
    alert("알림 메시지가 표시됩니다.");
  };
</script>
```

### 외부 스크립트

- 별도의 자바스크립트 파일을 만들어서 불러오는 방식

```html
<script src="script.js"></script>
```

## `use strict`

- 기본적으로 자바스크립트는 엄격하지 않은 모드, 즉 느슨한 모드 (`sloppy mode`)로 동작한다. 따라서, 옛날 방식으로 사용해도 되고 새로운 기능에 맞추어서 작성해도 문제가 없다.
- 느슨한 모드를 해제하고 최신 버전에 맞는 코드를 작성하려면 스크립트 소스의 맨 위에 `use strict` 키워드를 작성한다. 스크립트 소스를 엄격한 모드로 작성하면 이전에는 오류가 아니었던 소스를 깐깐하게 오류로 처리하고, 자바스크립트
  엔진을 최적화하는 데 문제가 있는 코드는 걸러낸다.
- 엄격한 모드로 사용할 때 어떤 것들을 오류로 처리하는 지에 대해서는 [여기](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) 에서 확인할 수 있다.
