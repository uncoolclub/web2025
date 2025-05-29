import { SessionStorage } from "./common/session-storage.js";

class Player {
  constructor() {
    this.videoId = null;
    this.player = null;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.isDragging = false;
    this.dragPosition = 0;
    this.loadVideoInfo();
    this.initializePlayer();
    this.setupEventListeners();
  }

  initializePlayer() {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    if (!this.videoId) return;

    this.player = new YT.Player("player", {
      height: "100%",
      width: "100%",
      videoId: this.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this),
      },
    });
  }

  onPlayerReady(event) {
    this.duration = event.target.getDuration();
    this.updateTotalTime();
    document.getElementById("player-thumbnail").style.display = "none";
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.updatePlayButton();
      this.startProgressUpdate();
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.updatePlayButton();
      this.stopProgressUpdate();
    }
  }

  setupEventListeners() {
    document.querySelector(".back-button").addEventListener("click", () => {
      window.history.back();
    });

    document.getElementById("play-button").addEventListener("click", () => {
      this.togglePlay();
    });

    document.getElementById("prev-button").addEventListener("click", () => {
      this.seekTo(-10);
    });

    document.getElementById("next-button").addEventListener("click", () => {
      this.seekTo(10);
    });

    const progressBar = document.querySelector(".progress-bar");
    const progressHandle = document.querySelector(".progress-handle");

    progressBar.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.handleProgressBarInteraction(e);
    });

    progressHandle.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        this.handleProgressBarInteraction(e);
      }
    });

    document.addEventListener("mouseup", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.seekToPercentage(this.dragPosition);
      }
    });

    progressBar.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      this.handleProgressBarInteraction(e.touches[0]);
    });

    progressHandle.addEventListener("touchstart", (e) => {
      this.isDragging = true;
      e.stopPropagation();
    });

    document.addEventListener("touchmove", (e) => {
      if (this.isDragging) {
        this.handleProgressBarInteraction(e.touches[0]);
      }
    });

    document.addEventListener("touchend", () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.seekToPercentage(this.dragPosition);
      }
    });
  }

  handleProgressBarInteraction(e) {
    const progressBar = document.querySelector(".progress-bar");
    const rect = progressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

    this.dragPosition = pos;
    this.updateProgressUI(pos);
  }

  updateProgressUI(percentage) {
    const progress = document.querySelector(".progress");
    const handle = document.querySelector(".progress-handle");
    progress.style.width = `${percentage * 100}%`;
    handle.style.left = `${percentage * 100}%`;
  }

  togglePlay() {
    if (!this.player) return;

    if (this.isPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  seekTo(seconds) {
    if (!this.player) return;
    const newTime = this.currentTime + seconds;
    this.player.seekTo(newTime, true);
  }

  seekToPercentage(percentage) {
    if (!this.player) return;
    const newTime = this.duration * percentage;
    this.player.seekTo(newTime, true);
    this.currentTime = newTime;
    this.updateCurrentTime();
  }

  updatePlayButton() {
    const playButton = document.getElementById("play-button");
    const playIcon = playButton.querySelector("img");
    playIcon.src = this.isPlaying
      ? "../assets/svgs/ic_pause.svg"
      : "../assets/svgs/ic_play.svg";
  }

  startProgressUpdate() {
    this.progressInterval = setInterval(() => {
      if (this.player) {
        this.currentTime = this.player.getCurrentTime();
        this.updateProgress();
        this.updateCurrentTime();
      }
    }, 1000);
  }

  stopProgressUpdate() {
    clearInterval(this.progressInterval);
  }

  updateProgress() {
    if (!this.isDragging) {
      const percentage = (this.currentTime / this.duration) * 100;
      this.updateProgressUI(percentage / 100);
    }
  }

  updateCurrentTime() {
    const currentTimeElement = document.querySelector(".current-time");
    currentTimeElement.textContent = this.formatTime(this.currentTime);
  }

  updateTotalTime() {
    const totalTimeElement = document.querySelector(".total-time");
    totalTimeElement.textContent = this.formatTime(this.duration);
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  async loadVideoInfo() {
    const videoData = SessionStorage.get("currentVideo");
    if (!videoData) {
      window.location.href = "/project/html/playlist.html";
      return;
    }

    this.videoId = videoData.videoId;
    document.querySelector(".player-video-title").textContent = videoData.title;
    document.querySelector(".player-channel").textContent = videoData.channel;
    document.getElementById("player-thumbnail").src = videoData.thumbnail;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Player();
});
