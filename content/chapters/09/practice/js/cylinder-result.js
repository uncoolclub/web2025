document.addEventListener("DOMContentLoaded", () => {
  class Cylinder {
    constructor(cylinderDiameter, cylinderHeight) {
      this.diameter = cylinderDiameter;
      this.height = cylinderHeight;
    }

    volume() {
      let radius = this.diameter / 2;
      return (Math.PI * radius * radius * this.height).toFixed(2);
    }
  }

  const diameterInput = document.querySelector("#cyl-diameter");
  const heightInput = document.querySelector("#cyl-height");
  const button = document.querySelector("button");
  const resultDisplay = document.querySelector("#result");

  button.addEventListener("click", function (event) {
    event.preventDefault();

    const diameterValue = diameterInput.value;
    const heightValue = heightInput.value;

    if (diameterValue === "" || heightValue === "") {
      resultDisplay.innerText = `지름값과 높이값을 모두 입력하세요.`;
      return;
    }

    const diameter = parseFloat(diameterValue);
    const height = parseFloat(heightValue);

    if (isNaN(diameter) || isNaN(height)) {
      resultDisplay.innerText = `지름과 높이는 숫자여야 합니다.`;
      return;
    }

    if (diameter <= 0 || height <= 0) {
      resultDisplay.innerText = `지름과 높이는 0보다 커야 합니다.`;
      return;
    }

    const cylinder = new Cylinder(diameter, height);
    resultDisplay.innerText = `원기둥의 부피는 ${cylinder.volume()}입니다.`;
  });
});
