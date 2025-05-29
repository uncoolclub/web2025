import { MOOD } from "./constants.js";
import { SessionStorage } from "./common/session-storage.js";

let selectedMoodColor = "gibun-choego";

const nextButton = document.getElementById("next-button");

function initializePage() {
  setupMoodColorSelection();
  setupNextButtonNavigation();
  updateMainAvatarDisplay();
}

function setupMoodColorSelection() {
  const moodGrid = document.querySelector(".mood-color-grid");

  if (!moodGrid) {
    return;
  }

  Object.entries(MOOD).forEach(([moodKey, moodData]) => {
    const button = document.createElement("button");
    button.className = "mood-color-button";
    button.dataset.mood = moodKey;
    button.setAttribute("aria-label", moodData.mood);
    button.style.backgroundColor = "#f0f0f0";
    const emojiSpan = document.createElement("span");
    emojiSpan.className = "mood-emoji";
    emojiSpan.innerText = moodData.emoji;
    button.appendChild(emojiSpan);

    if (moodKey === selectedMoodColor) {
      button.classList.add("selected");
    }

    moodGrid.appendChild(button);
  });

  const moodColorButtons = document.querySelectorAll(".mood-color-button");

  moodColorButtons.forEach((button) => {
    button.addEventListener("click", handleMoodColorSelection);
  });
}

function handleMoodColorSelection(event) {
  const clickedButton = event.currentTarget;
  const newMoodColor = clickedButton.dataset.mood;

  document.querySelectorAll(".mood-color-button").forEach((btn) => {
    btn.classList.remove("selected");
  });

  clickedButton.classList.add("selected");
  selectedMoodColor = newMoodColor;

  updateMainAvatarDisplay();
  addButtonClickFeedback(clickedButton);
}

function updateMainAvatarDisplay() {
  const moodData = MOOD[selectedMoodColor];
  if (!moodData) return;

  const mainAvatarImage = document.getElementById("main-avatar-image");
  if (!mainAvatarImage) return;

  mainAvatarImage.classList.remove("pop");
  void mainAvatarImage.offsetWidth;
  mainAvatarImage.classList.add("pop");

  const avatarImagePath = moodData.avatar;
  mainAvatarImage.style.opacity = "0.5";
  mainAvatarImage.src = avatarImagePath;
  mainAvatarImage.onload = function () {
    mainAvatarImage.style.opacity = "1";
  };
  mainAvatarImage.onerror = function () {
    mainAvatarImage.src = MOOD[selectedMoodColor].avatar;
    mainAvatarImage.style.opacity = "1";
    console.error("Failed to load avatar image: ", avatarImagePath);
  };

  const moodTitle = document.querySelector(".avatar-mood-title");
  const moodLabel = document.querySelector(".avatar-mood-label");
  if (moodTitle) moodTitle.textContent = moodData.mood;
  if (moodLabel) moodLabel.innerHTML = moodData.label.replace(/\n/g, "<br>");
}

function addButtonClickFeedback(button) {
  button.style.transform = "scale(0.95)";

  setTimeout(() => {
    button.style.transform = "";
  }, 150);
}

function setupNextButtonNavigation() {
  nextButton.addEventListener("click", handleNextButtonClick);
}

function handleNextButtonClick() {
  const userSelections = {
    moodColor: selectedMoodColor,
    timestamp: Date.now(),
  };

  SessionStorage.set("userMoodSelection", userSelections);
  nextButton.style.transform = "scale(0.98)";

  setTimeout(() => {
    window.location.href = "../html/playlist.html";
  }, 200);
}

function getCurrentSelections() {
  return {
    moodColor: selectedMoodColor,
  };
}

document.addEventListener("DOMContentLoaded", initializePage);

window.MoodSelectionPage = {
  getCurrentSelections,
  updateMainAvatarDisplay,
  selectedMoodColor: () => selectedMoodColor,
};
