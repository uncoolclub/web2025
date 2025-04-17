const image = document.querySelector("#container > img");

image.addEventListener("mouseover", () => {
  image.src = "../images/pic-6.jpg";
});

image.addEventListener("mouseout", () => {
  image.src = "../images/pic-1.jpg";
});
