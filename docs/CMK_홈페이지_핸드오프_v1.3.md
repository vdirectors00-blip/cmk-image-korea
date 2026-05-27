# CMK 이미지코리아 홈페이지 리뉴얼 — Claude Code 핸드오프

> 이 문서를 위에서부터 읽고 작업하면 됨. 모든 결정은 확정된 상태.
> 미확정 항목은 ⚠️ **CLIENT INPUT NEEDED** 박스로 명시되어 있으며, 그 부분은 placeholder로 두고 진행.

---

## 0. 한눈에 보기

| 항목 | 값 |
|---|---|
| 프로젝트명 | CMK Image Korea 홈페이지 리뉴얼 |
| 클라이언트 | (주) CMK 이미지코리아 (대표 조미경) |
| 제작사 | (주) 브이디렉터스 (V-Directors) |
| 도메인 | `cmkimage.co.kr` (기존 도메인 유지) |
| 디자인 톤 | 매거진 (W·Vogue·Marie Claire 풍, 누드·차콜) |
| 핵심 메시지 | "보이는 것이, 전해지는 것입니다 / What is seen is what is communicated." |
| 비즈니스 핵심 | **임직원 단위 기업 출강 컨설팅 (99%)** |
| 1차 오픈 페이지 | HOME · ABOUT · CONSULTING · ACADEMY · COMMUNITY · CONTACT |
| 2차 (조건부) | IMAGE LAB (자료 들어오면 활성화, 골격은 1차에 포함) |
| 다국어 | 한국어(기본) + 중국어 (URL 분리 `/zh`, UI는 토글) |

---

## 1. 기술 스택

### 1.1 프론트엔드
- **Astro 5.x** (정적 사이트 생성기)
- **TypeScript**
- **Tailwind CSS 4.x** (디자인 시스템 토큰화)
- **Pretendard** (Korean web font, via CDN)
- **Cormorant Garamond** (Serif, via Google Fonts) — 영문 큰 타이틀용
- **Framer Motion 또는 Motion One** (스크롤·트랜지션 애니메이션, 가벼운 거 선택)

### 1.2 콘텐츠 관리
- **Sanity Studio v3** (headless CMS)
- Sanity 무료 티어 (월 10만 API call, 3 user, 1 dataset)
- **@sanity/client** (Astro에서 데이터 fetch)
- **@sanity/image-url** (이미지 URL 빌더)
- **i18n은 커스텀 `localeString` 객체 단일 패턴** 사용 (§4.2 참조). 별도 i18n 플러그인은 사용하지 않음 — 언어가 KO/中 2개로 고정이고 쿼리·타입이 단순함.

### 1.3 폼 백엔드
- **Cloudflare Workers** (서버리스 API, 무료 티어 10만 req/일)
- **Resend API** (이메일 발송, 월 3,000건 무료)
- 향후 **Solapi** (카카오 알림톡) 추가 — v1에서는 이메일만

### 1.4 배포
- **GitHub** (저장소)
- **GitHub Actions** (자동 빌드)
- **FTP-Deploy-Action** → **Cafe24 호스팅** (정적 파일 서빙)
- **Cafe24 SSL** 적용 (도메인 인증서 무료 제공분 사용)

### 1.5 Node 버전
- **Node 20 LTS**

---

## 2. 디렉토리 구조

```
cmkimage/
├── apps/
│   ├── web/                          # Astro 사이트
│   │   ├── public/
│   │   │   ├── fonts/                # Pretendard 폰트 파일
│   │   │   └── favicon.ico
│   │   ├── src/
│   │   │   ├── components/           # 재사용 컴포넌트
│   │   │   │   ├── layout/
│   │   │   │   │   ├── Header.astro
│   │   │   │   │   ├── Footer.astro
│   │   │   │   │   └── LangToggle.astro
│   │   │   │   ├── home/
│   │   │   │   │   ├── Hero.astro
│   │   │   │   │   ├── ColorQuiz.tsx     # React island (interactive)
│   │   │   │   │   ├── ServiceCards.astro
│   │   │   │   │   ├── LogoWall.astro
│   │   │   │   │   ├── StatsCounter.tsx  # React island
│   │   │   │   │   └── CeoIntro.astro
│   │   │   │   ├── about/
│   │   │   │   │   ├── BrandPhilosophy.astro
│   │   │   │   │   ├── CeoProfile.astro
│   │   │   │   │   ├── HistoryTimeline.astro
│   │   │   │   │   └── PeopleGrid.astro
│   │   │   │   ├── forms/
│   │   │   │   │   ├── PersonalForm.tsx
│   │   │   │   │   ├── CorporateForm.tsx
│   │   │   │   │   └── AcademyForm.tsx
│   │   │   │   └── common/
│   │   │   │       ├── SectionTitle.astro
│   │   │   │       ├── Button.astro
│   │   │   │       ├── Card.astro
│   │   │   │       └── SEO.astro
│   │   │   ├── layouts/
│   │   │   │   └── BaseLayout.astro
│   │   │   ├── pages/
│   │   │   │   ├── index.astro                    # HOME (KO)
│   │   │   │   ├── about.astro
│   │   │   │   ├── consulting/index.astro
│   │   │   │   ├── consulting/[slug].astro        # 동적: 기업 출강, 임원 PI, 등
│   │   │   │   ├── academy/index.astro
│   │   │   │   ├── academy/[slug].astro
│   │   │   │   ├── image-lab/index.astro
│   │   │   │   ├── image-lab/[slug].astro
│   │   │   │   ├── community/index.astro
│   │   │   │   ├── community/[slug].astro
│   │   │   │   ├── contact.astro
│   │   │   │   ├── color-quiz/result/[type].astro # 16타입 결과 페이지
│   │   │   │   └── zh/                            # 중국어 (구조 동일하게 미러)
│   │   │   │       ├── index.astro
│   │   │   │       ├── about.astro
│   │   │   │       └── ...
│   │   │   ├── lib/
│   │   │   │   ├── sanity.ts          # Sanity client
│   │   │   │   ├── queries.ts         # GROQ queries 모음
│   │   │   │   ├── image.ts           # 이미지 URL 빌더
│   │   │   │   ├── i18n.ts            # 다국어 헬퍼
│   │   │   │   └── color-quiz.ts      # 퀴즈 로직
│   │   │   ├── styles/
│   │   │   │   └── global.css         # Tailwind + 커스텀 변수
│   │   │   └── types/
│   │   │       └── sanity.ts          # Sanity 타입 정의
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.mjs
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── studio/                        # Sanity Studio
│   │   ├── schemas/
│   │   │   ├── index.ts
│   │   │   ├── documents/
│   │   │   │   ├── page.ts
│   │   │   │   ├── service.ts
│   │   │   │   ├── academyCourse.ts
│   │   │   │   ├── post.ts
│   │   │   │   ├── labArticle.ts
│   │   │   │   ├── person.ts
│   │   │   │   ├── clientLogo.ts
│   │   │   │   ├── stat.ts
│   │   │   │   ├── contactInquiry.ts
│   │   │   │   └── siteSettings.ts
│   │   │   └── objects/
│   │   │       ├── localeString.ts
│   │   │       ├── localeText.ts
│   │   │       ├── localeBlockContent.ts
│   │   │       ├── seo.ts
│   │   │       └── ctaBlock.ts
│   │   ├── sanity.config.ts
│   │   ├── sanity.cli.ts
│   │   └── package.json
│   │
│   └── worker/                        # Cloudflare Worker (폼 API)
│       ├── src/
│       │   └── index.ts
│       ├── wrangler.toml
│       └── package.json
│
├── .github/
│   └── workflows/
│       ├── deploy-web.yml             # Astro → Cafe24 FTP
│       └── deploy-worker.yml          # CF Worker 배포
│
├── .gitignore
├── README.md
└── pnpm-workspace.yaml                # 또는 npm workspaces
```

---

## 3. 디자인 시스템

### 3.1 디자인 토큰 (Tailwind v4 CSS-first)

Tailwind v4부터는 JS config(`tailwind.config.mjs`)가 사실상 제거되고, CSS 안에서 `@theme` 블록으로 토큰을 선언한다. **이 프로젝트는 v4 CSS-first 패턴을 따른다.** (v3 패턴인 `theme.extend.colors`는 사용 금지.)

`src/styles/global.css`:

```css
@import "tailwindcss";

/* ============================================================
 * @theme — Tailwind 유틸리티로 자동 노출되는 토큰
 *   변수명이 곧 유틸리티 이름:
 *     --color-cream  →  bg-cream / text-cream / border-cream
 *     --font-serif   →  font-serif
 * ============================================================ */
@theme {
  /* Surfaces */
  --color-background:  #FFFFFF;
  --color-cream:       #FAF8F4;
  --color-panel:       #F7F4EE;
  --color-dark:        #121212;

  /* Text */
  --color-foreground:  #0F0F0F;
  --color-soft:        #2A2A2A;
  --color-muted:       #6B6B6B;
  --color-faint:       #A8A8A8;
  --color-on-dark:     #F5EFE6;

  /* Accent */
  --color-accent:      #A8866C;  /* warm taupe */
  --color-accent-dark: #5C3D27;  /* deep brown */

  /* Lines */
  --color-line:        #E5E1D9;
  --color-edge:        #ECE7DD;

  /* Typography */
  --font-sans:  "Pretendard Variable", Pretendard, system-ui, sans-serif;
  --font-serif: "Cormorant Garamond", "Noto Serif KR", Georgia, serif;
}

/* ============================================================
 * :root — 유틸리티화하지 않는 일반 CSS 변수
 *   레이아웃 상수, 이징 등 직접 var(--…)로만 쓰는 값들
 * ============================================================ */
:root {
  --container-max:     1280px;
  --container-padding: clamp(1.25rem, 4vw, 2.5rem);
  --ease-out-soft:     cubic-bezier(0.16, 1, 0.3, 1);
}
```

**사용 예시 (유틸리티 자동 생성):**
```html
<section class="bg-cream text-foreground">
  <h2 class="font-serif text-soft">매거진의 호흡으로</h2>
  <p class="text-muted">…</p>
  <hr class="border-line" />
</section>
```

**`tailwind.config.mjs` 처리:**
- v4에서는 **제거 또는 빈 파일로 유지**한다.
- 필요한 경우(예: plugin 추가)에만 `import "tailwindcss";`만 들어있는 형태로 두며, 토큰 정의는 절대 JS에 두지 않는다.
- 콘텐츠 파일 자동 탐지를 v4가 처리하므로 `content: [...]` 도 필요 없다.

