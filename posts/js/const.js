const BASE_POSTS = [
  {
    title: "00-1 웹 기초",
    link: "./posts.html?file=00/1.md",
    snippet:
      "웹의 기본적인 동작 원리와 HTML, CSS, JavaScript의 역할을 소개합니다.",
    date: "2025년 3월 1일 ~ 2025년 3월 17일",
    tags: ["Chapter 0"],
    chapter: "00",
  },
  {
    title: "00-2 웹 프론트엔드",
    link: "./posts.html?file=00/2.md",
    snippet:
      "HTML5의 주요 특징과 웹소켓을 이용한 실시간 양방향 통신을 소개합니다.",
    date: "2025년 3월 5일 ~ 2025년 3월 17일",
    tags: ["Chapter 0"],
    chapter: "00",
  },
  {
    title: "01 자바스크립트 시작하기",
    link: "./posts.html?file=01/index.md",
    snippet:
      "자바스크립트의 기본 문법과 개발 환경 설정 방법을 학습합니다. 콘솔 사용법과 기본적인 디버깅 방법을 익힙니다.",
    date: "2025년 3월 9일 ~ 2025년 3월 24일",
    tags: ["Chapter 1"],
    chapter: "01",
  },
  {
    title: "02 프로그래밍의 기본, 변수와 자료형 살펴보기",
    link: "./posts.html?file=02/index.md",
    snippet:
      "프로그래밍의 기본 개념과 변수와 자료형에 대해 알아봅니다. 프로그래밍에서 변수와 자료형의 역할과 사용 방법을 배웁니다.",
    date: "2025년 3월 16일 ~ 2025년 3월 31일",
    tags: ["Chapter 2"],
    chapter: "02",
  },
  {
    title: "03 연산자와 제어문",
    link: "./posts.html?file=03/index.md",
    snippet:
      "연산자와 제어문에 대해 알아봅니다. 프로그래밍에서 사용되는 연산자와 제어문의 종류와 사용 방법을 배웁니다.",
    date: "2025년 3월 16일 ~ 2025년 3월 31일",
    tags: ["Chapter 3"],
    chapter: "03",
  },
  {
    title: "04 프로그래밍 한발 더 나가기, 함수와 스코프",
    link: "./posts.html?file=04/index.md",
    snippet:
      "함수와 스코프에 대해 알아봅니다. 프로그래밍에서 함수와 스코프의 역할과 사용 방법을 배웁니다.",
    date: "2025년 3월 25일",
    tags: ["Chapter 4"],
    chapter: "04",
  },
  {
    title: "05 DOM의 기초",
    link: "./posts.html?file=05/index.md",
    snippet:
      "DOM의 기본 개념과 역할에 대해 알아봅니다. 웹 페이지의 구조와 스크립트를 통해 DOM을 다루는 방법을 배웁니다.",
    date: "2025년 4월 5일 ~ 2025년 4월 14일",
    tags: ["Chapter 5", "DOM"],
    chapter: "05",
  },
  {
    title: "06 이벤트와 이벤트 처리기",
    link: "./posts.html?file=06/index.md",
    snippet:
      "이벤트와 이벤트 처리기에 대해 알아봅니다. 웹 페이지에서 발생하는 이벤트와 이벤트 처리기의 사용 방법을 배웁니다.",
    date: "2025년 4월 6일 ~ 2025년 4월 21일",
    tags: ["Chapter 6"],
    chapter: "06",
  },
  {
    title: "07 DOM 활용하기",
    link: "./posts.html?file=07/index.md",
    snippet:
      "DOM을 활용하여 웹 페이지를 동적으로 변경하는 방법에 대해 알아봅니다. 스크립트를 통해 DOM을 조작하는 방법을 배웁니다.",
    date: "2025년 4월 6일 ~ 2025년 4월 21일",
    tags: ["Chapter 7", "DOM"],
    chapter: "07",
  },
  {
    title: "08 자주 사용하는 내장 객체 알아보기",
    link: "./posts.html?file=08/index.md",
    snippet:
      "자주 사용하는 내장 객체에 대해 알아봅니다. JavaScript에서 제공하는 내장 객체의 종류와 사용 방법을 배웁니다.",
    date: "2025년 4월 28일 ~ 2025년 5월 5일",
    tags: ["Chapter 8", "객체"],
    chapter: "08",
  },
  {
    title: "09 자바스크립트 객체 만들기",
    link: "./posts.html?file=09/index.md",
    snippet:
      "자바스크립트에서 객체를 만드는 방법에 대해 알아봅니다. 객체의 생성과 프로퍼티 추가, 메소드 추가 방법을 배웁니다.",
    date: "2025년 5월 4일 ~ 2025년 5월 12일",
    tags: ["Chapter 9", "객체"],
    chapter: "09",
  },
  {
    title: "10 효율적으로 문자열과 배열 활용하기",
    link: "./posts.html?file=10/index.md",
    snippet:
      "문자열과 배열을 효율적으로 활용하는 방법에 대해 알아봅니다. 문자열 조작과 배열의 사용 방법을 배웁니다.",
    date: "2025년 5월 4일 ~ 2025년 5월 12일",
    tags: ["Chapter 10", "객체"],
    chapter: "10",
  },
  {
    title: "11 배열과 객체, 좀 더 깊게 살펴보기",
    link: "./posts.html?file=11/index.md",
    snippet:
      "배열과 객체에 대해 더 깊게 살펴보고, 배열과 객체의 차이점과 사용 방법을 배웁니다.",
    date: "2025년 5월 4일 ~ 2025년 5월 12일",
    tags: ["Chapter 11", "객체"],
    chapter: "11",
  },
  {
    title: "12 HTTP 통신과 JSON",
    link: "./posts.html?file=12/index.md",
    snippet:
      "HTTP 통신과 JSON에 대해 알아봅니다. 웹 페이지와 서버 간의 통신 방법과 JSON의 형식과 사용 방법을 배웁니다.",
    date: "2025년 5월 6일 ~ 2025년 5월 19일",
    tags: ["Chapter 12"],
    chapter: "12",
  },
  {
    title: "13 비동기 프로그래밍",
    link: "./posts.html?file=13/index.md",
    snippet:
      "비동기 프로그래밍에 대해 알아봅니다. 비동기 프로그래밍의 개념과 장단점, 그리고 사용 방법을 배웁니다.",
    date: "2025년 5월 13일 ~ 2025년 5월 26일",
    tags: ["Chapter 13"],
    chapter: "13",
  },
  {
    title: "14 캔버스로 도형, 텍스트, 이미지 그리기",
    link: "./posts.html?file=14/index.md",
    snippet:
      "캔버스를 활용하여 도형, 텍스트, 이미지를 그리는 방법에 대해 알아봅니다. 캔버스 API를 사용하여 그래픽을 그리는 방법을 배웁니다.",
    date: "2025년 5월 11일 ~ 2025년 5월 26일",
    tags: ["Chapter 14", "캔버스"],
    chapter: "14",
  },
  {
    title: "17 웹 API 활용하기",
    link: "./posts.html?file=17/",
    snippet:
      "웹 API에 대해 알아봅니다. 웹 API의 개념과 종류, 그리고 웹 API를 활용하여 웹 페이지를 개선하는 방법을 배웁니다.",
    date: "2025년 5월 14일 ~ 2025년 6월 2일",
    tags: ["Chapter 17", "API"],
    chapter: "17",
  },
  {
    title: "18 공개 API 활용하기",
    link: "./posts.html?file=18/",
    snippet:
      "공개 API에 대해 알아봅니다. 공개 API의 개념과 종류, 그리고 공개 API를 활용하여 웹 페이지를 개선하는 방법을 배웁니다.",
    date: "2025년 5월 14일 ~ 2025년 6월 9일",
    tags: ["Chapter 18", "API"],
    chapter: "18",
  },
];

