const params = new URLSearchParams(window.location.search);
const file = params.get("file");
const contentDiv = document.getElementById("content");
const tocList = document.getElementById("toc-list");
const tocContainer = document.getElementById("toc-container");

let highlighter;
let md;

import { setupExampleRunner } from "./code-runner.js";
import { getRepoBase } from "./utils.js";

async function initShiki() {
  try {
    highlighter = await shiki.getHighlighter({
      theme: "github-dark",
      langs: [
        "javascript",
        "typescript",
        "html",
        "css",
        "json",
        "markdown",
        "bash",
        "jsx",
        "tsx",
        "python",
      ],
    });
    return true;
  } catch (error) {
    console.error("Shiki 초기화 실패:", error);
    return false;
  }
}

const tocToggleBtn = document.createElement("button");
tocToggleBtn.className = "toc-toggle";
tocToggleBtn.title = "목차 토글";
document.body.appendChild(tocToggleBtn);

const modalContainer = document.createElement("div");
modalContainer.className = "image-modal";
modalContainer.style.display = "none";
modalContainer.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <img class="modal-image">
  </div>
`;
document.body.appendChild(modalContainer);

const modalImage = modalContainer.querySelector(".modal-image");
const modalClose = modalContainer.querySelector(".modal-close");

modalClose.addEventListener("click", () => {
  modalContainer.style.display = "none";
  document.body.style.overflow = "auto";
});

modalContainer.addEventListener("click", (e) => {
  if (e.target === modalContainer) {
    modalContainer.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalContainer.style.display === "flex") {
    modalContainer.style.display = "none";
    document.body.style.overflow = "auto";
  }
});

function setupMarkdownIt() {
  if (window.markdownit && highlighter) {
    md = window.markdownit({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        try {
          return highlighter.codeToHtml(str, { lang: lang || "text" });
        } catch (e) {
          console.error("코드 하이라이팅 오류:", e);
          return `<pre><code>${md.utils.escapeHtml(str)}</code></pre>`;
        }
      },
    });
  }
}

function highlightActiveLink() {
  if (!file) return;

  const links = document.querySelectorAll(".doc-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === `?file=${file}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

let headersForIntersection = [];

function generateTableOfContents() {
  const headers = contentDiv.querySelectorAll("h1, h2, h3, h4, h5, h6");
  headersForIntersection = Array.from(headers);

  if (headers.length === 0) {
    tocContainer.style.display = "none";
    return;
  } else {
    tocContainer.style.display = "block";
  }

  tocList.innerHTML = "";

  headers.forEach((header) => {
    const id = header.textContent
      .toLowerCase()
      .replace(/[^\w가-힣]+/g, "-")
      .replace(/(^-|-$)/g, "");

    header.id = id;

    const anchor = document.createElement("a");
    anchor.className = "header-anchor";
    anchor.href = `#${id}`;
    anchor.innerHTML = " 🔗";
    anchor.title = "이 섹션으로 링크";
    anchor.style.opacity = "0";
    anchor.style.fontSize = "0.8em";
    anchor.style.marginLeft = "5px";
    anchor.style.textDecoration = "none";

    header.appendChild(anchor);

    header.addEventListener("mouseenter", () => {
      anchor.style.opacity = "0.5";
    });

    header.addEventListener("mouseleave", () => {
      anchor.style.opacity = "0";
    });

    const tocItem = document.createElement("li");
    tocItem.className = `toc-item toc-${header.tagName.toLowerCase()}`;
    tocItem.dataset.target = id;

    const tocLink = document.createElement("a");
    tocLink.className = "toc-link";
    tocLink.href = `#${id}`;
    tocLink.textContent = header.textContent.replace(" 🔗", "");

    tocItem.appendChild(tocLink);
    tocList.appendChild(tocItem);
  });

  setupScrollSpy();
  setupTocToggle();
}

function setupTocToggle() {
  tocToggleBtn.addEventListener("click", () => {
    tocContainer.classList.toggle("active");
    tocToggleBtn.classList.toggle("active");
  });

  function handleResize() {
    if (window.innerWidth < 1200) {
      tocContainer.classList.remove("active");
      tocToggleBtn.style.display = "flex";
    } else {
      tocContainer.classList.add("active");
      tocToggleBtn.style.display = "none";
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);
}

function setupScrollSpy() {
  if (!headersForIntersection.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleHeaders = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target);

      if (visibleHeaders.length > 0) {
        const topHeader = [...visibleHeaders].sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();
          return rectA.top - rectB.top;
        })[0];

        const tocItems = tocList.querySelectorAll(".toc-item");
        tocItems.forEach((item) => item.classList.remove("active"));

        const activeItem = tocList.querySelector(
          `.toc-item[data-target="${topHeader.id}"]`
        );
        if (activeItem) {
          activeItem.classList.add("active");
        }
      }
    },
    {
      rootMargin: "-100px 0px -80% 0px",
      threshold: 0,
    }
  );

  headersForIntersection.forEach((header) => {
    observer.observe(header);
  });

  const tocLinks = tocList.querySelectorAll(".toc-link");
  tocLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      tocLinks.forEach((l) => l.parentElement.classList.remove("active"));
      link.parentElement.classList.add("active");

      if (window.innerWidth < 1200) {
        tocContainer.classList.remove("active");
        tocToggleBtn.classList.remove("active");
      }
    });
  });

  window.addEventListener("scroll", handleScroll);
  setTimeout(handleScroll, 100);
}

