const viewButton = document.querySelector("#view");

viewButton.onclick = () => {
  const detail = document.querySelector("#detail");
  detail.classList.toggle("hidden");
};
