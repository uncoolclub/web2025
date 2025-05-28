import { MOOD } from "./constants.js";
import { SessionStorage } from "./common/session-storage.js";
import SpotifyAPI from "./common/spotify-api.js";

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

async function loadMoodPlaylists(moodKey) {
  const moodData = MOOD[moodKey];
  const genre = moodData.genre;
  const grid = document.querySelector(".albums-grid");
  if (!grid) return;

  grid.innerHTML = '<div class="loading-message">로딩 중...</div>';

  try {
    const spotify = new SpotifyAPI();
    await spotify.initialize();

    const playlists = await spotify.getPlaylistsByGenre(genre);

    grid.innerHTML = "";

    if (!playlists || playlists.length === 0) {
      grid.innerHTML = '<div class="error-message">추천 음악이 없습니다.</div>';
      return;
    }

    playlists.forEach((playlist) => {
      if (!playlist) return;

      const div = document.createElement("div");
      div.className = "album-cover";

      const img = document.createElement("img");
      img.src = playlist.images[0].url;
      img.alt = playlist.name || "Playlist";
      img.title = playlist.name || "Playlist";

      div.appendChild(img);

      div.addEventListener("click", () => {
        if (playlist.external_urls?.spotify) {
          window.open(playlist.external_urls.spotify, "_blank");
        }
      });

      grid.appendChild(div);
    });
  } catch (e) {
    console.error("Failed to load tracks: ", e);
    grid.innerHTML =
      '<div class="error-message">음악을 불러오지 못했습니다.</div>';
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
  loadMoodPlaylists(moodKey);
  setupStickyHeader();
}

document.addEventListener("DOMContentLoaded", main);
