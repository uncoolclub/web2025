import { MOOD } from "../constants.js";
import Http from "./http.js";

class YouTubeAPI {
  #API_KEY;
  #nextPageToken;

  constructor() {
    this.#API_KEY = "AIzaSyB2S6ijhY_GND8o9Fmy_EYhXxqFcgS5HKM";
    this.BASE_URL = "https://www.googleapis.com/youtube/v3";
    this.DEFAULT_PARAMS = {
      part: "snippet",
      type: "playlist",
      regionCode: "KR",
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
   * playlistId로 해당 플레이리스트의 영상 아이템들을 조회
   */
  async fetchPlaylistItems(playlistId, maxResults = 10) {
    const url = `${
      this.BASE_URL
    }/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${
      this.#API_KEY
    }`;

    try {
      const itemsData = await Http.get(url);

      return itemsData.items.map((v) => ({
        videoId: v.snippet.resourceId.videoId,
        title: v.snippet.title,
        thumbnail: v.snippet.thumbnails?.high?.url,
        videoOwnerChannelTitle: v.snippet.videoOwnerChannelTitle,
        publishedAt: v.snippet.publishedAt,
        description: v.snippet.description,
      }));
    } catch (error) {
      return [];
    }
  }

  async #searchPlaylistsByGenre(genre, maxResults = 1) {
    try {
      const params = this.#createSearchParams({
        maxResults: maxResults.toString(),
        type: "playlist",
      });
      const url = `${this.BASE_URL}/search?q=${encodeURIComponent(
        genre
      )}&${params}`;
      const data = await Http.get(url);
      this.#nextPageToken = data.nextPageToken;

      const playlists = await Promise.all(
        data.items.map(async (item) => {
          const playlistId = item.id.playlistId;
          const playlistInfo = {
            playlistId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high.url,
            channelTitle: item.snippet.channelTitle,
            item: [],
          };
          playlistInfo.item = await this.fetchPlaylistItems(playlistId);

          return playlistInfo;
        })
      );

      return playlists.length > 0 ? playlists[0].item : [];
    } catch (error) {
      console.error("플레이리스트 검색 중 오류:", error);
      throw error;
    }
  }

  /**
   * 특정 기분에 맞는 플레이리스트를 검색합니다.
   * @param {string} moodKey - 기분 상태 키
   * @param {boolean} isNewSearch - 새로운 검색인지 여부
   * @returns {Promise<Array>} 검색된 플레이리스트 목록
   */
  async getMusicForMood(moodKey, isNewSearch = false) {
    const genre = MOOD[moodKey].genre;
    if (!genre) {
      throw new Error("유효하지 않은 기분 상태입니다.");
    }
    if (isNewSearch) {
      this.#nextPageToken = null;
    }

    const items = await this.#searchPlaylistsByGenre(genre);

    return items;
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