**작명 원칙:**
- `--color-bg-*` / `--color-text-*` 같은 접두사 중첩은 v4 유틸리티에서 `bg-bg-*`, `text-text-*`처럼 어색해진다. 위와 같이 의미 기반 단일 키워드(`cream`, `panel`, `muted`, `faint`, `line`, `edge`)로 평탄화했다.
- Border 색 키워드로 `border`는 Tailwind 예약어와 충돌 위험이 있어 `line` / `edge`로 명명.

### 3.2 타이포그래피

| 용도 | 폰트 | 크기 | weight | letter-spacing |
|---|---|---|---|---|
| Hero 대제목 (영문/숫자) | Cormorant Garamond Italic | clamp(48px, 8vw, 120px) | 500 | -0.02em |
| Hero 한글 | Pretendard | clamp(28px, 5vw, 56px) | 300 | -0.015em |
| 섹션 타이틀 | Cormorant Garamond | clamp(32px, 4vw, 56px) | 400 | -0.01em |
| Eyebrow (라벨) | Pretendard | 11px | 600 | 0.18em (uppercase) |
| Body large | Pretendard | 17px | 400 | 0 |
| Body | Pretendard | 15px | 400 | 0 |
| Body small | Pretendard | 13px | 400 | 0 |
| Caption | Pretendard | 11px | 400 | 0.04em |

기본 line-height: 본문 1.7, 타이틀 1.15

### 3.3 간격 (Spacing scale)

Tailwind 기본 사용 (4px 단위). 섹션 간격은:
- 모바일: `py-16` (64px)
- 태블릿: `py-24` (96px)
- 데스크탑: `py-32` (128px)

### 3.4 그리드 & 컨테이너

- 컨테이너 max-width: `1280px`
- 좌우 패딩: `clamp(1.25rem, 4vw, 2.5rem)` (모바일 20px → 데스크탑 40px)
- 12컬럼 grid, gap `24px` (데스크탑) / `16px` (모바일)

### 3.5 모션

- 기본 트랜지션: `200ms var(--ease-out-soft)`
- 스크롤 reveal: `IntersectionObserver` 기반 fade-up 30px, 600ms
- 호버: 살짝 상승 (`translateY(-2px)`) + 그림자 부드럽게

### 3.6 이미지 정책

- 모든 이미지는 Sanity CDN을 통해 서빙
- 표준 비율: 인물 풀스크린 (3:4), 카드 (4:5), 와이드 (16:9), 정방형 (1:1)
- `<img loading="lazy">` 기본
- `srcset` + `sizes`로 반응형 (Sanity URL 빌더에 width 파라미터 추가)
- 빈 자리 (사진 미수령 시): `bg-cream` + 우측 하단 작은 글씨 "Photo: Coming Soon"

---

## 4. Sanity Studio 설정

### 4.1 프로젝트 초기화

```bash
# studio 디렉토리에서
npm create sanity@latest -- --template clean --create-project "CMK Image Korea" --dataset production
```

`sanity.config.ts` 핵심:
```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "default",
  title: "CMK Image Korea",
  projectId: "YOUR_PROJECT_ID",
  dataset: "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("사이트 설정").child(
              S.document().schemaType("siteSettings").documentId("siteSettings")
            ),
            S.divider(),
            S.documentTypeListItem("page").title("페이지"),
            S.documentTypeListItem("service").title("컨설팅 영역"),
            S.documentTypeListItem("academyCourse").title("Academy 강좌"),
            S.documentTypeListItem("post").title("CMK NEWS"),
            S.documentTypeListItem("labArticle").title("Image Lab 글"),
            S.documentTypeListItem("person").title("인물 (CEO·강사진)"),
            S.documentTypeListItem("clientLogo").title("거래 기업 로고"),
            S.documentTypeListItem("stat").title("누적 수치"),
            S.divider(),
            S.documentTypeListItem("contactInquiry").title("문의 내역 (자동)"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
```

> ⚠️ **i18n 패턴 결정 (v1.2 확정)**: `sanity-plugin-internationalized-array` 같은 플러그인은 **사용하지 않는다**. 모든 다국어 필드는 §4.2의 커스텀 객체(`localeString` / `localeText` / `localeBlockContent`) 한 가지 패턴으로만 정의한다. 두 방식을 혼용하면 GROQ 쿼리·타입 추론·Studio UX가 모두 어긋난다.

### 4.2 다국어 헬퍼 오브젝트 (i18n 단일 패턴)

모든 다국어 필드는 아래 세 객체(`localeString` / `localeText` / `localeBlockContent`) 중 하나로만 선언한다. 데이터 모양은 `{ ko: "...", zh: "..." }` 평탄 객체이며, GROQ에서는 `title.ko` 처럼 직접 접근 가능.

`schemas/objects/localeString.ts`:
```ts
import { defineType } from "sanity";

export default defineType({
  name: "localeString",
  title: "Locale String",
  type: "object",
  fields: [
    { name: "ko", title: "한국어", type: "string", validation: r => r.required() },
    { name: "zh", title: "中文", type: "string" },
  ],
  options: { collapsible: true, collapsed: false },
});
```

`localeText.ts`와 `localeBlockContent.ts`도 동일한 패턴 (각각 `type: text`, `type: array of block`).

### 4.3 스키마 — Document Types

#### 4.3.1 `siteSettings` (싱글톤)
```ts
{
  name: "siteSettings",
  type: "document",
  fields: [
    { name: "companyName",  type: "localeString", title: "회사명" },
    { name: "tagline",      type: "localeString", title: "태그라인" },
    { name: "phone",        type: "string",       title: "대표 전화" },
    { name: "email",        type: "string",       title: "대표 이메일" },
    { name: "address",      type: "localeString", title: "주소" },
    { name: "kakaoChannel", type: "url",          title: "카카오 채널 URL" },
    { name: "instagram",    type: "url",          title: "Instagram URL" },
    { name: "youtube",      type: "url",          title: "YouTube URL" },
    { name: "businessNo",   type: "string",       title: "사업자등록번호" },
    { name: "ceo",          type: "string",       title: "대표자명" },
    { name: "privacyPolicy",type: "localeBlockContent", title: "개인정보처리방침" },
    { name: "termsOfUse",   type: "localeBlockContent", title: "이용약관" },
    { name: "defaultOg",    type: "image",        title: "기본 OG 이미지" },
  ],
}
```

#### 4.3.2 `service` (컨설팅 영역)
```ts
{
  name: "service",
  type: "document",
  fields: [
    { name: "title",       type: "localeString",      title: "서비스명" },
    { name: "slug",        type: "slug",              source: "title.ko" },
    { name: "subtitle",    type: "localeString",      title: "부제" },
    { name: "category",    type: "string",            title: "카테고리",
      options: { list: [
        { title: "기업 출강", value: "corporate" },
        { title: "임원 PI",   value: "executive" },
        { title: "기관·공공", value: "public" },
        { title: "미디어",    value: "media" },
      ]}
    },
    { name: "isFeatured",  type: "boolean",           title: "메인 강조 (FEATURED)" },
    { name: "heroImage",   type: "image",             title: "히어로 이미지", options: { hotspot: true } },
    { name: "summary",     type: "localeText",        title: "요약 (카드용, 2~3줄)" },
    { name: "body",        type: "localeBlockContent",title: "본문" },
    { name: "highlights",  type: "array", of: [{ type: "localeString" }], title: "핵심 포인트 (3~5개)" },
    { name: "ctaText",     type: "localeString",      title: "CTA 버튼 텍스트" },
    { name: "order",       type: "number",            title: "정렬 순서" },
    { name: "seo",         type: "seo",               title: "SEO" },
  ],
  orderings: [{ title: "정렬 순서", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
}
```

#### 4.3.3 `academyCourse`
```ts
{
  name: "academyCourse",
  type: "document",
  fields: [
    { name: "title",         type: "localeString",      title: "과정명" },
    { name: "slug",          type: "slug",              source: "title.ko" },
    { name: "level",         type: "string",
      options: { list: ["기초/입문", "심화", "실기", "강사양성"] } },
    { name: "summary",       type: "localeText",        title: "요약" },
    { name: "curriculum",    type: "localeBlockContent",title: "커리큘럼 상세" },
    { name: "duration",      type: "string",            title: "기간 (예: 8주)" },
    { name: "schedule",      type: "string",            title: "일정 (예: 매주 화 14:00–17:00)" },
    { name: "tuition",       type: "number",            title: "수강료 (원)" },
    { name: "tuitionNote",   type: "localeString",      title: "수강료 비고 (예: 부가세 포함)" },
    { name: "capacity",      type: "number",            title: "정원" },
    { name: "instructor",    type: "reference", to: [{ type: "person" }], title: "강사" },
    { name: "certificate",   type: "localeString",      title: "자격증 발행기관 (외부 기관명)" },
    { name: "isOpen",        type: "boolean",           title: "현재 모집중" },
    { name: "order",         type: "number",            title: "정렬" },
  ],
}
```

> ⚠️ **CLIENT INPUT NEEDED**: 각 과정의 `tuition`, `schedule`, `certificate` 발행기관명은 고객 확인 필요. 임시값으로 `0`, `"일정 협의"`, `"외부 인증기관"`을 넣어두고 진행.

#### 4.3.4 `post` (CMK NEWS)
```ts
{
  name: "post",
  type: "document",
  fields: [
    { name: "title",     type: "localeString",       title: "제목" },
    { name: "slug",      type: "slug",               source: "title.ko" },
    { name: "category",  type: "string",
      options: { list: ["공지", "행사", "수상·인증", "강의·미디어", "인터뷰·기고"] } },
    { name: "coverImage",type: "image",              title: "대표 이미지", options: { hotspot: true } },
    { name: "excerpt",   type: "localeText",         title: "발췌 (목록용)" },
    { name: "body",      type: "localeBlockContent", title: "본문" },
    { name: "publishedAt", type: "datetime",         title: "게시일" },
    { name: "externalUrl", type: "url",              title: "외부 링크 (있다면)" },
  ],
  orderings: [
    { title: "최신순", name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }] },
  ],
}
```

#### 4.3.5 `labArticle` (Image Lab)
```ts
{
  name: "labArticle",
  type: "document",
  fields: [
    { name: "title",      type: "localeString",       title: "제목" },
    { name: "slug",       type: "slug",               source: "title.ko" },
    { name: "field",      type: "string",
      options: { list: ["퍼스널컬러", "스타일", "골격", "헤어", "기타"] } },
    { name: "coverImage", type: "image",              title: "대표 이미지" },
    { name: "author",     type: "reference", to: [{ type: "person" }] },
    { name: "excerpt",    type: "localeText" },
    { name: "body",       type: "localeBlockContent" },
    { name: "publishedAt",type: "datetime" },
  ],
}
```

