import youtubeAPI from "./common/youtube-api.js";
import { SessionStorage } from "./common/session-storage.js";

export class PlaylistManager {
  constructor() {
    this.grid = document.querySelector(".albums-grid");
    this.isLoading = false;
    this.currentMoodKey = null;
    this.intersectionObserver = null;
    this.scrollCount = 0;
    this.maxScrollCount = 3;
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      root: document.querySelector(".recent-albums-section"),
      rootMargin: "100px",
      threshold: 0.1,
    };

    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      options
    );
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      const canLoadMore =
        entry.isIntersecting &&
        !this.isLoading &&
        youtubeAPI.hasNextPage() &&
        this.scrollCount < this.maxScrollCount;

      if (canLoadMore) {
        this.loadMorePlaylists();
      }
    });
  }

  createPlaylistElement(playlist) {
    const div = document.createElement("div");
    div.className = "album-cover";

    const imgWrapper = document.createElement("div");
    imgWrapper.className = "album-img-wrapper";

    const img = document.createElement("img");
    img.src = playlist.thumbnail;
    img.alt = playlist.title || "Playlist";
    img.title = playlist.title || "Playlist";
    img.loading = "lazy";

    const dim = document.createElement("div");
    dim.className = "album-img-dim";

    const playIcon = document.createElement("img");
    playIcon.className = "album-play-icon";
    playIcon.src = "/project/assets/svgs/ic_play.svg";
    playIcon.alt = "Play";

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(dim);
    imgWrapper.appendChild(playIcon);

    const info = document.createElement("div");
    info.className = "album-info";

    const title = document.createElement("div");
    title.className = "album-title";
    title.textContent = playlist.title || "제목 없음";

    const channel = document.createElement("div");
    channel.className = "album-channel";
    channel.textContent = playlist.videoOwnerChannelTitle || "채널 정보 없음";

    const date = document.createElement("div");
    date.className = "album-date";
    date.textContent = playlist.publishedAt
      ? new Date(playlist.publishedAt).toLocaleDateString("ko-KR")
      : "";

    const description = document.createElement("div");
    description.className = "album-description";
    description.textContent = playlist.description;

    info.appendChild(title);
    info.appendChild(channel);
    info.appendChild(date);
    info.appendChild(description);

    div.appendChild(imgWrapper);
    div.appendChild(info);

    div.addEventListener("click", () => {
      if (playlist.videoId) {
        SessionStorage.set("currentVideo", {
          videoId: playlist.videoId,
          title: playlist.title,
          channel: playlist.videoOwnerChannelTitle,
          thumbnail: playlist.thumbnail,
        });
        window.location.href = "/project/html/player.html";
      }
    });

    return div;
  }

  async loadMorePlaylists() {
    if (this.isLoading) return;
    if (this.scrollCount >= this.maxScrollCount) return;

    this.isLoading = true;
    this.scrollCount += 1;

    try {
      const response = await youtubeAPI.getMusicForMood(this.currentMoodKey);

      if (!response || response.length === 0) {
        this.intersectionObserver.disconnect();
        return;
      }

      const fragment = document.createDocumentFragment();
      response.forEach((playlist) => {
        if (!playlist) return;
        const element = this.createPlaylistElement(playlist);
        fragment.appendChild(element);
      });

      this.grid.appendChild(fragment);

      const lastElement = this.grid.lastElementChild;
      if (lastElement && this.scrollCount < this.maxScrollCount) {
        this.intersectionObserver.observe(lastElement);
      } else if (this.scrollCount >= this.maxScrollCount) {
        this.intersectionObserver.disconnect();
      }
    } catch (error) {
      console.error("Failed to load more tracks: ", error);
    } finally {
      this.isLoading = false;
    }
  }

  async initializePlaylists(moodKey) {
    this.currentMoodKey = moodKey;
    this.grid.innerHTML = '<div class="loading-message">로딩 중...</div>';
    this.scrollCount = 0;

    try {
      const response = await youtubeAPI.getMusicForMood(moodKey, true);
      this.grid.innerHTML = "";

      if (!response || response.length === 0) {
        this.grid.innerHTML =
          '<div class="error-message">추천 음악이 없습니다. 😅</div>';
        return;
      }

      const fragment = document.createDocumentFragment();
      response.forEach((playlist) => {
        if (!playlist) return;
        const element = this.createPlaylistElement(playlist);
        fragment.appendChild(element);
      });

      this.grid.appendChild(fragment);

      const lastElement = this.grid.lastElementChild;
      if (lastElement && this.scrollCount < this.maxScrollCount) {
        this.intersectionObserver.observe(lastElement);
      }
    } catch (error) {
      console.error("Failed to load tracks: ", error);

      if (error.message.includes("403")) {
        this.grid.innerHTML =
          '<div class="error-message">일일 Youtube API 사용량을 초과했습니다.<br/>내일 다시 시도해 주세요. 🥺</div>';
        return;
      }

      this.grid.innerHTML =
        '<div class="error-message">음악을 불러오지 못했습니다.</div>';
    }
  }
}
