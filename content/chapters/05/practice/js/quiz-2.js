const number1 = document.querySelector("#number1");
const number2 = document.querySelector("#number2");
const calcButton = document.querySelector("#calc");
const result = document.querySelector("#result");

calcButton.onclick = () => {
  const num1 = parseInt(number1.value);
  const num2 = parseInt(number2.value);
  const _gcd = gcd(num1, num2);

  result.innerText = _gcd;
};

const gcd = (a, b) => {
  if (b === 0) return a;
  return gcd(b, a % b);
};
