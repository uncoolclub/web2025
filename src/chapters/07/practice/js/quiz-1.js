const username = document.querySelector("#username");
const major = document.querySelector("#major");
const button = document.querySelector("form > button");

button.addEventListener("click", (e) => {
  e.preventDefault();
  let tbody = document.querySelector("#attendant > tbody");
  let newTr = document.createElement("tr");

  let nameTd = document.createElement("td");
  nameTd.innerText = username.value;
  username.value = "";

  let majorTd = document.createElement("td");
  majorTd.innerText = major.value;
  major.value = "";

  newTr.appendChild(nameTd);
  newTr.appendChild(majorTd);
  tbody.appendChild(newTr);
});