function handleScroll() {
  if (window.scrollY < 50) {
    const tocItems = tocList.querySelectorAll(".toc-item");
    tocItems.forEach((item) => item.classList.remove("active"));

    const firstItem = tocList.querySelector(".toc-item");
    if (firstItem) {
      firstItem.classList.add("active");
    }
  }

  const isAtBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
  if (isAtBottom) {
    const tocItems = tocList.querySelectorAll(".toc-item");
    tocItems.forEach((item) => item.classList.remove("active"));

    const lastItem = tocItems[tocItems.length - 1];
    if (lastItem) {
      lastItem.classList.add("active");
    }
  }
}

async function loadMarkdown() {
  if (!md) {
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-color);">
        <div style="font-size: 24px; margin-bottom: 10px;">마크다운 파서가 로드되지 않았습니다.</div>
        <div style="font-size: 16px; color: var(--secondary-text-color);">페이지를 새로고침하거나 나중에 다시 시도해 주세요.</div>
      </div>
    `;
    return;
  }

  if (!file) {
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-color);">
        <div style="font-size: 24px; margin-bottom: 16px;">파일이 지정되지 않았습니다.</div>
        <div style="font-size: 16px; color: var(--secondary-text-color); margin-bottom: 24px;">URL에 ?file=경로/파일명.md 형식으로 파일을 지정해주세요.</div>
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
          <a href="?file=00/1.md" style="color: var(--highlight-color); background-color: rgba(61, 106, 255, 0.1); padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500;">웹의 3 요소</a>
          <a href="?file=00/2.md" style="color: var(--highlight-color); background-color: rgba(61, 106, 255, 0.1); padding: 8px 16px; border-radius: 4px; text-decoration: none; font-weight: 500;">웹 프론트엔드</a>
        </div>
      </div>
    `;
    return;
  }

  try {
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-color);">
        <div style="font-size: 24px; margin-bottom: 10px;">불러오는 중...</div>
        <div style="font-size: 16px; color: var(--secondary-text-color);">문서를 준비하고 있습니다.</div>
      </div>
    `;

    let filePath;
    if (file.startsWith("/")) {
      filePath = file;
    } else {
      const repoBase = getRepoBase();
      filePath = `${repoBase}/content/chapters/${file}`;
    }

    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    contentDiv.innerHTML = md.render(text);

    setupExampleRunner(filePath, contentDiv);
    generateTableOfContents();
    highlightActiveLink();
    setupImageZoom();
    updatePageTitle();
  } catch (error) {
    contentDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-color);">
        <div style="font-size: 24px; margin-bottom: 16px; color: #ff5252;">문서를 불러올 수 없습니다</div>
        <div style="font-size: 16px; color: var(--secondary-text-color); margin-bottom: 24px;">
          ${error.message}
        </div>
        <div style="margin-top: 20px;">
          <a href="javascript:history.back()" style="color: var(--highlight-color); text-decoration: none;">← 이전 페이지로 돌아가기</a>
        </div>
      </div>
    `;
    console.error(error);
  }
}

function updatePageTitle() {
  try {
    let title = "";

    const firstHeading = contentDiv.querySelector("h1, h2");
    if (firstHeading) {
      title = firstHeading.textContent.replace(" 🔗", "");
    } else {
      const fileName = file.split("/").pop().replace(".md", "");
      title = `문서 ${fileName}`;
    }

    document.title = `${title}`;
  } catch (error) {
    console.error("페이지 제목 업데이트 실패:", error);
  }
}

function setupImageZoom() {
  const images = contentDiv.querySelectorAll("img");

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.style.transition = "all 0.3s ease";

    img.addEventListener("click", (e) => {
      modalImage.src = img.src;
      modalImage.alt = img.alt || "이미지";

      modalContainer.style.display = "flex";
      document.body.style.overflow = "hidden";

      e.preventDefault();
      e.stopPropagation();
    });
  });
}

async function init() {
  await initShiki();
  setupMarkdownIt();
  await loadMarkdown();

  if (window.location.hash) {
    const element = document.getElementById(window.location.hash.substring(1));
    if (element) {
      element.scrollIntoView();
    }
  }
}

init();
