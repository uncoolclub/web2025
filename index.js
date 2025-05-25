document.addEventListener("DOMContentLoaded", function () {
  const expandableHeaders = document.querySelectorAll(".expandable-header");

  expandableHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const content = this.nextElementSibling;
      const icon = this.querySelector(".expandable-icon");

      expandableHeaders.forEach((otherHeader) => {
        if (otherHeader !== this) {
          const otherContent = otherHeader.nextElementSibling;
          const otherIcon = otherHeader.querySelector(".expandable-icon");
          otherContent.classList.remove("active");
          otherIcon.style.transform = "rotate(0deg)";
        }
      });

      content.classList.toggle("active");

      if (content.classList.contains("active")) {
        icon.style.transform = "rotate(45deg)";
      } else {
        icon.style.transform = "rotate(0deg)";
      }
    });
  });
});

const typingTitle = document.getElementById("typing-title");
const text = "WEB\nPROGRAMMING\n2025";
let index = 0;

function type() {
  if (index < text.length) {
    typingTitle.innerHTML +=
      text.charAt(index) === "\n" ? "<br>" : text.charAt(index);
    index++;
    setTimeout(type, 150);
  }
}

window.onload = function () {
  type();
};
