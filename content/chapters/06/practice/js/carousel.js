const container = document.querySelector("#container");
const images = [
  "pic-1.jpg",
  "pic-2.jpg",
  "pic-3.jpg",
  "pic-4.jpg",
  "pic-5.jpg",
];

container.style.backgroundImage = `url(../images/${images[0]})`;

const arrows = document.querySelectorAll(".arrow");
let index = 0;

arrows.forEach((arrow) => {
  arrow.addEventListener("click", (event) => {
    if (event.target.id === "left") {
      index = (index - 1 + images.length) % images.length;
    } else if (event.target.id === "right") {
      index = (index + 1) % images.length;
    }
    container.style.backgroundImage = `url(../images/${images[index]})`;
  });
});
