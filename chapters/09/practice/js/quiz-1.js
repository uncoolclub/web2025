export class Pet {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }

  run() {
    alert(`${this.name}은 ${this.color}이고, 달리고 있습니다.`);
  }
}

const pet1 = new Pet("멍멍이", "갈색");
pet1.run();
