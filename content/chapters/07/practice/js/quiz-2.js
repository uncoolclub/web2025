const NOTICE_TIME = 3000;

const button = document.querySelector("#bttn");
const noticeBox = document.querySelector("#noti-box");

button.addEventListener("click", () => {
  const noticeDiv = document.createElement("div");
  noticeDiv.classList.add("noti");
  noticeDiv.innerText = "알림 내용이 표시됩니다.";
  noticeBox.appendChild(noticeDiv);

  setTimeout(() => {
    noticeDiv.remove();
  }, NOTICE_TIME);
});
