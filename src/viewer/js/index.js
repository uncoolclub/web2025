const postListContainer = document.getElementById("post-list");
const tagListContainer = document.getElementById("tag-list");
const aboutSection = document.getElementById("about-me");
const tabPosts = document.getElementById("tab-posts");
const tabAbout = document.getElementById("tab-about");

const POSTS = window.POSTS || [];

let allTags = new Set();
POSTS.forEach((post) => {
  post.tags.forEach((tag) => allTags.add(tag));
});

function renderPosts(filterFn = () => true) {
  postListContainer.innerHTML = "";
  POSTS.filter(filterFn).forEach(({ title, link, snippet, date }) => {
    const postItem = document.createElement("div");
    postItem.className = "post-item";
    postItem.onclick = () => {
      if (link && link !== "#") window.location.href = link;
    };

    const postTitle = document.createElement("h2");
    postTitle.className = "post-title";
    postTitle.textContent = title;

    const postSnippet = document.createElement("p");
    postSnippet.className = "post-snippet";
    postSnippet.textContent = snippet;

    const postMeta = document.createElement("div");
    postMeta.className = "post-meta";
    postMeta.textContent = `${date}`;

    postItem.appendChild(postTitle);
    postItem.appendChild(postSnippet);
    postItem.appendChild(postMeta);
    postListContainer.appendChild(postItem);
  });
}

function renderTags() {
  tagListContainer.innerHTML = "";

  const allButton = document.createElement("button");
  allButton.textContent = `전체 보기 (${POSTS.length})`;
  allButton.className = "active";
  allButton.onclick = () => {
    setActiveTag(allButton);
    renderPosts();
  };
  tagListContainer.appendChild(allButton);

  allTags.forEach((tag) => {
    const button = document.createElement("button");
    const count = POSTS.filter((p) => p.tags.includes(tag)).length;
    button.textContent = `${tag} (${count})`;
    button.onclick = () => {
      setActiveTag(button);
      renderPosts((post) => post.tags.includes(tag));
    };
    tagListContainer.appendChild(button);
  });
}

function setActiveTag(activeButton) {
  tagListContainer
    .querySelectorAll("button")
    .forEach((btn) => btn.classList.remove("active"));
  activeButton.classList.add("active");
}

function setActiveTab(activeTab) {
  [tabPosts, tabAbout].forEach((tab) => tab.classList.remove("active"));
  activeTab.classList.add("active");
}

tabPosts.onclick = (e) => {
  e.preventDefault();
  setActiveTab(tabPosts);
  aboutSection.style.display = "none";
  tagListContainer.style.display = "flex";
  postListContainer.style.display = "block";
  renderTags();
  renderPosts();
};

tabAbout.onclick = (e) => {
  e.preventDefault();
  setActiveTab(tabAbout);
  postListContainer.style.display = "none";
  tagListContainer.style.display = "none";
  aboutSection.style.display = "block";
};

renderTags();
renderPosts();
