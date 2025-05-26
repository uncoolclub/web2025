class Http {
  static async get(url, headers = {}) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("HTTP GET 요청 중 오류 발생:", error);
      throw error;
    }
  }

  static async post(url, data = {}, headers = {}) {
    try {
      const body =
        data instanceof URLSearchParams ? data : JSON.stringify(data);
      const contentType =
        data instanceof URLSearchParams
          ? "application/x-www-form-urlencoded"
          : "application/json";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          ...headers,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("HTTP POST 요청 중 오류 발생:", error);
      throw error;
    }
  }
}

export default Http;
