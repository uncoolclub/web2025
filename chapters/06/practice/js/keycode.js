const body = document.body;
const result = document.querySelector("#result");

body.addEventListener("keydown", (event) => {
  result.innerText = `Code: ${event.code}\nKey: ${event.key}`;
});
