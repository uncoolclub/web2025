import { MOOD } from "../constants.js";

class YouTubeAPI {
  #API_KEY;
  #nextPageToken;

  constructor() {
    this.#API_KEY = "AIzaSyB2S6ijhY_GND8o9Fmy_EYhXxqFcgS5HKM";
    this.BASE_URL = "https://www.googleapis.com/youtube/v3";
    this.DEFAULT_PARAMS = {
      part: "snippet",
      videoCategoryId: "10",
      videoEmbeddable: "true",
      type: "video",
      regionCode: "KR",
      videoSyndicated: "true",
      videoDuration: "medium",
    };
    this.#nextPageToken = null;
  }

  /**
   * URL 파라미터를 생성합니다.
   * @param {Object} params - 추가 파라미터
   * @returns {string} URL 파라미터 문자열
   */
  #createSearchParams(params) {
    const publishedAfter = "2020-01-01T00:00:00Z";
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const publishedBefore = `${yyyy}-${mm}-${dd}T23:59:59Z`;

    const searchParams = new URLSearchParams({
      ...params,
      ...this.DEFAULT_PARAMS,
      publishedAfter,
      publishedBefore,
      key: this.#API_KEY,
    });

    if (this.#nextPageToken) {
      searchParams.append("pageToken", this.#nextPageToken);
    }

    return searchParams.toString();
  }

  /**
   * 토픽 ID로 음악을 검색합니다.
   * @param {string} genre - 검색할 장르
   * @param {number} maxResults - 최대 검색 결과 수 (기본값: 10)
   * @returns {Promise<Array>} 검색된 음악 목록
   */
  async #searchMusicByGenre(genre, maxResults = 10) {
    try {
      const params = this.#createSearchParams({
        maxResults: maxResults.toString(),
      });

      const response = await fetch(
        `${this.BASE_URL}/search?q=${encodeURIComponent(`${genre}`)}&${params}`
      );

      if (!response.ok) {
        throw new Error("YouTube API 요청 실패");
      }

      const data = await response.json();
      this.#nextPageToken = data.nextPageToken;

      return data.items.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        description: item.snippet.description,
      }));
    } catch (error) {
      console.error("음악 검색 중 오류 발생:", error);
      throw error;
    }
  }

  /**
   * 특정 기분에 맞는 음악을 검색합니다.
   * @param {string} moodKey - 기분 상태 키
   * @param {boolean} isNewSearch - 새로운 검색인지 여부
   * @returns {Promise<Array>} 검색된 음악 목록
   */
  async getMusicForMood(moodKey, isNewSearch = false) {
    const genre = MOOD[moodKey].genre;

    if (!genre) {
      throw new Error("유효하지 않은 기분 상태입니다.");
    }

    console.log(genre);

    if (isNewSearch) {
      this.#nextPageToken = null;
    }

    return await this.#searchMusicByGenre(genre);
  }

  /**
   * 다음 페이지 토큰이 있는지 확인합니다.
   * @returns {boolean} 다음 페이지 존재 여부
   */
  hasNextPage() {
    return !!this.#nextPageToken;
  }
}

const youtubeAPI = new YouTubeAPI();

export default youtubeAPI;
