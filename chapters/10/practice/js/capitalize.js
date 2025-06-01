const string = prompt("영문 소문자로 된 문자열을 입력하세요.");

const result = `${string[0].toUpperCase()}${string.slice(1)}`;
document.write(result);
