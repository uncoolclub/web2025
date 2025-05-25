const number = parseInt(prompt("숫자를 입력하세요."));

if (isNaN(number)) {
  alert("숫자를 입력하세요.");
} else if (number === 0) {
  alert("0입니다.");
} else {
  if (number > 0) {
    alert(`${number}은 양수입니다.`);
  } else {
    alert(`${number}은 음수입니다.`);
  }
}
