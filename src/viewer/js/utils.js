/**
 * GitHub Pages 호스팅 환경에서 저장소 기본 경로를 반환합니다.
 * @returns {string} 저장소 기본 경로 (e.g., "/repo-name") 또는 빈 문자열
 */
export function getRepoBase() {
  const isGitHubPages = window.location.hostname.includes("github.io");
  let repoBase = "";
  if (isGitHubPages) {
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments.length >= 2) {
      repoBase = "/" + pathSegments[1];
    }
  }
  return repoBase;
}

/**
 * 주어진 경로의 파일을 가져와 텍스트로 반환합니다.
 * @param {string} path - 가져올 파일의 경로
 * @returns {Promise<string|null>} 파일 내용 텍스트 또는 오류 발생 시 null
 */
export async function fetchFileAsText(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      console.error(
        `Failed to fetch file: ${path}, status: ${response.status}`
      );
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching file: ${path}`, error);
    return null;
  }
}
