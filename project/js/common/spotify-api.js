import Http from "./http.js";
import SpotifyAuth from "./spotify-auth.js";

class SpotifyAPI {
  constructor() {
    this.auth = new SpotifyAuth();
  }

  async initialize() {
    await this.auth.initialize();
  }

  async getPlaylistsByGenre(genre) {
    try {
      if (this.auth.isTokenExpired() || this.auth.isTokenExpiringSoon()) {
        await this.auth.initialize();
      }

      const response = await Http.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          genre
        )}&type=playlist&limit=20&offset=5&market=KR`,
        {
          Authorization: `Bearer ${this.auth.accessToken}`,
        }
      );

      return response.playlists.items;
    } catch (error) {
      console.error("플레이리스트 가져오기 중 오류 발생:", error);
      throw error;
    }
  }
}

export default SpotifyAPI;
