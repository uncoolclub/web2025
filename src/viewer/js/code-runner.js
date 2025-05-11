/**
 * 챕터 폴더 경로에서 예제 실행 섹션을 설정하는 함수
 * @param {string} filePath - 현재 마크다운 파일 경로
 * @param {HTMLElement} contentDiv - 예제 섹션을 추가할 컨테이너
 */
export function setupExampleRunner(filePath, contentDiv) {
  if (!filePath) return;

  console.log("✅ setupExampleRunner 호출됨: ", filePath);

  const pathParts = filePath.split("/");
  if (pathParts.length < 3) return;

  // 파일 경로에서 챕터 번호 추출
  let chapterFolder = "";

  // 경로 형식이 "/content/chapters/06/index.md" 또는 "06/index.md" 형태일 것으로 예상
  const chaptersIndex = pathParts.indexOf("chapters");
  if (chaptersIndex !== -1 && chaptersIndex + 1 < pathParts.length) {
    chapterFolder = pathParts[chaptersIndex + 1]; // chapters 다음 항목이 챕터 번호
  } else {
    // chapters가 경로에 없으면 숫자로 된 부분을 찾음
    for (let i = 0; i < pathParts.length; i++) {
      if (/^\d+$/.test(pathParts[i])) {
        chapterFolder = pathParts[i];
        break;
      }
    }
  }

  console.log("📂 파일 경로:", filePath);
  console.log("📁 찾은 챕터:", chapterFolder);

  if (!chapterFolder) return;

  // GitHub Pages 호스팅을 위한 기본 경로 설정
  const isGitHubPages = window.location.hostname.includes("github.io");
  let repoBase = "";
  if (isGitHubPages) {
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments.length >= 2) {
      repoBase = "/" + pathSegments[1];
    }
  }

  console.log("🌐 저장소 기본 경로:", repoBase);
  console.log("📌 현재 URL:", window.location.href);

  // 챕터별 예제 폴더 경로 구성
  const chapterBase = `${repoBase}/content/chapters/${chapterFolder}`;
  const examplePath = `${chapterBase}/example`;
  const practicePath = `${chapterBase}/practice`;

  console.log("📂 챕터 기본 경로:", chapterBase);
  console.log("📂 예제 경로:", examplePath);
  console.log("📂 실습 경로:", practicePath);

  findExamples(chapterFolder, examplePath, practicePath)
    .then((examples) => {
      if (examples.length > 0) {
        console.log("찾은 예제:", examples);

        const templatePath = `${repoBase}/src/viewer/code-runner.html`;
        console.log("템플릿 로드 시도:", templatePath);

        return fetch(templatePath)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`템플릿 로드 실패: ${response.status}`);
            }
            return response.text();
          })
          .then((templateHtml) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = templateHtml;
            const exampleSection = tempDiv.firstElementChild;

            populateExampleOptions(examples, exampleSection);
            setupEventListeners(exampleSection);
            contentDiv.appendChild(exampleSection);
          });
      } else {
        console.log("예제를 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      console.error("예제 설정 중 오류 발생:", error);
    });
}

/**
 * 챕터의 예제 파일들을 찾는 함수
 * @param {string} chapterFolder - 챕터 폴더명
 * @param {string} examplePath - 예제 폴더 경로
 * @param {string} practicePath - 실습 폴더 경로
 * @returns {Promise<Array>} 예제 파일 목록
 */
async function findExamples(chapterFolder, examplePath, practicePath) {
  const examples = [];

  try {
    // 예제 폴더(example) 확인
    const exampleIndexPath = `${examplePath}/index.html`;
    console.log("예제 인덱스 확인:", exampleIndexPath);

    try {
      const exampleResponse = await fetch(exampleIndexPath);
      if (exampleResponse.ok) {
        const exampleText = await exampleResponse.text();
        const exampleTitle = extractTitle(exampleText) || "기본 예제";

        examples.push({
          name: exampleTitle,
          path: exampleIndexPath,
          type: "example",
          priority: 1,
        });

        console.log("예제 인덱스 파일 추가됨:", exampleTitle);
      }
    } catch (err) {
      console.log("예제 폴더에 인덱스 파일 없음");
    }

    const practiceHtmlPath = `${practicePath}/html`;
    console.log("실습 HTML 폴더 확인:", practiceHtmlPath);

    const practiceIndexPath = `${practiceHtmlPath}/index.html`;
    try {
      const indexResponse = await fetch(practiceIndexPath);
      if (indexResponse.ok) {
        const indexText = await indexResponse.text();
        const indexTitle = extractTitle(indexText) || "실습 예제 모음";

        examples.push({
          name: indexTitle,
          path: practiceIndexPath,
          type: "practice",
          isIndex: true,
          priority: 2,
        });

        console.log("실습 인덱스 파일 추가됨:", indexTitle);

        const links = extractLinksFromHtml(indexText);
        console.log("인덱스에서 발견된 링크:", links);

        for (const linkHref of links) {
          try {
            // 상대 경로를 절대 경로로 변환
            const fullPath = `${practiceHtmlPath}/${linkHref}`;

            console.log("링크된 파일 확인:", fullPath);
            const fileResponse = await fetch(fullPath);

            if (fileResponse.ok) {
              const fileText = await fileResponse.text();
              const fileTitle =
                extractTitle(fileText) || linkHref.replace(".html", "");

              examples.push({
                name: fileTitle,
                path: fullPath,
                type: "practice",
                priority: 3,
              });

              console.log("링크된 실습 파일 추가됨:", fileTitle);
            }
          } catch (error) {
            console.error(`${linkHref} 파일 확인 중 오류:`, error);
          }
        }
      }
    } catch (error) {
      console.log("실습 폴더에 인덱스 파일 없음");
    }
  } catch (error) {
    console.error("예제 파일 찾기 중 오류:", error);
  }

  // 우선순위에 따라 정렬
  examples.sort((a, b) => a.priority - b.priority);

  return examples;
}

