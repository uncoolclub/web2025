const selectMenu = document.querySelector("#major");

function displaySelect() {
  let selectedText = selectMenu.options[selectMenu.selectedIndex].innerText;
  alert(`[${selectedText}]를 선택했습니다.`);
}

selectMenu.onchange = displaySelect;