#### 4.3.6 `person` (CEO·강사진)
```ts
{
  name: "person",
  type: "document",
  fields: [
    { name: "name",      type: "localeString", title: "이름" },
    { name: "nameEn",    type: "string",       title: "영문 이름" },
    { name: "title",     type: "localeString", title: "직함" },
    { name: "role",      type: "string",       title: "구분",
      options: { list: ["대표", "수석 강사", "강사", "파트너 컨설턴트"] } },
    { name: "image",     type: "image", options: { hotspot: true } },
    { name: "bio",       type: "localeBlockContent", title: "약력" },
    { name: "credentials", type: "array", of: [{ type: "localeString" }],
      title: "주요 경력·자격" },
    { name: "isCeo",     type: "boolean", title: "대표 표시" },
    { name: "order",     type: "number" },
  ],
}
```

#### 4.3.7 `clientLogo` (거래 기업)
```ts
{
  name: "clientLogo",
  type: "document",
  fields: [
    { name: "name",     type: "string", title: "기업명" },
    { name: "logo",     type: "image",  title: "로고 (SVG 권장)" },
    { name: "industry", type: "string", title: "업종",
      options: { list: ["대기업", "금융", "공공·관공서", "글로벌", "스타트업", "기타"] } },
    { name: "consentGiven", type: "boolean", title: "노출 동의 받음 (필수 체크)" },
    { name: "order",    type: "number" },
  ],
  preview: {
    select: { title: "name", media: "logo", subtitle: "industry" },
  },
}
```

> ⚠️ **CLIENT INPUT NEEDED**: 거래 기업 로고 게재 동의 리스트. `consentGiven: true`인 로고만 화면에 노출되도록 쿼리에서 필터링.

#### 4.3.8 `stat` (누적 수치)
```ts
{
  name: "stat",
  type: "document",
  fields: [
    { name: "label",  type: "localeString", title: "라벨 (예: 누적 교육 임직원 수)" },
    { name: "value",  type: "number",        title: "숫자값" },
    { name: "suffix", type: "string",        title: "단위 (예: 명, 개사, 회)" },
    { name: "order",  type: "number" },
  ],
}
```

#### 4.3.9 `contactInquiry` (폼 제출 결과 — 자동 생성)
```ts
{
  name: "contactInquiry",
  type: "document",
  fields: [
    { name: "kind",          type: "string", options: { list: ["personal", "corporate", "academy"] } },
    { name: "name",          type: "string" },
    { name: "phone",         type: "string" },
    { name: "email",         type: "string" },
    { name: "company",       type: "string", title: "회사명 (corporate)" },
    { name: "position",      type: "string", title: "직책 (corporate)" },
    { name: "expectedCount", type: "number", title: "예상 인원 (corporate)" },
    { name: "topic",         type: "text",   title: "교육 주제 (corporate)" },
    { name: "schedule",      type: "string", title: "희망 일정" },
    { name: "budgetRange",   type: "string", title: "예산 범위" },
    { name: "interest",      type: "string", title: "관심 영역 (personal)" },
    { name: "preferredCourse", type: "string", title: "희망 과정 (academy)" },
    { name: "message",       type: "text",   title: "추가 메모" },
    { name: "submittedAt",   type: "datetime" },
    { name: "status",        type: "string",
      options: { list: ["new", "contacted", "closed"] }, initialValue: "new" },
    { name: "source",        type: "string", title: "유입 경로 (color-quiz 등)" },
  ],
  preview: {
    select: { title: "name", subtitle: "kind", description: "submittedAt" },
  },
}
```

> Worker에서 폼 제출 시 자동으로 이 타입으로 document 생성. CMK 운영진은 Studio에서 새 문의 확인 가능.

#### 4.3.10 `page` (정적 페이지의 자유 섹션용)

페이지마다 고유 컴포넌트로 빌드하므로, `page` 타입은 **간단한 텍스트 페이지 (개인정보처리방침 등)에만** 사용:
```ts
{
  name: "page",
  type: "document",
  fields: [
    { name: "title", type: "localeString" },
    { name: "slug",  type: "slug", source: "title.ko" },
    { name: "body",  type: "localeBlockContent" },
    { name: "seo",   type: "seo" },
  ],
}
```

#### 4.3.11 SEO 오브젝트
```ts
{
  name: "seo",
  type: "object",
  fields: [
    { name: "metaTitle",       type: "localeString" },
    { name: "metaDescription", type: "localeText" },
    { name: "ogImage",         type: "image" },
    { name: "noIndex",         type: "boolean", initialValue: false },
  ],
}
```

---

## 5. URL 구조 & i18n

### 5.1 라우팅

| 한국어 (기본) | 중국어 |
|---|---|
| `/` | `/zh/` |
| `/about` | `/zh/about` |
| `/consulting` | `/zh/consulting` |
| `/consulting/corporate` | `/zh/consulting/corporate` |
| `/consulting/executive` | `/zh/consulting/executive` |
| `/consulting/public` | `/zh/consulting/public` |
| `/consulting/media` | `/zh/consulting/media` |
| `/academy` | `/zh/academy` |
| `/academy/[slug]` | `/zh/academy/[slug]` |
| `/image-lab` | `/zh/image-lab` |
| `/image-lab/[slug]` | `/zh/image-lab/[slug]` |
| `/community` | `/zh/community` |
| `/community/[slug]` | `/zh/community/[slug]` |
| `/contact` | `/zh/contact` |
| `/color-quiz/result/[type]` | `/zh/color-quiz/result/[type]` |
| `/privacy` | `/zh/privacy` |
| `/terms` | `/zh/terms` |

### 5.2 언어 토글 동작

Header 우측에 `KO / 中` 토글:
- 현재 페이지의 다른 언어 버전 URL로 이동
- 예: `/consulting/corporate` ↔ `/zh/consulting/corporate`
- localStorage에 마지막 선택 저장 (다음 방문 시 자동 리디렉션? — 1차에서는 안 함, 사용자 선택 존중)

### 5.3 `<html lang>` 속성

각 페이지 레이아웃에서 `<html lang="ko">` 또는 `<html lang="zh-CN">` 동적 설정.

### 5.4 hreflang 태그

각 페이지 `<head>`에:
```html
<link rel="alternate" hreflang="ko" href="https://cmkimage.co.kr/about" />
<link rel="alternate" hreflang="zh" href="https://cmkimage.co.kr/zh/about" />
<link rel="alternate" hreflang="x-default" href="https://cmkimage.co.kr/about" />
```

---

## 6. 페이지 명세

> 모든 페이지의 색·타이포·간격은 §3 디자인 시스템 적용.
> 각 섹션은 위에서 아래로 순서대로 배치.
> 모바일 뷰는 1컬럼으로 자연스럽게 떨어지도록 (CSS grid + flexbox).

### 6.1 HOME (`/`)

#### 섹션 1 — Hero (풀스크린)
- 좌측 60%: 풀스크린 인물 사진 (3:4 비율, Sanity에서 가져옴 / 없으면 무드 스톡)
- 우측 40%: 시적 카피
  - 영문 italic 대형: `What is seen is`
  - 다음 줄: `what is communicated.`
  - 그 아래 한글: `보이는 것이, 전해지는 것입니다.`
  - 그 아래 작게: `CMK IMAGE KOREA  ·  Since [연도]` ⚠️ 연도 확인 필요
- 스크롤 다운 인디케이터 (작은 ↓ + "Scroll")

#### 섹션 2 — 5초 퍼스널컬러 퀴즈 (인터랙티브)
- 섹션 타이틀: eyebrow "INTERACTIVE" + 큰 세리프 "5초 퍼스널컬러 진단"
- 부제: "당신의 컬러를 1분 안에"
- 큰 시작 버튼: `시작하기 →`
- 클릭 시 모달 또는 인라인 확장 → Q1~Q5 진행 (§9 참조)

#### 섹션 3 — 시그니처 서비스 4카드
- eyebrow "CONSULTING"
- 타이틀: "CMK가 제안하는 네 가지 길"
- 4카드 (Sanity `service` 컬렉션, `isFeatured` 기준 정렬):
  - 카드 1 (FEATURED, 크게): 기업 출강 컨설팅
  - 카드 2: 임원 PI
  - 카드 3: 기관·공공 출강
  - 카드 4: 미디어 트레이닝
- 각 카드: 이미지 + 카테고리 라벨 + 제목 + 요약 + `자세히 →` 링크

#### 섹션 4 — 거래 기업 로고월
- eyebrow "TRUSTED BY"
- 타이틀: "함께해 온 기업들" (또는 영문 "Selected Partners")
- 로고 그리드 (자동 슬라이드 또는 정적 6×N 그리드)
- Sanity `clientLogo` 중 `consentGiven == true` 만 노출
- 흑백 처리 후 hover 시 컬러로 (또는 그냥 흑백 유지)

#### 섹션 5 — 누적 수치
- 다크 배경 (`--color-bg-dark`)
- 3~4개 stat 큰 숫자
- 스크롤 인뷰 시 카운트업 애니메이션 (React island)
- 예시:
  - `12,000+` 누적 교육 임직원 수 ⚠️ 정확 수치 확인
  - `300+` 출강 기업 수 ⚠️
  - `30년` 헤리티지 ⚠️

#### 섹션 6 — CEO 조미경 소개 (짧게)
- 좌측: CEO 인물 사진
- 우측:
  - eyebrow "FOUNDER"
  - 큰 세리프 타이틀: "조미경"
  - 짧은 한 문단 (3~4줄, Sanity에서 가져옴)
  - `자세히 보기 →` → `/about`

#### 섹션 7 — Contact CTA (메인 푸터 직전)
- 다크 배경 또는 cream 배경
- 큰 카피: "지금, 상담을 시작합니다."
- 영문 부제: "Begin the conversation."
- 3개 버튼 (가로 정렬):
  - 개인 컨설팅 문의
  - **기업 출강 문의** (강조)
  - Academy 수강 문의

#### Footer
모든 페이지 공통. §8.2 참조.

---

### 6.2 ABOUT CMK (`/about`)

#### 섹션 1 — 페이지 헤더
- 풀폭 이미지 (인물 또는 무드)
- 큰 세리프: "About CMK"
- 짧은 한 줄: "한 사람의 이미지, 한 시대의 언어"

