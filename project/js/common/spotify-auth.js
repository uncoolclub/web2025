import Http from "./http.js";

class SpotifyAuth {
  constructor() {
    this.clientId = "2f24c7fe7c594f3287053de528ee9c25";
    this.clientSecret = "f00d4e8eb79d446a94df29bdf0ed067c";
    this.accessToken = null;
    this.tokenExpiry = null;
    this.refreshToken = null;
    this.redirectUri = window.location.origin + window.location.pathname;
  }

  async initialize() {
    const code = new URLSearchParams(window.location.search).get("code");

    const savedToken = localStorage.getItem("access_token");
    const savedExpiry = localStorage.getItem("token_expiry");
    const savedRefreshToken = localStorage.getItem("refresh_token");

    if (savedToken && savedExpiry) {
      this.accessToken = savedToken;
      this.tokenExpiry = parseInt(savedExpiry);
      this.refreshToken = savedRefreshToken;

      // 토큰이 만료되었거나 만료 5분 전인 경우 갱신
      if (this.isTokenExpired() || this.isTokenExpiringSoon()) {
        if (this.refreshToken) {
          await this.refreshAccessToken();
        } else {
          await this.redirectToAuth();
        }
      }
    } else if (code) {
      await this.handleCallback(code);
    } else {
      await this.redirectToAuth();
    }

    return this.accessToken;
  }

  isTokenExpired() {
    return this.tokenExpiry && Date.now() >= this.tokenExpiry;
  }

  isTokenExpiringSoon() {
    // 만료 5분 전부터 갱신
    return this.tokenExpiry && Date.now() >= this.tokenExpiry - 5 * 60 * 1000;
  }

  async refreshAccessToken() {
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", this.refreshToken);
      params.append("client_id", this.clientId);

      const response = await Http.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      );

      this.accessToken = response.access_token;
      this.tokenExpiry = Date.now() + response.expires_in * 1000;

      if (response.refresh_token) {
        this.refreshToken = response.refresh_token;
        localStorage.setItem("refresh_token", this.refreshToken);
      }

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("token_expiry", this.tokenExpiry);
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생:", error);
      // 갱신 실패 시 재인증
      await this.redirectToAuth();
    }
  }

  async redirectToAuth() {
    const verifier = this.generateCodeVerifier(128);
    const challenge = await this.generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", this.redirectUri);
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  generateCodeVerifier(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async handleCallback(code) {
    const verifier = localStorage.getItem("verifier");

    try {
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("grant_type", "authorization_code");
      params.append("code", code);
      params.append("redirect_uri", this.redirectUri);
      params.append("code_verifier", verifier);

      const response = await Http.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      );

      this.accessToken = response.access_token;
      this.refreshToken = response.refresh_token;
      this.tokenExpiry = Date.now() + response.expires_in * 1000;

      localStorage.setItem("access_token", this.accessToken);
      localStorage.setItem("refresh_token", this.refreshToken);
      localStorage.setItem("token_expiry", this.tokenExpiry);

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error("콜백 처리 중 오류 발생:", error);
      throw error;
    }
  }
}

export default SpotifyAuth;
