const body = document.body;
const result = document.querySelector("#result");

body.addEventListener("mouseover", (event) => {
  body.style.backgroundColor = "red";
});

body.addEventListener("mouseout", (event) => {
  body.style.backgroundColor = "white";
});