/**
 * HTML 문자열에서 링크(href)를 추출하는 함수
 * @param {string} htmlText - HTML 문자열
 * @returns {Array<string>} 추출된 링크 목록
 */
function extractLinksFromHtml(htmlText) {
  const links = [];
  const locationHrefRegex = /location\.href\s*=\s*['"]([^'"]+)['"]/g;
  const hrefRegex = /href\s*=\s*['"]([^'"]+)['"]/g;

  // location.href 형태 찾기
  let match;
  while ((match = locationHrefRegex.exec(htmlText)) !== null) {
    if (match[1].endsWith(".html") && !links.includes(match[1])) {
      links.push(match[1]);
    }
  }

  // href 속성 찾기
  while ((match = hrefRegex.exec(htmlText)) !== null) {
    if (
      match[1].endsWith(".html") &&
      !links.includes(match[1]) &&
      !match[1].startsWith("http")
    ) {
      links.push(match[1]);
    }
  }

  return links;
}

/**
 * HTML 문자열에서 title 태그 내용을 추출하는 함수
 * @param {string} htmlText - HTML 문자열
 * @returns {string|null} 추출된 title 또는 null
 */
function extractTitle(htmlText) {
  const titleMatch = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

/**
 * 예제 옵션을 셀렉트 박스에 추가하는 함수
 * @param {Array} examples - 예제 목록
 * @param {HTMLElement} sectionElement - 예제 섹션 요소
 */
function populateExampleOptions(examples, sectionElement) {
  // 예제 그룹 분류
  const exampleGroups = {
    example: {
      title: "기본 예제",
      items: examples.filter((ex) => ex.type === "example"),
    },
    practiceIndex: {
      title: "실습 모음",
      items: examples.filter((ex) => ex.type === "practice" && ex.isIndex),
    },
    practice: {
      title: "개별 실습",
      items: examples.filter((ex) => ex.type === "practice" && !ex.isIndex),
    },
  };

  const selectBox = sectionElement.querySelector("#example-select");

  // 각 그룹별로 옵션 그룹 추가
  Object.entries(exampleGroups).forEach(([groupKey, group]) => {
    if (group.items.length > 0) {
      const optGroup = document.createElement("optgroup");
      optGroup.label = group.title;

      // 그룹 내 각 예제에 대한 옵션 추가
      group.items.forEach((example) => {
        const option = document.createElement("option");
        option.value = example.path;
        option.textContent = example.name;
        option.dataset.name = example.name;
        optGroup.appendChild(option);
      });

      selectBox.appendChild(optGroup);
    }
  });
}

/**
 * 이벤트 리스너를 설정하는 함수
 * @param {HTMLElement} sectionElement - 예제 섹션 요소
 */
function setupEventListeners(sectionElement) {
  const selectBox = sectionElement.querySelector("#example-select");
  const runButton = sectionElement.querySelector("#example-run-button");
  const previewContainer = sectionElement.querySelector(
    "#example-preview-container"
  );
  const previewTitle = sectionElement.querySelector("#example-preview-title");
  const previewFrame = sectionElement.querySelector("#example-frame");
  const openInNewTab = sectionElement.querySelector("#example-new-tab");
  const closeButton = sectionElement.querySelector("#example-preview-close");

  // 셀렉트 박스 변경 이벤트
  selectBox.addEventListener("change", () => {
    runButton.disabled = !selectBox.value;
  });

  // 실행 버튼 클릭 이벤트
  runButton.addEventListener("click", () => {
    if (selectBox.value) {
      const selectedOption = selectBox.options[selectBox.selectedIndex];
      openExampleRunner(
        selectBox.value,
        selectedOption.dataset.name,
        previewContainer,
        previewTitle,
        previewFrame,
        openInNewTab
      );
    }
  });

  // 닫기 버튼 클릭 이벤트
  closeButton.addEventListener("click", () => {
    previewContainer.style.display = "none";
    previewFrame.src = "about:blank";
  });
}

/**
 * 예제 런처를 열고 iframe에서 예제를 로드하는 함수
 * @param {string} path - 예제 파일 경로
 * @param {string} title - 예제 제목
 * @param {HTMLElement} container - 미리보기 컨테이너
 * @param {HTMLElement} titleElement - 제목 요소
 * @param {HTMLElement} frame - iframe 요소
 * @param {HTMLElement} newTabButton - 새 탭 버튼
 */
function openExampleRunner(
  path,
  title,
  container,
  titleElement,
  frame,
  newTabButton
) {
  // 타이틀 설정
  titleElement.textContent = `${title} | 미리 보기`;

  // iframe 소스 설정
  frame.src = path;

  // 새 탭에서 열기 버튼 업데이트
  newTabButton.onclick = () => {
    window.open(path, "_blank");
  };

  // 미리보기 표시
  container.style.display = "block";

  // 미리보기로 스크롤
  container.scrollIntoView({ behavior: "smooth" });
}