/**
 * 챕터 유틸리티 함수들
 */
const ChapterUtils = {
  /**
   * BASE_POSTS에서 모든 챕터 정보를 추출
   * @returns {Array} 정렬된 챕터 배열
   */
  getAllChapters() {
    const chapters = [...new Set(BASE_POSTS.map((post) => post.chapter))];
    return chapters.sort((a, b) => parseInt(a) - parseInt(b));
  },

  /**
   * 챕터 번호를 영어 형식으로 변환 (예: "01" -> "Chapter 1")
   * @param {string} chapterNum - 챕터 번호
   * @returns {string} 영어 챕터 형식
   */
  formatChapterName(chapterNum) {
    const num = parseInt(chapterNum);
    return `Chapter ${num}`;
  },

  /**
   * 모든 챕터의 옵션 데이터를 생성
   * @returns {Array} 챕터 옵션 배열
   */
  getChapterOptions() {
    const chapters = this.getAllChapters();
    return chapters.map((chapterNum) => ({
      value: this.formatChapterName(chapterNum),
      text: this.formatChapterName(chapterNum),
    }));
  },

  /**
   * 챕터별 포스트 개수를 계산
   * @param {Array} posts - 포스트 배열
   * @returns {Object} 챕터별 포스트 개수 객체
   */
  getChapterPostCounts(posts) {
    const counts = {};
    posts.forEach((post) => {
      post.tags.forEach((tag) => {
        if (tag.includes("Chapter")) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      });
    });
    return counts;
  },
};

