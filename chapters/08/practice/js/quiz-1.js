document.addEventListener("DOMContentLoaded", () => {
  const birthYearInput = document.querySelector("#year");
  const birthMonthInput = document.querySelector("#month");
  const birthDateInput = document.querySelector("#date");
  const calculateButton = document.querySelector("#bttn");

  const currentTimeDisplay = document.querySelector("#current");
  const resultDaysDisplay = document.querySelector("#days");
  const resultHoursDisplay = document.querySelector("#hours");

  const displayCurrentTime = () => {
    const now = new Date();
    currentTimeDisplay.innerText = `${now.getFullYear()}년 ${
      now.getMonth() + 1
    }월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분 현재`;
  };

  const clearInputFields = () => {
    birthYearInput.value = "";
    birthMonthInput.value = "";
    birthDateInput.value = "";
  };

  calculateButton.addEventListener("click", () => {
    const year = parseInt(birthYearInput.value);
    const month = parseInt(birthMonthInput.value) - 1;
    const day = parseInt(birthDateInput.value);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      resultDaysDisplay.innerText = "유효한 날짜를 입력하세요.";
      resultHoursDisplay.innerText = "";
      return;
    }

    const birthDate = new Date(year, month, day);
    const today = new Date();

    const timeDiff = today.getTime() - birthDate.getTime();

    if (timeDiff < 0) {
      resultDaysDisplay.innerText = "미래의 날짜는 계산할 수 없습니다.";
      resultHoursDisplay.innerText = "";
      return;
    }

    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursPassed = Math.floor(timeDiff / (1000 * 60 * 60));

    resultDaysDisplay.innerText = `태어난 날로부터 ${daysPassed} 일이 지났고, `;
    resultHoursDisplay.innerText = `시간으로는 ${hoursPassed} 시간이 흘렀습니다.`;

    clearInputFields();
  });

  displayCurrentTime();
});