#### 섹션 2 — 브랜드 철학
- 좌측: eyebrow "PHILOSOPHY" + 큰 세리프 "이미지는, 언어다."
- 우측: 본문 (3~4문단, Sanity blockContent)
- 본문 하단: 3축 (Image · Identity · Influence)을 작은 카드 3개로

> ⚠️ **CLIENT INPUT NEEDED**: 브랜드 철학 본문 카피 — 현 cmkimage.co.kr의 텍스트 리라이팅하거나 신규 작성. 임시로는 매거진 톤의 placeholder 카피를 작성해 둘 것 ("CMK는 ~을 믿습니다" 형식).

#### 섹션 3 — CEO 조미경
- 좌측: 인물 사진 (3:4)
- 우측:
  - eyebrow "FOUNDER · CEO"
  - 큰 세리프 "조미경"
  - 영문 이름 small (`Mikyung Cho` ⚠️ 영문 표기 확인)
  - 인사말 (Sanity `person.bio`, blockContent)
  - 주요 경력·자격 리스트 (`person.credentials`)

> ⚠️ **CLIENT INPUT NEEDED**: 학력·경력 영문 표기, AICI 직함 (현재/과거), 저서 리스트, 인사말 카피 최종본.

#### 섹션 4 — HISTORY 타임라인
- 세로 또는 가로 타임라인
- 주요 연도별 마일스톤 (Sanity에서 별도 타입 없이 `person.bio` 또는 `siteSettings`에 array로)
- 디자인: 굵은 세로선 + 연도 (세리프) + 이벤트 설명 (산스)

#### 섹션 5 — PEOPLE
- 그리드 (3 또는 4 컬럼)
- 각 카드: 인물 사진 + 이름 + 직함
- 클릭 시 상세 모달 (또는 별도 페이지 없음, 모달로 처리)
- Sanity `person`에서 `role != "대표"`인 항목들

> ⚠️ **CLIENT INPUT NEEDED**: 강사진 프로필 (이름·직함·약력·사진).

---

### 6.3 CONSULTING

#### 6.3.1 인덱스 페이지 (`/consulting`)

- 섹션 1 — 페이지 헤더
  - 큰 세리프 "Consulting"
  - 한 줄: "임직원 단위의 출강이 본진."

- 섹션 2 — 4개 카드 (HOME의 시그니처 서비스 카드와 동일, 큰 사이즈)
  - `service` 컬렉션 전체 노출
  - `isFeatured: true` 카드는 가로폭 2배

- 섹션 3 — Why CMK (CMK를 선택해야 하는 이유)
  - 3~4 포인트
  - 예: "30년 헤리티지", "임직원 단위 맞춤 커리큘럼", "비공개 1:1 코칭", "방송 출연 검증"
  - ⚠️ 카피 확정 필요

- 섹션 4 — Contact CTA (B2B로 직결)

#### 6.3.2 서비스 상세 페이지 (`/consulting/[slug]`)

각 서비스 (`corporate`, `executive`, `public`, `media`) 의 동적 페이지:

- 섹션 1 — Hero (풀폭 이미지 + 서비스명)
- 섹션 2 — 본문 (Sanity `service.body`, blockContent)
- 섹션 3 — 핵심 포인트 (3~5개 카드)
- 섹션 4 — 진행 프로세스 (4~5단계 타임라인)
- 섹션 5 — Contact CTA (해당 서비스로 미리 분기된 폼으로 이동, `?service=corporate` 쿼리)

특히 `/consulting/corporate` 페이지는 가장 디테일하게:
- 임직원 단체 교육 / 부서별 / 직급별 차이 설명
- 예시 커리큘럼 (반나절 / 1일 / 2일 / 분기 정기)
- 협의 과정 (담당자 미팅 → 진단 → 커리큘럼 제안 → 진행 → 사후 리포트)

---

### 6.4 ACADEMY (`/academy`)

- 섹션 1 — 페이지 헤더
  - 세리프 "Academy"
  - 한 줄: "자격 과정 · 강사 양성"

- 섹션 2 — 4개 과정 카드 (Sanity `academyCourse` 컬렉션)
  - 각 카드: level 라벨 + 과정명 + 요약 + `자세히 →`

- 섹션 3 — 자격증 안내
  - 박스 형태로
  - "본 과정 수료자는 [외부 인증기관명]에서 발급하는 [자격증명]을 취득할 수 있습니다."
  - ⚠️ 발행기관·자격증명 확정 필요

- 섹션 4 — 수강 프로세스 (4단계 카드)
  - 01 일정·수강료 확인 → 02 신청폼 작성 → 03 입금 안내 (별도) → 04 수강 확정

- 섹션 5 — 신청 폼 (간단 인콰이어리 폼, Academy 분기)

#### 6.4.1 강좌 상세 (`/academy/[slug]`)
- Hero (과정명 + level)
- 일정·수강료 큰 박스 (3컬럼: 기간 / 일정 / 수강료)
- 커리큘럼 본문 (blockContent)
- 강사 카드 (`person` reference)
- 자격증 박스
- 신청 폼 (preferredCourse 자동 채워짐)

---

### 6.5 IMAGE LAB (`/image-lab`)

#### 1차 오픈 시 동작
- Sanity `labArticle` 컬렉션 비어있으면 페이지 자체를 메뉴에서 숨김
- 컬렉션에 1개 이상 있으면 노출
- Header `navigation` 컴포넌트에서 조건부 렌더링:
  ```ts
  const labCount = await client.fetch(`count(*[_type == "labArticle"])`);
  ```

#### 페이지 구조
- 섹션 1 — 헤더 "Image Lab" + 부제 "Research & Notes"
- 섹션 2 — 분야 필터 탭 (퍼스널컬러 / 스타일 / 골격 / 헤어 / 전체)
- 섹션 3 — 카드 그리드 (Marie Claire 스타일)
- 무한 스크롤 또는 페이지네이션

#### 글 상세 (`/image-lab/[slug]`)
- Hero 이미지
- 제목 + 분야 라벨 + 저자 + 날짜
- 본문 (blockContent, magazine layout — 풀폭 인용구, 큰 이미지 삽입)
- 하단: 관련 글 추천 (같은 분야 최신 3개)

---

### 6.6 COMMUNITY (`/community`)

Image Lab과 유사한 카드 그리드. Sanity `post` 사용.
- 카테고리: 공지 / 행사 / 수상·인증 / 강의·미디어 / 인터뷰·기고
- 카테고리 필터 탭
- 카드 그리드
- 외부 링크가 있는 항목 (`externalUrl`)은 클릭 시 새 창

---

### 6.7 CONTACT (`/contact`)

- 섹션 1 — 페이지 헤더
  - 세리프 "Contact"
  - 한 줄: "지금, 상담을 시작합니다."

- 섹션 2 — 3개 폼 분기 (탭 또는 큰 카드)
  - Personal Consulting
  - **Corporate Inquiry** (시각적으로 강조 — 가운데 + 약간 큰 사이즈 + 액센트 보더)
  - Academy 수강 문의

- 섹션 3 — 회사 정보
  - 좌측: 주소·전화·이메일·SNS 아이콘
  - 우측: 카카오맵 임베드
  - (Sanity `siteSettings`에서 데이터 가져옴)

- 섹션 4 — 운영 시간 / FAQ (선택)

#### 폼 동작
모든 폼은 Cloudflare Worker로 POST. §11 참조.

폼 필드 명세는 §11.2에 통합.

---

### 6.8 컬러 퀴즈 결과 (`/color-quiz/result/[type]`)

§9 참조 (별도 섹션으로 빠짐).

---

### 6.9 약관 페이지

- `/privacy` — 개인정보처리방침 (Sanity `siteSettings.privacyPolicy` 렌더링)
- `/terms` — 이용약관 (Sanity `siteSettings.termsOfUse` 렌더링)

심플한 텍스트 페이지, 본문 max-width 720px, 좋은 가독성.

---

## 7. 공통 컴포넌트

### 7.1 Header (`components/layout/Header.astro`)

```
[LOGO]                                    [Nav]                    [KO/中]
```

- 좌측: CMK 로고 (텍스트 또는 SVG)
- 가운데/우측: nav 메뉴 (`About / Consulting / Academy / Image Lab(조건부) / Community / Contact`)
- 우측 끝: 언어 토글
- 스크롤 시 행동: 50px 스크롤하면 배경 흰색 + 그림자 살짝, 그 전엔 투명 (Hero 위)

모바일: 햄버거 메뉴, 풀스크린 오버레이.

### 7.2 Footer

3컬럼 구조:
- 컬럼 1: 회사 정보 (회사명, 주소, 대표자, 사업자번호)
- 컬럼 2: 빠른 링크 (About, Consulting, Academy, Contact)
- 컬럼 3: 연락처 + SNS (전화, 이메일, Instagram, YouTube, 카카오)
- 하단: © 2026 CMK Image Korea. All rights reserved. · 개인정보처리방침 · 이용약관

다크 배경 (`--color-bg-dark`).

### 7.3 SectionTitle

```astro
<div class="section-title">
  <p class="eyebrow">CONSULTING</p>
  <h2 class="title-serif">CMK가 제안하는 네 가지 길</h2>
  <p class="subtitle">한 명의 인상이, 회사의 인상이 됩니다.</p>
</div>
```

### 7.4 Card (서비스 카드, 글 카드, 등)

기본 구조:
- 비율 4:5 이미지 (top)
- 카테고리 라벨 (eyebrow)
- 제목 (세리프)
- 요약 (산스, 2~3줄 클램프)
- "자세히 →" 링크 (호버 시 underline)

호버: 이미지 살짝 줌인 (1.03), 그림자 부드럽게.

### 7.5 Button

variants: `primary` (다크 배경 + 흰 글씨), `secondary` (보더만), `ghost` (텍스트만 + 화살표).

```astro
<Button variant="primary" href="/contact">기업 출강 문의 →</Button>
```

---

## 8. 5초 퍼스널컬러 퀴즈 — 상세 명세

### 8.1 위치
- HOME 섹션 2에 인라인 또는 모달로
- 별도 페이지 `/color-quiz` 도 존재 (직접 접속 가능)

### 8.2 질문 데이터

`src/lib/color-quiz.ts`:

