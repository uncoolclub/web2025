const START_DATE = "2025-01-01";
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const result = document.querySelector("#result");
const firstDay = new Date(START_DATE);
const today = new Date();

let passedTime = today.getTime() - firstDay.getTime();
let passedDay = Math.round(passedTime / MILLISECONDS_PER_DAY);

result.innerText = passedDay;
