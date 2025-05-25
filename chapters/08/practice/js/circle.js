function area(r) {
  return Math.PI * r * r;
}

function circum(r) {
  return 2 * Math.PI * r;
}

const result = document.querySelector("#result");
const radius = prompt("반지름의 크기는? ");

result.innerText = `
    반지름 : ${radius},
    원의 넓이 : ${area(radius).toFixed(3)},
    원의 둘레 : ${circum(radius).toFixed(3)}
  `;
