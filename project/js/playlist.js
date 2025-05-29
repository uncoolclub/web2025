import { MOOD } from "./constants.js";
import { SessionStorage } from "./common/session-storage.js";
import { PlaylistManager } from "./common/playlist-manager.js";

function getSelectedMoodKey() {
  return SessionStorage.get("userMoodSelection", {
    moodColor: "gibun-choego",
  }).moodColor;
}

function renderProfileSection(moodKey) {
  const moodData = MOOD[moodKey];
  const profileSection = document.querySelector(".profile-section");
  if (!profileSection || !moodData) return;

  const avatarImg = document.createElement("img");
  avatarImg.className = "profile-mood-avatar";
  avatarImg.src = moodData.avatar;
  avatarImg.alt = moodData.mood;
  profileSection.insertBefore(avatarImg, profileSection.firstChild);

  const nameDiv = document.querySelector(".profile-mood-name");
  const descDiv = document.querySelector(".profile-mood-desc");
  const profileId = document.querySelector(".profile-mood-id");

  if (nameDiv) nameDiv.textContent = moodData.mood;
  if (profileId) profileId.textContent = `@${moodKey}`;
  if (descDiv) {
    descDiv.innerHTML = `${moodData.label.replace(
      /\n/g,
      "<br>"
    )} <span class=\"profile-emoji\">${moodData.emoji}</span>`;
    descDiv.classList.add("mood-follow-block");
  }
}

function setupStickyHeader() {
  const profileWrapper = document.querySelector(".profile-section-wrapper");
  const albumsSection = document.querySelector(".recent-albums-section");

  if (!profileWrapper || !albumsSection) return;

  let ticking = false;

  function updateStickyState() {
    const scrollTop = albumsSection.scrollTop;

    if (scrollTop > 50) {
      profileWrapper.classList.add("sticky");
    } else {
      profileWrapper.classList.remove("sticky");
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateStickyState);
      ticking = true;
    }
  }

  albumsSection.addEventListener("scroll", requestTick, { passive: true });
}

function main() {
  const moodKey = getSelectedMoodKey();
  renderProfileSection(moodKey);

  const playlistManager = new PlaylistManager();
  playlistManager.initializePlaylists(moodKey);

  setupStickyHeader();
}

document.addEventListener("DOMContentLoaded", main);
