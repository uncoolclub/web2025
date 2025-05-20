const today = new Date();

const displayDate = document.querySelector("#today");

const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const days = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];
const dayName = days[today.getDay()];

displayDate.innerHTML = `${year}년 ${month}월 ${date}일 <span style="font-weight:bold">${dayName}</span>`;

const displayTime = document.querySelector("#clock");

const clock = () => {
  const current = new Date();
  let hrs = current.getHours();
  const mins = String(current.getMinutes()).padStart(2, "0");
  const secs = String(current.getSeconds()).padStart(2, "0");

  const period = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 || 12;
  const displayHrs = String(hrs).padStart(2, "0");

  displayTime.innerText = `${period}  ${displayHrs} : ${mins} : ${secs} `;
};

setInterval(clock, 1000);