```ts
export type Tone = "warm" | "cool";
export type Clarity = "bright" | "deep" | "soft" | "vivid";

export const questions = [
  {
    id: "q1",
    text: "손목 안쪽 혈관이 어떤 색에 가까운가요?",
    options: [
      { label: "초록빛이 도는 편", value: "warm" },
      { label: "푸른빛이 도는 편", value: "cool" },
    ],
  },
  {
    id: "q2",
    text: "햇볕에 오래 노출되면 어떻게 되나요?",
    options: [
      { label: "갈색으로 그을림", value: "warm" },
      { label: "붉어졌다가 회복됨", value: "cool" },
    ],
  },
  {
    id: "q3",
    text: "어떤 액세서리가 더 잘 어울리나요?",
    options: [
      { label: "골드 계열", value: "warm" },
      { label: "실버 계열", value: "cool" },
    ],
  },
  {
    id: "q4",
    text: "어떤 톤의 옷이 더 어울린다는 말을 듣나요?",
    options: [
      { label: "베이지·코랄·아이보리", value: "warm" },
      { label: "로즈·그레이·아이시블루", value: "cool" },
    ],
  },
  {
    id: "q5",
    text: "본인을 가장 잘 표현하는 키워드는?",
    options: [
      { label: "Bright (밝고 선명)", value: "bright" },
      { label: "Vivid (강렬하고 또렷)", value: "vivid" },
      { label: "Soft (부드럽고 잔잔)", value: "soft" },
      { label: "Deep (깊고 진중)", value: "deep" },
    ],
  },
];
```

### 8.3 결과 산출 로직

```ts
function calculateType(answers: Record<string, string>): SeasonType {
  // q1~q4의 warm/cool 카운트
  const tones = [answers.q1, answers.q2, answers.q3, answers.q4];
  const warmCount = tones.filter(t => t === "warm").length;
  const tone: Tone = warmCount >= 3 ? "warm" : warmCount === 2 ? (answers.q1 as Tone) : "cool";
  // 동률인 경우 q1 (혈관색) 우선

  const clarity = answers.q5 as Clarity;

  // 4계절 매핑
  if (tone === "warm" && (clarity === "bright" || clarity === "vivid")) return "spring";
  if (tone === "warm" && (clarity === "soft" || clarity === "deep")) return "autumn";
  if (tone === "cool" && (clarity === "soft")) return "summer";
  if (tone === "cool" && (clarity === "bright")) return "summer-bright";
  if (tone === "cool" && (clarity === "deep" || clarity === "vivid")) return "winter";

  return "summer"; // 기본값
}
```

### 8.4 결과 페이지 (`/color-quiz/result/[type]`)

5개 결과: `spring`, `summer`, `summer-bright`, `autumn`, `winter`
(원하면 1차에서는 4개로 단순화: `spring`, `summer`, `autumn`, `winter`)

각 결과 페이지 구조:

#### 8.4.1 풀스크린 히어로
- 좌측 50% (또는 모바일 상단 전체): 풀스크린 인물 사진 (시즌 무드)
- 우측 50%:
  - eyebrow "YOUR COLOR"
  - 큰 세리프 italic: "Autumn Deep" (시즌명 영문)
  - 한글: "가을, 깊은 톤"
  - 짧은 시적 한 줄: "단정한 빛의 결을 가진 사람."

#### 8.4.2 스크롤 다운 — 어울리는 팔레트
- 6~8개 컬러 스와치 (큰 사이즈)
- 각 컬러에 이름과 hex 코드
- "이런 컬러가 당신을 빛나게 합니다."

#### 8.4.3 추천 메이크업·스타일 톤
- 2~3개 카드 (립·아이·헤어 추천)
- 짧은 설명

#### 8.4.4 리드 캡처 (전환 후크)
- "더 자세한 진단을 받아보시겠어요?"
- 박스 안에 폼:
  - 이름
  - 연락처
  - 이메일 (선택)
  - 동의 체크박스 ("개인정보 수집·이용 동의" — 클릭 시 모달)
- 버튼: `전문가 1:1 진단 신청 →`
- 폼 제출 시 Worker로 POST, `kind=personal`, `source=color-quiz-{type}`

#### 8.4.5 인스타 공유 카드
- 동적 생성된 이미지 (1080×1080 또는 9:16)
- 시즌명 + 본인 결과 + cmkimage.co.kr URL + QR
- 생성 방식 1: HTML2Canvas로 클라이언트에서 렌더 후 다운로드
- 생성 방식 2: Worker에서 OG 이미지 동적 생성 (Cloudflare Pages Functions)
- 1차에서는 방식 1로 단순하게

#### 8.4.6 B2B 인콰이어리 노출
- 페이지 하단:
  - "우리 회사 임직원도 진단받고 싶다면"
  - `기업 단체 진단 문의 →` 버튼
- → `/contact?form=corporate&source=color-quiz`

### 8.5 상태 관리
- React 컴포넌트 (`ColorQuiz.tsx`)
- 5개 답변을 `useState`로 관리
- 마지막 질문 답하면 `calculateType()` 호출
- `window.location.href = '/color-quiz/result/' + type` 으로 이동
- (또는 같은 페이지에서 결과 표시 — UX는 별도 페이지 이동이 매거진 톤에 더 부합)

### 8.6 이미지·카피 placeholder
> ⚠️ **CLIENT INPUT NEEDED**: 각 시즌별 인물 사진 4~5장. 미수령 시 무드 스톡 또는 컬러 그래픽으로 대체.

---

## 9. 폼 & Cloudflare Worker 백엔드

### 9.1 폼 필드

> **보안 baseline (v1.2 확정, v1.3 필드명 정정)**: 모든 폼은 다음 3개 보안 필드를 공통으로 포함한다.
> - `website` — 봇용 honeypot. 실제 사용자 눈엔 안 보이는 input (CSS `position:absolute; left:-9999px; aria-hidden`). 값이 채워져 들어오면 Worker가 조용히 무시.
> - `turnstileToken` — Cloudflare Turnstile widget이 발급한 토큰. Worker에서 verify.
> - `formLoadedAt` — 폼 컴포넌트 mount 시각(`Date.now()`, ms). Worker가 제출 시각과 비교해 너무 빠른 제출(<3초) 차단. **이름이 서버 측 `submittedAt` (Sanity 스키마 필드, ISO 문자열)과 다르다는 점 주의** — 충돌 방지 목적.
>
> 이 3개는 §9.2 Worker에서 검증되며, 통과해야 본 처리로 들어간다. 자세한 로직은 §9.2.

#### Personal Form
| 필드 | 타입 | 필수 | placeholder |
|---|---|---|---|
| name | text | ✓ | 성함 |
| phone | tel | ✓ | 010-0000-0000 |
| email | email | | example@email.com |
| interest | select | | VVIP 1:1 / 그룹 / 이벤트 / 기타 |
| schedule | text | | 희망 시기 (예: 12월 둘째주) |
| budget | select | | ~50만 / 50~100만 / 100만~ |
| message | textarea | | 추가로 전하고 싶은 말 |
| agree | checkbox | ✓ | 개인정보 수집·이용 동의 |
| website | text (hidden, honeypot) | — | 비워둠 |
| turnstileToken | hidden | ✓ | (Turnstile widget이 자동 발급) |
| formLoadedAt | hidden | ✓ | (페이지/컴포넌트 mount 시 `Date.now()` 주입, ms) |

#### Corporate Form (가장 디테일)
| 필드 | 타입 | 필수 | placeholder |
|---|---|---|---|
| company | text | ✓ | 회사명 |
| name | text | ✓ | 담당자 성함 |
| position | text | ✓ | 직책 (예: HR 매니저) |
| phone | tel | ✓ | 연락처 |
| email | email | ✓ | 회사 이메일 |
| expectedCount | number | ✓ | 예상 교육 인원 |
| topic | textarea | ✓ | 교육 주제 / 목표 |
| schedule | text | | 희망 일정 |
| budgetRange | select | | ~500만 / 500~1000만 / 1000~3000만 / 3000만~ |
| message | textarea | | 추가 사항 |
| agree | checkbox | ✓ | 개인정보 수집·이용 동의 |
| website | text (hidden, honeypot) | — | 비워둠 |
| turnstileToken | hidden | ✓ | (Turnstile widget이 자동 발급) |
| formLoadedAt | hidden | ✓ | (페이지/컴포넌트 mount 시 `Date.now()` 주입, ms) |

#### Academy Form
| 필드 | 타입 | 필수 | placeholder |
|---|---|---|---|
| name | text | ✓ | 성함 |
| phone | tel | ✓ | 연락처 |
| email | email | ✓ | 이메일 |
| preferredCourse | select | ✓ | (Sanity academyCourse 목록 동적) |
| schedule | text | | 참여 가능 기수·시기 |
| motivation | textarea | | 수강 동기 (선택) |
| agree | checkbox | ✓ | 개인정보 수집·이용 동의 |
| website | text (hidden, honeypot) | — | 비워둠 |
| turnstileToken | hidden | ✓ | (Turnstile widget이 자동 발급) |
| formLoadedAt | hidden | ✓ | (페이지/컴포넌트 mount 시 `Date.now()` 주입, ms) |

#### Turnstile widget 사용 예 — React island 패턴

Astro 페이지에서 widget script는 `<head>` 또는 BaseLayout에 한 번 로드:
```astro
<!-- BaseLayout.astro -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad" async defer />
```

폼 React island에서 명시적으로 `window.turnstile.render()` 호출:
```tsx
// CorporateForm.tsx
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void }) => string;
      reset: (id?: string) => void;
    };
  }
}

export function CorporateForm() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");
  const [formLoadedAt] = useState(() => Date.now());
  // ...other field state

  useEffect(() => {
    if (!widgetRef.current || !window.turnstile) return;
    const id = window.turnstile.render(widgetRef.current, {
      sitekey: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
      callback: (t) => setToken(t),
    });
    return () => window.turnstile?.reset(id);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // React state로 관리하므로 명시 직렬화 — FormData 자동 직렬화 의존 금지
    const payload = {
      kind: "corporate",
      company, name, position, phone, email,
      expectedCount, topic, schedule, budgetRange, message, agree,
      website,                  // honeypot (보통 빈 문자열)
      turnstileToken: token,
      formLoadedAt,
    };
    await fetch(`${import.meta.env.PUBLIC_WORKER_URL}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ...visible fields */}
      <input type="text" name="website" value={website} onChange={e => setWebsite(e.target.value)}
             tabIndex={-1} autoComplete="off"
             style={{ position: "absolute", left: "-9999px" }} aria-hidden />
      <div ref={widgetRef} />
      <button type="submit" disabled={!token}>제출</button>
    </form>
  );
}
```

> **직렬화 주의 (Phase 4 구현 시)**: 폼을 React state로 관리하는 경우, `FormData(form)` + `Object.fromEntries` 자동 직렬화에 의존하지 말고 위처럼 **payload 객체를 명시 구성**해서 JSON으로 보낸다. honeypot/turnstileToken/formLoadedAt 중 하나라도 누락되면 Worker가 봇으로 간주해 정상 제출이 차단된다.

### 9.2 Cloudflare Worker 구조

`apps/worker/src/index.ts`:

```ts
import { createClient } from "@sanity/client";

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_TOKEN: string;            // Sanity write token
  RESEND_API_KEY: string;
  RESEND_FROM: string;             // 예: "CMK 홈페이지 <noreply@vdirectors.com>" — Phase 6에 cmkimage.co.kr 도메인으로 교체
  NOTIFY_EMAIL: string;            // CMK 운영진 이메일
  CORS_ORIGIN: string;             // https://cmkimage.co.kr
  TURNSTILE_SECRET: string;        // Cloudflare Turnstile secret key
  RATE_LIMIT_KV: KVNamespace;      // 간단 IP 레이트리밋용 (wrangler.toml에 binding)
}

