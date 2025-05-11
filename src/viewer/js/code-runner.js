/**
 * 챕터 폴더 경로에서 예제 실행 섹션을 설정하는 함수
 * @param {string} filePath - 현재 마크다운 파일 경로
 * @param {HTMLElement} contentDiv - 예제 섹션을 추가할 컨테이너
 */
export function setupExampleRunner(filePath, contentDiv) {
  if (!filePath) return;

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

  console.log("파일 경로:", filePath);
  console.log("찾은 챕터:", chapterFolder);

  if (!chapterFolder) return;

  // 챕터 경로에 있는 예제/실습 디렉토리 검사
  const exampleDirectories = [
    {
      name: "예제 코드",
      path: `/content/chapters/${chapterFolder}/example`,
      priority: 1,
    },
    {
      name: "실습 코드",
      path: `/content/chapters/${chapterFolder}/practice`,
      priority: 2,
    },
  ];

  // 예제 디렉토리가 존재하는지 확인
  Promise.all(
    exampleDirectories.map((dir) =>
      fetch(`${dir.path}/`)
        .then((response) => {
          console.log(`디렉토리 ${dir.path} 체크 결과:`, response.ok);
          return { dir, exists: response.ok };
        })
        .catch((error) => {
          console.error(`디렉토리 ${dir.path} 체크 오류:`, error);
          return { dir, exists: false };
        })
    )
  ).then(async (results) => {
    // 존재하는 디렉토리만 필터링
    const availableDirs = results
      .filter((result) => result.exists)
      .map((result) => result.dir);

    console.log("사용 가능한 디렉토리:", availableDirs);

    if (availableDirs.length > 0) {
      // 예제 파일 목록 확인
      const examples = await getExamples(availableDirs, chapterFolder);
      console.log("찾은 예제:", examples);

      if (examples.length > 0) {
        // 템플릿 로드 및 DOM에 추가
        console.log("템플릿 로드 시도:", "./code-runner.html");
        const templateResponse = await fetch("./code-runner.html");
        console.log("템플릿 로드 결과:", templateResponse.ok);
        if (templateResponse.ok) {
          const templateHtml = await templateResponse.text();
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = templateHtml;
          const exampleSection = tempDiv.firstElementChild;

          // 예제 옵션 추가
          populateExampleOptions(examples, exampleSection);

          // 이벤트 리스너 설정
          setupEventListeners(exampleSection);

          // 콘텐츠에 추가
          contentDiv.appendChild(exampleSection);
        } else {
          console.error("예제 실행기 템플릿을 로드할 수 없습니다.");
        }
      }
    }
  });
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
 * 챕터의 예제 파일 목록을 가져오는 함수
 * @param {Array} directories - 예제 디렉토리 목록
 * @param {string} chapterFolder - 챕터 폴더명
 * @returns {Promise<Array>} 예제 파일 목록
 */
async function getExamples(directories, chapterFolder) {
  const examples = [];

  // 디렉토리 우선순위에 따라 정렬
  directories.sort((a, b) => a.priority - b.priority);

  for (const dir of directories) {
    // example 디렉토리의 경우 index.html 파일이 있는지 확인
    if (dir.path.endsWith("example")) {
      try {
        const response = await fetch(`${dir.path}/index.html`);
        if (response.ok) {
          const text = await response.text();
          const title = extractTitle(text) || "기본 예제";

          examples.push({
            name: title,
            path: `${dir.path}/index.html`,
            type: "example",
            priority: 1,
          });
        }
      } catch (error) {
        console.error("예제 파일 확인 중 오류:", error);
      }
    }

    // practice 디렉토리의 경우 html 하위 디렉토리 확인
    if (dir.path.endsWith("practice")) {
      try {
        const htmlPath = `${dir.path}/html`;
        const response = await fetch(`${htmlPath}/`);

        if (response.ok) {
          // practice/html 디렉토리 내 예제 파일 목록 가져오기
          // 참고: 실제로는 서버 측 스크립트를 통해 디렉토리 내용을 가져와야 함
          // 여기서는 일부 고정 패턴의 파일만 확인

          const commonExampleNames = [
            "index.html",
            "getForm.html",
            "modal.html",
            "carousel.html",
            "keycode.html",
            "quiz-1.html",
            "quiz-2.html",
          ];

          // 메인 인덱스 파일 먼저 확인 (우선순위 높음)
          const indexResponse = await fetch(`${htmlPath}/index.html`);
          if (indexResponse.ok) {
            const indexText = await indexResponse.text();
            const indexTitle = extractTitle(indexText) || "모든 예제";

            examples.push({
              name: indexTitle,
              path: `${htmlPath}/index.html`,
              type: "practice",
              isIndex: true,
              priority: 2,
            });
          }

          // 다른 예제 파일 확인
          const fileChecks = await Promise.all(
            commonExampleNames
              .filter((name) => name !== "index.html") // 인덱스는 이미 처리함
              .map(async (filename) => {
                try {
                  const fileResponse = await fetch(`${htmlPath}/${filename}`);
                  if (fileResponse.ok) {
                    const fileText = await fileResponse.text();
                    const fileTitle =
                      extractTitle(fileText) || filename.replace(".html", "");

                    return {
                      filename,
                      exists: true,
                      title: fileTitle,
                    };
                  }
                  return { filename, exists: false };
                } catch (error) {
                  return { filename, exists: false };
                }
              })
          );

          // 존재하는 파일만 목록에 추가
          fileChecks
            .filter((file) => file.exists)
            .forEach((file) => {
              examples.push({
                name: file.title,
                path: `${htmlPath}/${file.filename}`,
                type: "practice",
                priority: 3,
              });
            });
        }
      } catch (error) {
        console.error("practice 디렉토리 확인 중 오류:", error);
      }
    }
  }

  // 우선순위에 따라 정렬
  examples.sort((a, b) => a.priority - b.priority);

  return examples;
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
  titleElement.textContent = `${title} 미리 보기`;

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
