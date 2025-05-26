import Http from "./http.js";
import SpotifyAuth from "./spotify-auth.js";

class SpotifyAPI {
  constructor() {
    this.auth = new SpotifyAuth();
  }

  async initialize() {
    await this.auth.initialize();
  }

  async getCategories() {
    try {
      if (this.auth.isTokenExpired() || this.auth.isTokenExpiringSoon()) {
        await this.auth.initialize();
      }

      const response = await Http.get(
        "https://api.spotify.com/v1/browse/categories?limit=10",
        {
          Authorization: `Bearer ${this.auth.accessToken}`,
        }
      );

      return response.categories.items;
    } catch (error) {
      console.error("카테고리 목록 가져오기 중 오류 발생:", error);
      throw error;
    }
  }

  async getCategoryPlaylists(categoryId) {
    try {
      if (this.auth.isTokenExpired() || this.auth.isTokenExpiringSoon()) {
        await this.auth.initialize();
      }

      const response = await Http.get(
        `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists?limit=20`,
        {
          Authorization: `Bearer ${this.auth.accessToken}`,
        }
      );

      return response.playlists.items;
    } catch (error) {
      console.error("카테고리 플레이리스트 가져오기 중 오류 발생:", error);
      throw error;
    }
  }
}

export default SpotifyAPI;