const MIN_FORM_AGE_MS = 3_000;         // 3초 이내 제출은 봇으로 간주
const RATE_LIMIT_MAX  = 10;            // 1시간 내 같은 (IP, UA) 조합 10회 — 회사 NAT IP 다수 담당자 고려
const RATE_LIMIT_TTL  = 60 * 60;       // 1시간

// 간단 해시 (FNV-1a 32bit) — UA 문자열을 짧은 키로 변환
function hashStr(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(req.url);
    if (url.pathname !== "/api/inquiry") {
      return new Response("Not Found", { status: 404 });
    }

    try {
      const body = await req.json() as Record<string, any>;
      const { kind, website, turnstileToken, formLoadedAt, ...fields } = body;

      // ─── 보안 검증 ───────────────────────────────────────────

      // 1) Honeypot: 봇은 보통 모든 input을 채움. 채워져 있으면 조용히 200 반환 (어그로 차단)
      if (website && website.trim() !== "") {
        return Response.json({ ok: true }, { headers: corsHeaders(env) });
      }

      // 2) 폼 체류 시간: 너무 빠른 제출은 봇으로 간주
      const loadedAt = Number(formLoadedAt);
      if (!loadedAt || Date.now() - loadedAt < MIN_FORM_AGE_MS) {
        return Response.json({ ok: true }, { headers: corsHeaders(env) });
      }

      // 3) Turnstile 토큰 검증
      const ip = req.headers.get("cf-connecting-ip") || "unknown";
      const tsVerify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: turnstileToken,
          remoteip: ip,
        }),
      }).then(r => r.json() as Promise<{ success: boolean }>);

      if (!tsVerify.success) {
        return Response.json(
          { ok: false, error: "verification_failed" },
          { status: 400, headers: corsHeaders(env) }
        );
      }

      // 4) (IP, UA) 조합 rate limit (KV) — 회사 NAT IP에서 다수 담당자 제출 허용
      const ua = req.headers.get("user-agent") || "unknown";
      const rlKey = `rl:${ip}:${hashStr(ua)}`;
      const current = Number((await env.RATE_LIMIT_KV.get(rlKey)) ?? 0);
      if (current >= RATE_LIMIT_MAX) {
        return Response.json(
          { ok: false, error: "rate_limited" },
          { status: 429, headers: corsHeaders(env) }
        );
      }
      await env.RATE_LIMIT_KV.put(rlKey, String(current + 1), { expirationTtl: RATE_LIMIT_TTL });

      // ─── 본 처리 ────────────────────────────────────────────

      // 5) Sanity에 inquiry 저장 (실패 시 500 — 사용자 재제출 유도)
      const client = createClient({
        projectId: env.SANITY_PROJECT_ID,
        dataset: env.SANITY_DATASET,
        token: env.SANITY_TOKEN,
        useCdn: false,
        apiVersion: "2024-01-01",
      });

      const doc = await client.create({
        _type: "contactInquiry",
        kind,
        ...fields,
        submittedAt: new Date().toISOString(),
        status: "new",
      });

      // 6) Resend로 운영진 이메일 발송 — 실패해도 Sanity inquiry는 저장됐으므로 200 반환
      //    중복 제출 방지 + 운영진은 Sanity Studio에서 함께 확인하는 운영 패턴 (§9.2.1 참조)
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: env.RESEND_FROM,
            to: env.NOTIFY_EMAIL,
            subject: `[${String(kind).toUpperCase()}] 새 문의 도착 — ${fields.name || fields.company}`,
            html: renderEmail(kind, fields),
          }),
        });
      } catch (mailErr) {
        console.error("resend_failed", { inquiryId: doc._id, err: String(mailErr) });
        // silent — Sanity inquiry는 이미 저장됨. 사용자에게는 성공으로 응답.
      }

      return Response.json(
        { ok: true, id: doc._id },
        { headers: corsHeaders(env) }
      );
    } catch (err) {
      console.error(err);
      return Response.json(
        { ok: false, error: String(err) },
        { status: 500, headers: corsHeaders(env) }
      );
    }
  },
};

