import { Pet } from "./quiz-1.js";

class Cat extends Pet {
  constructor(name, color, breed) {
    super(name, color);
    this.breed = breed;
  }

  viewInfo() {
    alert(`이름: ${this.name}, 색깔: ${this.color}, 품종: ${this.breed}`);
  }
}

const cat1 = new Cat("냥이", "흰색", "브리티쉬 숏헤어");
cat1.viewInfo();
