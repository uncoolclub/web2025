const postListContainer = document.getElementById("post-list");
const chapterListContainer = document.getElementById("chapter-list");
const chapterFilter = document.getElementById("chapter-filter");
const contentTitle = document.getElementById("content-title");
const markdownViewer = document.getElementById("markdown-viewer");
const markdownContent = document.getElementById("markdown-content");
const backBtn = document.getElementById("back-btn");

let POSTS = window.POSTS || [];
let ChapterUtils = window.ChapterUtils || null;

let highlighter;
let md;
let currentView = "list";

window.renderPosts = renderPosts;
window.renderChapterList = renderChapterList;
window.closeMarkdownViewer = closeMarkdownViewer;
window.updatePosts = updatePosts;

function updatePosts() {
  POSTS = window.POSTS || [];
  ChapterUtils = window.ChapterUtils || null;

  if (ChapterUtils) {
    populateChapterFilter();
  }

  renderChapterList();
  renderPosts();
}

function populateChapterFilter() {
  if (!ChapterUtils) return;

  while (chapterFilter.children.length > 1) {
    chapterFilter.removeChild(chapterFilter.lastChild);
  }

  const chapterOptions = ChapterUtils.getChapterOptions();
  chapterOptions.forEach(({ value, text }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text;
    chapterFilter.appendChild(option);
  });
}

