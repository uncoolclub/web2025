import { MUSIC_GENRES, getAvailableGenres } from "./genres.js";

const genreIcons = {
  kpop: "🎤",
  khiphop: "🎧",
  kballad: "🎵",
  krnb: "🎹",
  indie: "🎸",
  trot: "🎺",
  default: "🎵",
};

const genreDescriptions = {
  kpop: "트렌디한 케이팝 음악",
  khiphop: "힙합의 강력한 비트",
  kballad: "감성적인 발라드",
  krnb: "감각적인 알앤비",
  indie: "독창적인 인디 음악",
  trot: "신나는 트로트",
  default: "새로운 음악을 발견해 보세요",
};

let currentPlayer = null;

async function initializeApp() {
  await loadAndRenderGenres();
  setupPlayerContainer();
}

async function loadAndRenderGenres() {
  try {
    const genres = getAvailableGenres();
    renderGenres(genres.map((genre) => genre.id));
  } catch (error) {
    console.error("장르 로드 실패:", error);
    renderGenres(["kpop", "khiphop", "kballad"]);
  }
}

function setupPlayerContainer() {
  const container = document.createElement("div");
  container.id = "player-container";
  container.style.display = "none";
  document.querySelector(".genre-section").appendChild(container);
}

function renderGenres(genres) {
  const genreGrid = document.querySelector(".genre-grid");
  const template = document.getElementById("genre-template");
  genreGrid.innerHTML = "";

  genres.forEach((genre) => {
    const clone = template.content.cloneNode(true);
    const genreItem = clone.querySelector(".genre-item");
    const icon = clone.querySelector(".genre-icon");
    const title = clone.querySelector("h4");
    const description = clone.querySelector("p");

    genreItem.dataset.genre = genre;
    icon.textContent = genreIcons[genre] || genreIcons.default;
    title.textContent =
      (MUSIC_GENRES[genre]?.name || genre).charAt(0).toUpperCase() +
      (MUSIC_GENRES[genre]?.name || genre).slice(1);
    description.textContent =
      genreDescriptions[genre] || genreDescriptions.default;

    genreItem.addEventListener("click", () => {
      window.location.href = `./pages/tracks.html?genre=${encodeURIComponent(
        genre
      )}`;
    });
    genreGrid.appendChild(clone);
  });
}

window.addEventListener("scroll", () => {
  const scrollRatio = window.scrollY / window.innerHeight;
  const titleLines = document.querySelectorAll(".title-line");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  titleLines.forEach((line, index) => {
    const offset = scrollRatio * (30 * (index + 1));
    line.style.transform = `translateY(${offset}px)`;
    line.style.opacity = 1 - scrollRatio * 0.5;
  });

  if (scrollRatio > 0.1) {
    scrollIndicator.style.opacity = 1 - (scrollRatio - 0.1) * 5;
  }
});

document.addEventListener("DOMContentLoaded", initializeApp);

const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
  window.addEventListener("scroll", () => {
    const scrollRatio = window.scrollY / window.innerHeight;
    if (scrollRatio > 0.1) {
      scrollIndicator.style.opacity = 1 - (scrollRatio - 0.1) * 5;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const titleLines = document.querySelectorAll(".title-line");

  titleLines.forEach((line, index) => {
    line.style.opacity = "0";
    line.style.transform = "translateY(20px)";

    setTimeout(() => {
      line.style.transition = "all 0.6s ease";
      line.style.opacity = "1";
      line.style.transform = "translateY(0)";
    }, index * 200);
  });
});
