const email = document.querySelector("#userEmail");
const button = document.querySelector("button");
const result = document.querySelector("#result");

button.addEventListener("click", function () {
  if (email.value !== "" && email.value.includes("@")) {
    const [username, domain] = email.value.split("@");
    let masked = "";

    if (username.length <= 1) {
      masked = "*";
    } else if (username.length === 2) {
      masked = username[0] + "*";
    } else if (username.length === 3) {
      masked = username[0] + "**";
    } else {
      masked = username.slice(0, 3) + "*".repeat(username.length - 3);
    }

    result.innerText = `${masked}@${domain}`;
  } else {
    result.innerText = "올바른 이메일을 입력하세요.";
  }
});