async function initShiki() {
  try {
    highlighter = await shiki.getHighlighter({
      theme: "github-light",
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

// 스크롤 인터랙션을 위한 Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// 챕터별로 그룹화
function groupPostsByChapter() {
  const chapters = {};
  POSTS.forEach((post) => {
    post.tags.forEach((tag) => {
      if (tag.includes("Chapter")) {
        if (!chapters[tag]) {
          chapters[tag] = [];
        }
        chapters[tag].push(post);
      }
    });
  });
  return chapters;
}

function renderChapterList() {
  const chapters = groupPostsByChapter();
  const sortedChapterKeys = Object.keys(chapters).sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  chapterListContainer.innerHTML = "";

  sortedChapterKeys.forEach((chapter) => {
    const chapterItem = document.createElement("div");
    chapterItem.className = "chapter-item";
    chapterItem.dataset.chapter = chapter;

    const chapterQuestion = document.createElement("div");
    chapterQuestion.className = "chapter-question";
    chapterQuestion.innerHTML = `
      <div class="chapter-text">
        <span lang="en">${chapter}</span> <span lang="en">(${chapters[chapter].length} posts)</span>
      </div>
      <span class="chapter-icon">→</span>
    `;

    chapterItem.appendChild(chapterQuestion);
    chapterListContainer.appendChild(chapterItem);
    chapterItem.addEventListener("click", () => {
      handleChapterSelect(chapter);
    });
  });
}

function handleChapterSelect(chapter) {
  if (currentView === "posts") {
    closeMarkdownViewer();
  }

  document.querySelectorAll(".chapter-item").forEach((item) => {
    item.classList.remove("active");
  });

  const selectedItem = document.querySelector(`[data-chapter="${chapter}"]`);
  if (selectedItem) {
    selectedItem.classList.add("active");
  }

  renderPosts((post) => post.tags.includes(chapter), chapter);
  chapterFilter.value = chapter;
}

function closeMarkdownViewer() {
  currentView = "list";
  markdownViewer.style.display = "none";
  postListContainer.style.display = "grid";
  markdownContent.classList.remove("practice-content");

  document.querySelectorAll(".chapter-item").forEach((item) => {
    item.classList.remove("active");
  });
}

function renderPosts(filterFn = () => true, selectedChapter = null) {
  const filteredPosts = POSTS.filter(filterFn);

  if (selectedChapter) {
    const chapterNumber = selectedChapter.replace("Chapter ", "");
    contentTitle.innerHTML = `<span lang="en">CHAPTER ${chapterNumber} (${filteredPosts.length} posts)</span>`;
  } else {
    contentTitle.innerHTML = `<span lang="en">CHAPTERS (${filteredPosts.length} posts)</span>`;
  }

  postListContainer.innerHTML = "";

  filteredPosts.forEach(({ title, link, snippet, date, tags, type }, index) => {
    const postItem = document.createElement("div");
    postItem.className =
      type === "practice" ? "post-item practice" : "post-item";
    postItem.style.animationDelay = `${index * 0.05}s`;

    postItem.onclick = () => {
      if (link && link !== "#") {
        if (type === "practice") {
          loadPracticeContent(link, title);
        } else {
          loadMarkdownContent(link);
        }
      }
    };

    const postMeta = document.createElement("div");
    postMeta.className = "post-meta";
    postMeta.setAttribute("lang", "ko");
    postMeta.textContent = date;

    const postTitle = document.createElement("h3");
    postTitle.className = "post-title";
    postTitle.setAttribute("lang", "en");
    postTitle.textContent = title;

    postItem.appendChild(postMeta);
    postItem.appendChild(postTitle);
    postListContainer.appendChild(postItem);

    observer.observe(postItem);
  });
}

async function loadPracticeContent(link) {
  try {
    currentView = "posts";
    postListContainer.style.display = "none";
    markdownViewer.style.display = "block";

    showLoading();

    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    markdownContent.classList.add("practice-content");
    markdownContent.innerHTML = `
      <iframe 
        src="${link}" 
        style="width: 100%; height: 100vh; border: none; background: white;"
        onload="this.style.height = this.contentWindow.document.body.scrollHeight + 'px'"
      ></iframe>
    `;

    setTimeout(() => {
      const iframe = markdownContent.querySelector("iframe");
      if (iframe) {
        iframe.onload = function () {
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow.document;

            const backButton = iframeDoc.querySelector(".back-button");
            if (backButton) {
              backButton.addEventListener("click", (e) => {
                e.preventDefault();
                closeMarkdownViewer();
              });
            }
          } catch (error) {
            console.log("iframe 접근 제한:", error);
          }
        };
      }
    }, 100);
  } catch (error) {
    showError("예제 페이지를 불러올 수 없습니다", error.message);
    console.error(error);
  }
}

function getChapterFromTitle(title) {
  const match = title.match(/(\d+) Chapter/);
  return match ? match[1].padStart(2, "0") : "00";
}

async function loadMarkdownContent(link) {
  if (!md) {
    showError(
      "마크다운 파서가 로드되지 않았습니다.",
      "페이지를 새로고침하거나 나중에 다시 시도해 주세요."
    );
    return;
  }

  try {
    currentView = "posts";
    postListContainer.style.display = "none";
    markdownViewer.style.display = "block";

    markdownContent.classList.remove("practice-content");

    showLoading();

    let filePath;
    if (link.includes("posts.html?file=")) {
      const fileName = link.split("file=")[1];
      filePath = `../chapters/${fileName}`;
    } else {
      filePath = link;
    }

    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const renderedMarkdown = md.render(text);

    const titleMatch = text.match(/^#\s+(.+)/m);
    const chapterTitle = titleMatch ? titleMatch[1] : "문서";

    markdownContent.innerHTML = `
      <div class="header">
        <a href="#" class="back-btn">← Back to List</a>
        <h1 class="content-title">${chapterTitle}</h1>
      </div>
      <div class="content-wrapper">
        ${renderedMarkdown}
      </div>
    `;

    const backButton = markdownContent.querySelector(".back-btn");
    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.preventDefault();
        closeMarkdownViewer();
      });
    }

    setupImageZoom();
  } catch (error) {
    showError("문서를 불러올 수 없습니다", error.message);
    console.error(error);
  }
}

function showLoading() {
  markdownContent.innerHTML = `
    <div style="text-align: center; padding: 40px; color: var(--primary-black);">
      <div style="font-size: 24px; margin-bottom: 10px;">불러오는 중...</div>
      <div style="font-size: 16px; color: var(--text-gray);">문서를 준비하고 있습니다.</div>
    </div>
  `;
}

function showError(title, message) {
  markdownContent.innerHTML = `
    <div style="text-align: center; padding: 40px; color: var(--primary-black);">
      <div style="font-size: 24px; margin-bottom: 16px; color: #ff5252;">${title}</div>
      <div style="font-size: 16px; color: var(--text-gray); margin-bottom: 24px;">
        ${message}
      </div>
    </div>
  `;
}

function setupImageZoom() {
  const images = markdownContent.querySelectorAll("img");

  images.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.style.transition = "all 0.3s ease";

    img.addEventListener("click", (e) => {
      if (img.style.transform === "scale(1.5)") {
        img.style.transform = "scale(1)";
        img.style.cursor = "zoom-in";
      } else {
        img.style.transform = "scale(1.5)";
        img.style.cursor = "zoom-out";
      }
      e.preventDefault();
    });
  });
}

backBtn.addEventListener("click", closeMarkdownViewer);

chapterFilter.addEventListener("change", (e) => {
  const selectedChapter = e.target.value;

  if (currentView === "posts") {
    closeMarkdownViewer();
  }

  if (selectedChapter === "") {
    renderPosts();
    document.querySelectorAll(".chapter-item").forEach((item) => {
      item.classList.remove("active");
    });
  } else {
    handleChapterSelect(selectedChapter);
  }
});

async function init() {
  await initShiki();
  setupMarkdownIt();

  const checkPosts = () => {
    if (window.POSTS && window.POSTS.length > 0) {
      updatePosts();
    } else {
      setTimeout(checkPosts, 100);
    }
  };

  checkPosts();
}

init();