function corsHeaders(env: Env) {
  return {
    "Access-Control-Allow-Origin": env.CORS_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function renderEmail(kind: string, fields: any): string {
  const rows = Object.entries(fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;"><b>${k}</b></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${v}</td></tr>`)
    .join("");
  return `
    <h2 style="font-family:sans-serif;">새 ${kind} 문의가 접수되었습니다.</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      ${rows}
    </table>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:24px;">
      Sanity Studio에서 확인: <a href="https://www.sanity.io/manage">관리</a>
    </p>
  `;
}
```

> **⚠️ 운영 패턴 (필수)** — Resend 발송 실패는 silent log로 처리되고 사용자에게는 성공으로 응답된다. 이유는 ① Sanity inquiry는 이미 저장됐고, ② 500을 반환하면 사용자가 재제출해 **중복 inquiry**가 쌓이기 때문. 대신 **CMK 운영진은 Sanity Studio "문의 내역(자동)" 페이지를 주기적으로(최소 1일 1회) 확인**하는 운영 루틴이 필수다. 메일은 보조 알림이지 유일 채널이 아님. (이메일이 안 와도 Studio에는 들어와 있다.)
>
> 향후 v2 개선: Resend 재시도 큐(Cloudflare Queues) 또는 Slack 백업 알림 추가 검토.

### 9.3 `wrangler.toml`

```toml
name = "cmkimage-api"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[vars]
CORS_ORIGIN = "https://cmkimage.co.kr"

# KV namespace for rate limiting
# 1회 생성: npx wrangler kv namespace create RATE_LIMIT_KV
# 출력된 id를 아래에 붙여넣기
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "REPLACE_WITH_KV_NAMESPACE_ID"

# Secrets (wrangler secret put <NAME>)
# SANITY_PROJECT_ID
# SANITY_DATASET
# SANITY_TOKEN
# RESEND_API_KEY
# RESEND_FROM           ← Phase 4 개발용: V-Directors 도메인, Phase 6 정식: cmkimage.co.kr 도메인
# NOTIFY_EMAIL
# TURNSTILE_SECRET      ← Cloudflare Turnstile secret key
```

배포: `npx wrangler deploy`

### 9.4 프론트엔드 → Worker 호출

```ts
// 폼 컴포넌트 안에서
const PUBLIC_WORKER_URL = import.meta.env.PUBLIC_WORKER_URL;
// 예: https://cmkimage-api.your-account.workers.dev

async function submit(form: FormData) {
  const res = await fetch(`${PUBLIC_WORKER_URL}/api/inquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(form)),
  });
  if (!res.ok) throw new Error("Submit failed");
  return res.json();
}
```

### 9.5 향후 확장 (v2)
- Solapi 카카오 알림톡 API 추가 (Worker 안에 fetch 한 줄 추가)
- 자동응답 메일 (제출자에게 발송)

> **v1 baseline 보안** — Honeypot · Turnstile · 폼 체류 시간 · KV 기반 IP 레이트리밋은 v1에 포함되어 §9.1·§9.2에서 이미 정의됨. v2 추가 작업 아님.

---

## 10. GitHub Actions 배포

### 10.1 `.github/workflows/deploy-web.yml`

```yaml
name: Deploy Web to Cafe24

on:
  push:
    branches: [main]
    paths:
      - "apps/web/**"
      - ".github/workflows/deploy-web.yml"
  workflow_dispatch:
  repository_dispatch:
    types: [sanity-update]

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./apps/web

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          PUBLIC_SANITY_PROJECT_ID:  ${{ secrets.SANITY_PROJECT_ID }}
          PUBLIC_SANITY_DATASET:     ${{ secrets.SANITY_DATASET }}
          SANITY_TOKEN:              ${{ secrets.SANITY_READ_TOKEN }}
          PUBLIC_WORKER_URL:         ${{ secrets.WORKER_URL }}
          PUBLIC_TURNSTILE_SITE_KEY: ${{ secrets.TURNSTILE_SITE_KEY }}
          PUBLIC_SITE_URL:           https://cmkimage.co.kr
        run: npm run build

      - name: Deploy to Cafe24 via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server:       ${{ secrets.CAFE24_FTP_HOST }}
          username:     ${{ secrets.CAFE24_FTP_USER }}
          password:     ${{ secrets.CAFE24_FTP_PASS }}
          local-dir:    ./apps/web/dist/
          server-dir:   ${{ secrets.CAFE24_FTP_PATH }}
          dangerous-clean-slate: false
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
```

### 10.2 Sanity Webhook 설정

Sanity Studio에서:
1. `manage.sanity.io` → Project → API → Webhooks → Create new
2. URL: `https://api.github.com/repos/{OWNER}/{REPO}/dispatches`
3. Method: POST
4. Headers:
   - `Authorization: token {GITHUB_PERSONAL_ACCESS_TOKEN}` (repo scope)
   - `Accept: application/vnd.github+json`
5. Body:
   ```json
   {"event_type": "sanity-update"}
   ```
6. Trigger: on publish (모든 document type)

→ 글 발행 시 5분 내 사이트 자동 반영.

### 10.3 GitHub Secrets 등록 목록

| Secret 이름 | 값 |
|---|---|
| `SANITY_PROJECT_ID` | Sanity 프로젝트 ID |
| `SANITY_DATASET` | `production` |
| `SANITY_READ_TOKEN` | Sanity Read 토큰 (Studio → API → Tokens) |
| `WORKER_URL` | Cloudflare Worker URL (`*.workers.dev` — 옵션 B) |
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (public, build 시 `PUBLIC_TURNSTILE_SITE_KEY` 로 주입) |
| `CAFE24_FTP_HOST` | Cafe24 FTP 호스트 |
| `CAFE24_FTP_USER` | FTP 계정 |
| `CAFE24_FTP_PASS` | FTP 비밀번호 |
| `CAFE24_FTP_PATH` | 서버 내 배포 경로 (보통 `/public_html/`) |

---

## 11. 환경 변수

### 11.1 `apps/web/.env`

```env
PUBLIC_SANITY_PROJECT_ID=your_project_id
PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=sk_xxx_read_token
PUBLIC_WORKER_URL=https://cmkimage-api.your-account.workers.dev
PUBLIC_SITE_URL=https://cmkimage.co.kr
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA_xxx     # Cloudflare Turnstile site key (public)
```

### 11.2 `apps/studio/.env`

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### 11.3 `apps/worker/.dev.vars` (로컬 개발용)

```env
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=sk_xxx_write_token
RESEND_API_KEY=re_xxx
RESEND_FROM=CMK 홈페이지 <noreply@vdirectors.com>
NOTIFY_EMAIL=ops@cmkimage.co.kr
CORS_ORIGIN=http://localhost:4321
TURNSTILE_SECRET=0x4AAAAAAA_secret_xxx
```

운영용 Secret은 wrangler로:
```bash
cd apps/worker
npx wrangler secret put SANITY_TOKEN
npx wrangler secret put RESEND_API_KEY
# ...
```

---

## 12. 개발 단계

이 순서대로 진행하면 막힘 없이 끝까지 갈 수 있음. 각 단계 마지막에 한 번씩 멈춰서 결과 확인할 것.

### Phase 1 — 프로젝트 셋업 (Day 1)
- [ ] 모노레포 구조 만들기 (pnpm 또는 npm workspaces)
- [ ] `apps/web` Astro + TypeScript 프로젝트 초기화
- [ ] **Tailwind v4 설치** + `global.css`에 `@import "tailwindcss"` + `@theme` 토큰 정의 (§3.1)
- [ ] Pretendard / Cormorant Garamond 폰트 로딩
- [ ] BaseLayout / Header / Footer / SectionTitle / Button 컴포넌트 (placeholder 내용으로)
- [ ] 홈에 "Hello CMK" 한 줄 띄우고 로컬 dev 서버 확인

### Phase 2 — Sanity Studio (Day 2)
- [ ] `apps/studio` 디렉토리에 Sanity 프로젝트 생성
- [ ] **다국어 헬퍼 객체** (`localeString` / `localeText` / `localeBlockContent`) 정의 — §4.2 참조. (i18n 플러그인은 사용 안 함, §4.1 참조)
- [ ] §4의 모든 document schema 정의 (위 헬퍼 객체 사용)
- [ ] `sanity dev`로 Studio 띄우고 schema 확인
- [ ] `sanity deploy`로 Studio를 `cmkimage.sanity.studio`에 배포
- [ ] 임시 데이터 1~2개 입력 (대표 이미지, 시그니처 서비스 1개)

### Phase 3 — 핵심 페이지 빌드 (Day 3~5)
- [ ] `lib/sanity.ts`, `lib/queries.ts` 작성
- [ ] HOME 페이지 모든 섹션 (Hero / 퀴즈 자리만 / 서비스카드 / 로고월 / 수치 / CEO / CTA)
- [ ] ABOUT, CONSULTING 인덱스, ACADEMY 인덱스, COMMUNITY 인덱스
- [ ] 동적 라우트: `/consulting/[slug]`, `/academy/[slug]`, `/community/[slug]`
- [ ] CONTACT 페이지 (폼은 placeholder)
- [ ] **Phase 3 완료 시점 — 클라이언트에게 다음 정보 요청**: Cafe24 FTP 호스트/계정/비번/경로, 도메인 등록기관 확인 (Cafe24 자체인지 외부인지)

### Phase 4 — 컬러 퀴즈 & 폼 (Day 6~7)
- [ ] ColorQuiz React island 구현
- [ ] 5개 결과 페이지 (또는 4개)
- [ ] 인스타 공유 카드 (HTML2Canvas)
- [ ] 3개 폼 컴포넌트 (honeypot + Turnstile widget + formLoadedAt 포함, §9.1 참조)
- [ ] **Cloudflare Turnstile site 발급** (CF 대시보드 → Turnstile → Add site) → `PUBLIC_TURNSTILE_SITE_KEY` + Worker secret `TURNSTILE_SECRET` 등록
- [ ] **Cloudflare KV namespace 생성**: `npx wrangler kv namespace create RATE_LIMIT_KV` → 출력된 id를 `wrangler.toml` 바인딩에 붙여넣기
- [ ] Cloudflare Worker 작성 및 배포 (§9.2)
- [ ] 로컬에서 폼 제출 → Sanity 저장 → 이메일 발송 → Resend 의도적 실패 시 silent log + Sanity 저장은 정상 인 동작 end-to-end 확인

### Phase 5 — i18n (Day 8)
- [ ] `/zh` 미러 라우트 구성
- [ ] LangToggle 컴포넌트
- [ ] hreflang 태그
- [ ] 모든 쿼리에서 다국어 필드 활용 (`title.ko` / `title.zh` 패턴)
- [ ] 중국어 데이터는 일단 비어있어도 OK (KO fallback)

### Phase 6 — 배포 (Day 9)
- [ ] GitHub Actions workflow 작성
- [ ] (Phase 3에서 확보된) Cafe24 FTP 정보를 GH Secrets 등록
- [ ] 도메인 연결 — 등록기관에 따라 분기: **Cafe24 자체 등록**이면 네임서버 위임 자동, **외부 등록**이면 A 레코드(또는 CNAME)로 Cafe24 IP 가리키도록 설정
- [ ] Resend 클라이언트 도메인 인증 — DKIM(1~3) + SPF + DMARC TXT 레코드 등록 → Worker secret `RESEND_FROM` 을 `noreply@cmkimage.co.kr` 형태로 교체
- [ ] Sanity webhook → GitHub repository_dispatch 연결
- [ ] 첫 배포 후 도메인 연결 확인
- [ ] SSL 적용 확인

### Phase 7 — QA & 다듬기 (Day 10)
- [ ] 모바일 반응형 점검
- [ ] 모든 폼 실제 제출 테스트
- [ ] 퀴즈 전체 흐름 테스트
- [ ] SEO 메타 태그 확인
- [ ] Lighthouse 점수 (Performance 90+ 목표)
- [ ] 크로스 브라우저 (Chrome / Safari / Edge / 모바일 Chrome)

---

## 13. 외부 서비스 · 단계별 필요 자원 · 미해결 항목

### 13.1 외부 서비스 소유 정책

각 외부 서비스를 누가 처음 만들고, 최종적으로 누구 소유가 되며, 어떻게 이관하는지.

| 서비스 | 가입 시점 | 처음 소유 | 최종 소유 | 이관 방법 |
|---|---|---|---|---|
| **GitHub** (저장소) | Phase 1 | V-Directors | V-Directors (유지) | 표준 work-for-hire — 인도 시점 코드 zip + access 부여만, 저장소 자체는 V-Directors 보유 |
| **Sanity** (CMS) | Phase 2 | V-Directors organization | 클라이언트 organization | "Transfer project" 실행 → **READ_TOKEN 회전 필수** (이전 admin이 회수 가능한 상태이므로) → GH Secrets 교체 후 1회 재배포로 마감 |
| **Cloudflare** (Worker) | Phase 4 | V-Directors | 클라이언트 | 새 계정에서 `wrangler deploy` + secrets 재등록(약 5분). Worker URL이 바뀌므로 `PUBLIC_WORKER_URL` 환경변수 교체 + 사이트 재빌드 1회 |
| **Resend** (이메일) | Phase 4 | V-Directors 도메인 발신 (개발용) | 클라이언트 도메인 발신 (정식) | Phase 6에 cmkimage.co.kr 도메인을 Resend에 등록 → DKIM 3개 + SPF 1개 + DMARC 1개 TXT 레코드 DNS 등록 → verification(수 분~수 시간) → Worker secret `RESEND_FROM` 교체 |
| **Cafe24** (호스팅) | (이미 보유) | 클라이언트 | 클라이언트 | 없음 |

핵심 원칙: **개발은 V-Directors 환경에서 진행, 정식 오픈/오픈 후 클라이언트로 이관**. 이로써 클라이언트는 단계별로 필요한 것만 준비하면 됨.

> **DNS 운영 정책 (v1.2 확정 — 옵션 B)**: 도메인 DNS는 **Cafe24가 계속 관리**하며, Cloudflare로 이전하지 않는다. Worker는 기본 URL `*.workers.dev` 그대로 사용한다. 향후 custom domain(`api.cmkimage.co.kr` 등)이 필요해지면 그때 옵션 A(DNS를 Cloudflare로 위임)로 전환한다. **전환 시 코드 영향은 `PUBLIC_WORKER_URL` 환경변수 1줄 변경 + 1회 재배포 뿐.**

### 13.2 단계별 필요 자원 (블로커 정리)

**Phase 1 (셋업):**
- 없음. 바로 시작 가능.

**Phase 2 (Sanity Studio):**
- V-Directors organization에 새 Sanity 프로젝트 생성. **클라이언트한테 받아야 할 것 없음.**

**Phase 3 (페이지 빌드):**
- 없음. 로컬 dev 서버에서 모든 작업 가능.
- ✅ **Phase 3 완료 시점 체크리스트** (클라이언트 요청 격상):
  - Cafe24 FTP 정보 (호스트·계정·비밀번호·경로)
  - DNS 관리 권한 확인 (현재 도메인 등록기관은? — Cafe24 자체인지 외부인지)
  - 이 두 정보를 Phase 6 며칠 전이 아닌 **Phase 3 끝나는 시점에 미리** 확보. Phase 6에서 막히면 며칠 지연됨.

**Phase 4 (폼 · Cloudflare Worker):**
- V-Directors Cloudflare 계정에서 Worker 개발·배포 (Worker URL은 `*.workers.dev` 기본값 사용 — 옵션 B 확정)
- **Cloudflare Turnstile** site/secret key 발급 (CF 대시보드 → Turnstile → Add site, 무료 1M req/월). `PUBLIC_TURNSTILE_SITE_KEY` + Worker secret `TURNSTILE_SECRET` 등록
- **Cloudflare Workers KV namespace** 생성 (`wrangler kv namespace create RATE_LIMIT_KV`) → `wrangler.toml` 바인딩
- Resend 가입 — 발신 도메인 결정:
  - **개발용 (권장)**: V-Directors 도메인 (`noreply@vdirectors.com`) → 자체 DKIM/SPF 처리, 클라이언트 DNS 권한 불필요
  - **정식용**: 클라이언트 도메인 (`noreply@cmkimage.co.kr`) → Phase 6 시점에 교체
- 즉, Phase 4에서도 클라이언트 자원 없이 진행 가능

**Phase 5 (i18n):**
- 없음.

**Phase 6 (Cafe24 정식 배포):**
- ✅ **Cafe24 FTP 정보** (호스트·계정·비번·경로) — Phase 3에서 확보 완료 상태여야 함
- ✅ **cmkimage.co.kr A 레코드 변경 권한** (Cafe24 IP로 변경)
- ✅ **Resend 클라이언트 도메인 DNS 인증** — DKIM(1~3개) + SPF(1개) + DMARC(1개) TXT 레코드 등록, verification 수 분~수 시간 소요
- ✅ 클라이언트 검수 완료

**오픈 후 (이관 단계):**
- 클라이언트 Sanity organization 생성 → V-Directors organization에서 Transfer project 실행 → **READ_TOKEN 회전** → GH Secrets 교체 → 1회 재배포
- 클라이언트 Cloudflare 가입 → 같은 Worker 코드를 클라이언트 계정에서 재배포 + secrets 재등록 + Turnstile site 재발급
- 사이트 환경변수 `PUBLIC_WORKER_URL` 과 `PUBLIC_TURNSTILE_SITE_KEY` 를 새 계정 값으로 교체 후 재빌드

### 13.3 콘텐츠 미해결 항목 (개발은 진행 가능)

다음 항목들은 콘텐츠/저작권 관련이라 입수가 늦어도 placeholder로 개발 진행 가능:

| # | 항목 | 영향 | 임시 처리 |
|---|---|---|---|
| 1 | 회사 설립 연도 / Since 표기 | Hero, About | "Since [YEAR]" placeholder |
| 2 | 브랜드 철학 카피 본문 | About 섹션 2 | 매거진 톤 더미 텍스트 |
| 3 | 조미경 대표 인사말 카피 | About 섹션 3 | 더미 텍스트 + "원고 입수 예정" 표시 |
| 4 | 학력·경력 영문 표기 | About | 한글만 표기 |
| 5 | AICI 직함 (현재/과거) | About credentials | 미표기 |
| 6 | 저서·미디어 자료 | About, Community | Community 비워둠 |
| 7 | 강사진 프로필 (이름·직함·약력·사진) | About PEOPLE | "Coming Soon" 박스 |
| 8 | 거래 기업 로고 + 게재 동의 | HOME 로고월 | 섹션 자체 숨김 처리 |
| 9 | 누적 수치 (임직원 수·기업 수·년수) | HOME stats | placeholder 숫자 + 섹션 숨김 |
| 10 | Academy 수강료·일정·자격증 발행기관명 | Academy 전체 | "일정 협의" / "외부 인증기관" |
| 11 | 컨설팅 사례 사진 (촬영·초상권 동의) | Consulting 상세 | 무드 스톡으로 대체 |
| 12 | 중국어 번역 | `/zh/` 전체 | 한국어 fallback (빈 필드 시 KO 노출) |
| 13 | 카카오맵 위치 좌표 | Contact | 임시 좌표 |
| 14 | 카카오 채널 ID / Instagram / YouTube URL | Footer | 비워두고 후 입력 |

### 13.4 (Optional) 중간 검토용 Staging 배포

정식 Cafe24 배포 전에 클라이언트한테 진행 상황을 보여줘야 할 때 활용 가능:

- **Cloudflare Pages** (권장 — 이미 Worker로 CF 생태계 안에 있음) 또는 **Vercel** 무료 티어
- 임시 URL 예: `cmk-staging.pages.dev`
- 비용 0, 셋업 5분
- Cafe24·도메인은 전혀 안 건드림 (FTP·DNS 권한 없이 가능)
- 정식 오픈 시점에만 GitHub Actions로 Cafe24 FTP 배포로 전환

**도입 효과:**
- Phase 3 끝나면 클라이언트한테 "이런 톤으로 갑니다" 미리 공유 가능
- 매거진 디자인의 임팩트는 실제 브라우저에서 보여야 살아남 (PPT만으로 부족)
- 클라이언트 피드백 조기 수렴 → 후반 대수정 방지

**Staging 접근 보호 (필수):**
- Cloudflare Pages 사용 시: **Cloudflare Access** (Zero Trust, 무료 50명 내장) — 이메일 OTP·Google SSO 등으로 화이트리스트 게이팅. 셋업 5분
- Vercel 사용 시: **Vercel Authentication** (Hobby 플랜 무료 내장)
- 추가로 staging 빌드에는 `<meta name="robots" content="noindex,nofollow">` + `/robots.txt` 차단 자동 주입 (검색엔진 색인 방지)
- 매거진 톤 시안·미공개 거래기업 로고·임시 카피의 외부 노출 차단 목적

**도입 방법** (필요 시):
- `apps/web` 루트에 `wrangler.toml` (Cloudflare Pages용) 또는 `vercel.json` 추가
- GitHub Actions에 staging 브랜치 빌드 jobs 추가 (`deploy-staging.yml`)
- staging 환경변수도 secrets로 분리 (`STAGING_` 접두사 권장)
- staging 빌드 시 `import.meta.env.PUBLIC_STAGING === "true"` 분기로 noindex 자동 주입

---

## 14. 참고

### 14.1 디자인 레퍼런스
- W Korea — https://www.wkorea.com (digital cover, full-screen portrait)
- Vogue Korea — https://www.vogue.co.kr (한글 카테고리 위계, tile grid)
- Marie Claire KR — https://www.marieclairekorea.com (card grid + lazy-loading)

### 14.2 톤 키워드
Nude · Serif · Full-screen Portrait · Poetic Copy · White Space

### 14.3 라이브러리 문서
- Astro: https://docs.astro.build
- Sanity v3: https://www.sanity.io/docs
- Tailwind v4: https://tailwindcss.com
- @sanity/client: https://www.sanity.io/docs/js-client
- Cloudflare Workers: https://developers.cloudflare.com/workers
- Resend: https://resend.com/docs

### 14.4 기존 사이트 (참고용)
- 현 cmkimage.co.kr — 콘텐츠 일부 차용 가능, 디자인은 완전 새로 갈 것.

---

## 15. 작업 시작 명령

Claude Code에 이 문서를 주고 처음 던질 프롬프트 예시:

```
이 문서를 정독하고, Phase 1을 시작해줘.

먼저 모노레포 구조를 만들고, apps/web에 Astro + TypeScript + Tailwind 4 프로젝트를 초기화해.
디자인 토큰 (§3.1) 을 global.css에 적용하고, Pretendard와 Cormorant Garamond를 로드해.
BaseLayout, Header, Footer, SectionTitle, Button 컴포넌트를 만들되 내용은 placeholder로.
HOME 페이지에 "Hello CMK" 한 줄만 띄우고 dev 서버 띄워서 결과 캡처해줘.

Phase 1 끝나면 멈추고 결과 보여줘. Phase 2 들어가기 전에 내가 확인할게.
```

---

**이 문서는 v1.3이며, 개발 진행 중 발견되는 결정 사항은 본 문서에 추가·갱신함.**

**Changelog**
- v1.0 — 최초 핸드오프 문서 (전 섹션 작성)
- v1.1 — §13 재구성: 외부 서비스 소유 정책 표 추가, 단계별 필요 자원 정리, 중간 검토용 Staging 배포 옵션 추가. (개발은 V-Directors 환경에서, 정식 오픈 시 클라이언트로 이관하는 방식 명문화)
- v1.2 — 기술 결정 4건 확정:
  - §3.1 Tailwind v4 CSS-first(`@theme`) 패턴으로 재작성 — v3 JS config 제거
  - §4 Sanity i18n을 커스텀 `localeString` 객체 단일 패턴으로 일원화 — `sanity-plugin-internationalized-array` 제거
  - §9.1·§9.2 폼 보안을 v1 baseline으로 격상 — Honeypot + Cloudflare Turnstile + 폼 체류 시간 + KV 기반 IP 레이트리밋. §9.5 v2 항목에서 스팸 방지 제거
  - §13.1 정밀도 보완 — Sanity 토큰 회전 필수화, Resend DKIM/SPF/DMARC 구체화, GitHub 표준 work-for-hire 명시
  - §13.1 **DNS 옵션 B 확정** — Cafe24 DNS 유지 + Worker는 `*.workers.dev` 사용. 향후 옵션 A 전환 시 코드 영향은 `PUBLIC_WORKER_URL` 1줄 변경뿐
  - §13.2 Phase 3 완료 시 Cafe24 FTP + DNS 권한 확보를 체크리스트로 격상, Phase 4에 Turnstile/KV 셋업 추가
  - §13.4 Staging 보호를 Cloudflare Access 기반으로 명시 (Vercel은 Vercel Authentication)
- v1.3 — 클로드B v1.2 재검토 지적 4건 + 사소한 메모 4건 반영:
  - **(버그 수정)** §9.1 보안 baseline 박스의 필드명을 `submittedAt` → `formLoadedAt`으로 통일하고, 폼 3개 표에 `formLoadedAt` hidden 행 추가. (이전 v1.2에서는 Worker가 항상 NaN 비교로 정상 제출까지 차단되는 실 버그였음)
  - §9.1 Turnstile widget 코드 예시를 React island 패턴(`useEffect` + `window.turnstile.render()`)으로 재작성. payload 명시 직렬화 + FormData 자동 직렬화 의존 금지 주의 박스 추가
  - §9.2 Worker — Resend 호출을 별도 `try/catch`로 격리해 메일 실패 시에도 200 반환(중복 inquiry 방지) + 운영 패턴 박스 추가(Studio 1일 1회 확인 필수)
  - §9.2 Rate limit `5 → 10회/시간`, 키를 `IP` → `(IP, UA) 조합`으로 변경 — 회사 NAT IP에서 다수 담당자 제출 허용
  - §10.1·§10.3 GH Actions/Secrets에 `TURNSTILE_SITE_KEY` 빌드 시점 주입 추가
  - §12 Phase 1 — Tailwind v4 명시, Phase 2 — 다국어 plugin 제거하고 헬퍼 객체 정의로 교체, Phase 3 끝 — Cafe24 FTP·도메인 등록기관 확인 체크리스트 격상, Phase 4 — Turnstile site 발급 + KV namespace 생성 추가, Phase 6 — 도메인 등록기관에 따른 분기 처리 명시 + Resend 도메인 인증·`RESEND_FROM` 교체 단계 추가

— V-Directors · 2026
