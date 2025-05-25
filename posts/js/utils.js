export function getRepoBase() {
  const hostname = window.location.hostname;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "";
  }

  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  if (pathSegments.length > 0) {
    return `/${pathSegments[0]}`;
  }

  return "";
}

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

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
