const result = document.querySelector("#result");
const button = document.querySelector("button");

const luckyNumber = {
  digitCount: 6,
  maxNumber: 45,
};

button.addEventListener("click", () => {
  let { digitCount, maxNumber } = luckyNumber;
  let myNumber = new Set();

  for (let i = 0; i < digitCount; i++) {
    myNumber.add(Math.floor(Math.random() * maxNumber) + 1);
  }

  result.innerText = `${[...myNumber]}`;
});
