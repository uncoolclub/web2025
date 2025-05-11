# 6장 이벤트와 이벤트 처리기

## 이벤트 기초

이벤트는 웹 페이지에서 일어나는 사용자 동작이나 시스템 변화를 감지하고 이에 반응할 수 있게 해주는 핵심 개념입니다.

### 주요 이벤트 종류

- **마우스 이벤트**: `click`, `dblclick`, `mousedown`, `mouseup`, `mousemove`, `mouseover`, `mouseout`
- **키보드 이벤트**: `keydown`, `keyup`, `keypress`
- **폼 이벤트**: `submit`, `reset`, `change`, `focus`, `blur`
- **문서/윈도우 이벤트**: `load`, `unload`, `resize`, `scroll`

## 이벤트 핸들러 등록 방법

이벤트 핸들러를 등록하는 방법에는 여러 가지가 있습니다:

### 1. HTML 속성으로 등록

```html
<button onclick="alert('버튼이 클릭되었습니다!')">클릭하세요</button>
```

### 2. DOM 요소의 속성으로 등록

```javascript
const button = document.querySelector("button");
button.onclick = function () {
  alert("버튼이 클릭되었습니다!");
};
```

### 3. addEventListener() 메서드 사용

```javascript
const button = document.querySelector("button");
button.addEventListener("click", function () {
  alert("버튼이 클릭되었습니다!");
});
```

## 이벤트 객체

이벤트가 발생하면 브라우저는 이벤트 객체를 생성합니다. 이 객체에는 이벤트에 대한 다양한 정보가 포함되어 있습니다.

```javascript
button.addEventListener("click", function (event) {
  console.log("이벤트 타입:", event.type);
  console.log("이벤트 대상:", event.target);
  console.log("마우스 위치:", event.clientX, event.clientY);
});
```

## 이벤트 전파

이벤트는 DOM 트리를 타고 전파됩니다. 이벤트 전파에는 세 단계가 있습니다:

1. **캡처링 단계**: 이벤트가 루트 요소에서 대상 요소로 내려가는 단계
2. **타겟 단계**: 이벤트가 대상 요소에 도달한 단계
3. **버블링 단계**: 이벤트가 대상 요소에서 루트 요소로 올라가는 단계

이벤트 전파를 제어하는 메서드:

- `event.stopPropagation()`: 이벤트 전파 중단
- `event.preventDefault()`: 브라우저의 기본 동작 방지

## 실습 예제

이 챕터에서는 다양한 이벤트 처리 예제를 통해 실습합니다:

- 폼 데이터 처리
- 모달 창 구현
- 이미지 캐러셀
- 키보드 이벤트 핸들링
- 퀴즈 인터페이스 구현