/**
 * Practice 폴더가 있는 챕터들을 자동으로 감지하는 함수
 * @returns {Promise<Array>} practice 폴더가 있는 챕터 번호 배열
 */
async function detectChaptersWithPractice() {
  const chaptersWithPractice = [];
  const allChapters = ChapterUtils.getAllChapters();

  for (const chapterNum of allChapters) {
    try {
      const practiceIndexPath = `../chapters/${chapterNum}/practice/index.html`;
      const response = await fetch(practiceIndexPath);
      if (response.ok) {
        chaptersWithPractice.push(chapterNum);
      }
    } catch (error) {
      console.log(`${chapterNum}장에는 practice 폴더가 없습니다.`);
    }
  }

  return chaptersWithPractice;
}

/**
 * 포스트 데이터를 생성하는 함수
 * @returns {Promise<Array>} 생성된 포스트 배열
 */
async function generatePosts() {
  const posts = [...BASE_POSTS];
  const chaptersWithPractice = await detectChaptersWithPractice();

  chaptersWithPractice.forEach((chapterNum) => {
    const basePost = BASE_POSTS.find((post) => post.chapter === chapterNum);

    if (basePost) {
      const practicePost = {
        title: `${basePost.title} - 예제 실습`,
        link: `../chapters/${chapterNum}/practice/index.html`,
        snippet: `${basePost.title}의 예제 코드를 직접 실행하고 실습해 볼 수 있습니다.`,
        date: basePost.date,
        tags: [...basePost.tags, "실습"],
        chapter: chapterNum,
        type: "practice",
      };

      posts.push(practicePost);
    }
  });

  return posts.sort((a, b) => {
    const chapterA = parseInt(a.chapter);
    const chapterB = parseInt(b.chapter);

    if (chapterA !== chapterB) {
      return chapterA - chapterB;
    }

    if (a.type === "practice" && b.type !== "practice") return 1;
    if (a.type !== "practice" && b.type === "practice") return -1;

    return 0;
  });
}

let POSTS = [];

generatePosts()
  .then((posts) => {
    POSTS = posts;
    if (typeof window !== "undefined") {
      window.POSTS = POSTS;
      window.ChapterUtils = ChapterUtils;
      if (typeof window.updatePosts === "function") {
        window.updatePosts();
      }
    }
  })
  .catch((error) => {
    console.error("POSTS 생성 중 오류:", error);
    POSTS = BASE_POSTS; // 오류 시 기본 포스트만 사용
    if (typeof window !== "undefined") {
      window.POSTS = POSTS;
      window.ChapterUtils = ChapterUtils;
      if (typeof window.updatePosts === "function") {
        window.updatePosts();
      }
    }
  });

export { POSTS, ChapterUtils };
