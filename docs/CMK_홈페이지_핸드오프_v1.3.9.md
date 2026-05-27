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
| 다국어 | **한국어 only** (1차 오픈, v1.3.8 결정). 추후 영어 확장은 별도 마일스톤 (§5 참조) |

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

### 3.7 Tailwind v4 · Astro 함정 회피 패턴 (v1.3.5)

Phase 1·3 실작업 중 반복 발견된 두 가지 함정. 매거진 톤 사이트는 큰 폰트·동적 클래스 사용이 많아 동일 함정이 재발하기 쉽다.

#### 3.7.1 큰 `clamp(...)` 등 arbitrary value 가 jit 에 안 잡힐 때 — **inline style fallback**

Tailwind v4 jit 이 다음과 같은 큰 arbitrary value 를 누락하는 경우가 관찰됨:
```html
<!-- ❌ 일부 큰 clamp / gap 값이 적용 안 되는 경우 -->
<h1 class="text-[clamp(120px,22vw,320px)]">…</h1>
<ul class="gap-x-10 gap-y-3">…</ul>
```

해결: 적용이 보장되어야 하는 큰 폰트·gap 은 **inline `style` 로 강제**한다.
```html
<!-- ✅ inline style 은 Tailwind 거치지 않으므로 무조건 적용 -->
<h1
  class="font-serif italic lowercase leading-[0.9] tracking-[-0.03em] text-foreground"
  style="font-size: clamp(30px, 5.5vw, 80px);"
>
  about
</h1>
<ul
  class="flex flex-wrap items-center justify-center"
  style="row-gap: 0.75rem; column-gap: 3rem;"
>
  …
</ul>
```

규칙: **`clamp()` 또는 큰 수치 (≥ text-9xl 상당) 의 arbitrary value 는 inline style 로 작성**. 일반 색·간격은 Tailwind utility 유지.

#### 3.7.2 Astro `class:list` 안의 multi-line ternary 회피 — **template literal**

다음 패턴이 Astro/esbuild 파서를 막아 `Expected "}" but found ":"` 빌드 에러 발생:
```astro
<!-- ❌ 빌드 실패 가능 -->
<a class:list={[
  "base classes",
  isActive(item.href)
    ? "text-foreground"
    : "text-muted hover:text-foreground",
]}>
```

해결: **frontmatter 에서 변수로 풀고 template literal** 로 합치기.
```astro
---
const baseLink = "text-[11px] font-semibold uppercase tracking-[0.18em]";
---
<a class={`${baseLink} ${isActive(href) ? "text-foreground" : "text-muted hover:text-foreground"}`}>
```

또는 `class:list` 유지 시 ternary 대신 **단축 평가 (short-circuit)**:
```astro
<a class:list={[
  "base classes",
  isActive(href) && "text-foreground",
  !isActive(href) && "text-muted hover:text-foreground",
]}>
```

규칙: `class:list` 안에 multi-line ternary 사용 금지. template literal 또는 short-circuit.

#### 3.7.3 pnpm 11+ `verify-deps-before-run` 자동 install 차단 (v1.3.6)

pnpm 11 부터 `pnpm exec` / `pnpm run` / `pnpm --filter exec` 실행 전 자동으로 `pnpm install` 을 트리거해서 deps 일치 검증을 함. **`onlyBuiltDependencies` 외 새 빌드 스크립트(주로 sharp 마이너 버전 업)** 가 차단되면 install 이 exit 1 로 끝나고 `wrangler` 같은 후속 명령도 실행 안 됨.

증상:
```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: sharp@x.x.x
[ERROR] Command failed with exit code 1: ... pnpm install
```

해결 — 프로젝트 루트에 `.npmrc`:
```ini
# pnpm 11+ 자동 deps status check 비활성화
verify-deps-before-run=false
```

대안 — pnpm 우회로 `npx` 직접 사용 (worker 디렉토리에서):
```powershell
cd apps\worker
npx wrangler login
npx wrangler dev --port 8787
```

규칙: 모노레포 루트에 `.npmrc` 의 `verify-deps-before-run=false` 항상 포함. wrangler·sanity 같은 외부 CLI 호출 시 `npx` 도 동등하게 안전.

#### 3.7.4 pnpm `--filter` 가 `.npmrc` 의 `verify-deps-before-run=false` 를 무시 (v1.3.8)

`.npmrc` 에 해당 옵션이 있어도 **`pnpm --filter <pkg> dev` / `pnpm --filter <pkg> run <script>`** 호출 시 deps status check 가 우회되지 않고 동작함 (pnpm 의 `runDepsStatusCheck` 가 별도 경로). sharp 같은 빌드 차단 스크립트가 있으면 exit 1.

증상 (v1.3.8 dev 환경에서 실 발생):
```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: sharp@0.33.5
[ERROR] Command failed with exit code 1: ... pnpm install
```

해결 — **각 앱 디렉토리에서 `npx` 로 직접 dev 서버 실행** (§3.7.3 의 worker `npx wrangler dev` 패턴을 web/studio 에도 동일 적용):

```powershell
# Web (apps/web)
cd apps\web
npx astro dev --port 4321

# Studio (apps/studio)
cd apps\studio
npx sanity dev --port 3333

# Worker (apps/worker)
cd apps\worker
npx wrangler dev --port 8787
```

규칙: dev 3개 모두 `npx` 직접 호출 (`pnpm --filter` 사용 금지). pnpm 은 `pnpm install` / `pnpm add` 처럼 의존성 변경에만 사용. CI 빌드(`pnpm --filter web build`) 는 정상 동작하므로 영향 없음 (CI는 deps 검증 직후 실행).

#### 3.7.5 wrangler dev 의 `.dev.vars` hot-reload 한계 (v1.3.8)

`wrangler dev` 는 startup 시점에 `.dev.vars` 를 메모리로 로드한 후, **편집해도 자동 반영하지 않는 경우가 있음** (Miniflare 의 file watcher 가 vars 변경을 안 잡거나 cache 함). secret 회전 후 토큰이 거부되는 (`Unauthorized - Session not found` 류) 증상이 나오면 hot-reload 가 안 된 것.

증상 (v1.3.8 토큰 회전 검증 중 실 발생):
```
POST /api/inquiry 500 (Sanity 측 "Unauthorized - Session not found")
```
첫 시도는 옛 (회전 직전) 토큰을 들고 있어서 거부.

해결: **`.dev.vars` 편집 후 반드시 Worker 창에서 `Ctrl+C` → 재기동**.

```powershell
# Worker 창에서
Ctrl+C
npx wrangler dev --port 8787
```

규칙: secret 회전 → `.dev.vars` 편집 → Worker 재시작. 이 3단계는 항상 묶음으로 진행. 검증 단계(§13.5.4)에서도 재시작 후 폼 1회 제출 확인 필수.

#### 3.7.6 dev 서버 좀비 프로세스 (v1.3.8)

세션 종료 시 PowerShell 창을 닫지 않으면 node 프로세스가 좀비로 잔존할 수 있음. 다음 세션 띄울 때 `Port X is already in use` 또는 4322 fallback 으로 떴는데 CORS 화이트리스트가 4321 만 허용해 막힘.

진단:
```powershell
Get-NetTCPConnection -LocalPort 4321,3333,8787 -State Listen |
  Select-Object LocalPort, OwningProcess,
    @{Name='ProcessName';Expression={(Get-Process -Id $_.OwningProcess).ProcessName}}
```

정리:
```powershell
Stop-Process -Id <PID1>,<PID2> -Force
```

규칙: 세션 시작 전 위 진단 1회. 좀비 발견 시 정리. dev 작업 종료 시 PowerShell 창에서 `Ctrl+C` 로 명시적 종료.

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

// siteSettings는 싱글톤 (1개 document만 존재).
// 구조 메뉴는 documentId="siteSettings" 고정으로 단일화되지만,
// "Create new" 우회/duplicate/delete 우회를 차단하기 위해 document.actions 와
// newDocumentOptions 콜백으로 강제 (v1.3.4).
const SINGLETON_TYPES = new Set(["siteSettings"]);
const SINGLETON_DISABLED_ACTIONS = new Set(["delete", "duplicate", "unpublish"]);

export default defineConfig({
  name: "default",
  title: "CMK Image Korea",
  projectId: "YOUR_PROJECT_ID",
  dataset: "production",
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => !SINGLETON_DISABLED_ACTIONS.has(action ?? ""))
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((tpl) => !SINGLETON_TYPES.has(tpl.templateId))
        : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().id("siteSettings").title("사이트 설정").child(
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

### 4.2 다국어 헬퍼 오브젝트 (i18n 단일 패턴 — 1차 오픈 KO only)

**v1.3.8 결정**: 1차 오픈은 한국어 only. 다국어 객체 구조는 그대로 유지하되 `ko` 단일 키만 가짐. 추후 영어 확장 시 fields 에 `{ name: "en", type: "string" }` 1줄 추가로 끝 (§5 EN 확장 마일스톤 참조).

모든 다국어 필드는 아래 세 객체(`localeString` / `localeText` / `localeBlockContent`) 중 하나로만 선언한다. 데이터 모양은 `{ ko: "..." }` 평탄 객체이며, GROQ에서는 `title.ko` 처럼 직접 접근 가능.

`schemas/objects/localeString.ts`:
```ts
import { defineType } from "sanity";

export default defineType({
  name: "localeString",
  title: "Locale String",
  type: "object",
  fields: [
    { name: "ko", title: "한국어", type: "string", validation: r => r.required() },
    // 추후 EN 확장 시: { name: "en", title: "English", type: "string" },
  ],
  options: { collapsible: true, collapsed: false },
});
```

`localeText.ts`와 `localeBlockContent.ts`도 동일한 패턴 (각각 `type: text`, `type: array of block`).

프론트엔드 (`apps/web/src/types/sanity.ts`) 의 `pickLocale(field)` 헬퍼도 KO only 로 단순화 — `field?.ko ?? ""` 반환. EN 확장 시 lang 파라미터 + 분기 1줄 추가.

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
    { name: "slug",        type: "slug",              options: { source: (doc: any) => doc?.title?.ko ?? "" } },
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
    { name: "slug",          type: "slug",              options: { source: (doc: any) => doc?.title?.ko ?? "" } },
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
    { name: "slug",      type: "slug",               options: { source: (doc: any) => doc?.title?.ko ?? "" } },
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
    { name: "slug",       type: "slug",               options: { source: (doc: any) => doc?.title?.ko ?? "" } },
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
    { name: "slug",  type: "slug", options: { source: (doc: any) => doc?.title?.ko ?? "" } },
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

### 5.1 라우팅 (1차 오픈 — KO only)

| 한국어 |
|---|
| `/` |
| `/about` (+ `/about/philosophy`, `/about/ceo`, `/about/history`, `/about/people`) |
| `/consulting` (+ `/consulting/[slug]`) |
| `/academy` (+ `/academy/[slug]`) |
| `/community` (+ `/community/[slug]`) |
| `/image-lab` (2차 오픈 조건부, +`/image-lab/[slug]`) |
| `/contact` |
| `/color-quiz/result/[type]` |
| `/privacy`, `/terms` (콘텐츠 입수 후) |

`<html lang>` 은 BaseLayout 에서 `"ko"` 고정 (lang prop 제거). hreflang 태그 없음.

### 5.2 영어 확장 마일스톤 (별도 / 미확정)

**왜 1차 오픈에서 다국어 제외**:
- 기획안 v2 의 zh 결정은 클라이언트 의향 미반영 가능성 — 사용자 판단 (v1.3.8).
- 영어 진출 결정도 미확정. "확정 아닌 상태로 인프라 미리 짓는 것은 시간 낭비" (v1.3.8 사용자 결정).
- 인프라만 만들고 콘텐츠 비면 dead code + SEO hreflang 이 빈 페이지 가리키는 마이너스.

**언제 EN 추가하는가**:
- 클라이언트가 영어권 영업 의향 확정한 시점
- 또는 V-Directors 마케팅 판단으로 카피 준비 가능 시점

**EN 추가 시 작업 범위 (예상 ~2일 + 콘텐츠)**:
1. Sanity 스키마: `localeString` / `localeText` / `localeBlockContent` 의 fields 에 `{ name: "en", type: "string" | "text" | "array" }` 추가. KO 데이터 마이그레이션 없음 (객체 구조 그대로, en 키만 신설).
2. GROQ 쿼리: 직접 필드명 → `coalesce(field.en, field.ko)` 패턴 적용
3. 프론트엔드 `types/sanity.ts` 의 `pickLocale(field, lang)` 시그니처에 lang 파라미터 + 분기 1줄 추가. 모든 인터페이스에 `en?` 옵셔널 추가
4. `apps/web/src/layouts/BaseLayout.astro` 에 `lang` prop 재도입 + `<html lang>` 동적
5. `components/layout/LangToggle.astro` 신설 (Header 우측 `KO | EN` 토글)
6. hreflang 태그 자동 출력 (BaseLayout `<head>`)
7. `/en/...` 미러 라우트 17개 (KO 페이지 1:1 미러)
8. 정식 EN 카피 작성 + Studio 입력 (마케팅 작업, 본질적 비용)

**라우팅 패턴 (EN 추가 시)**:
| 한국어 (기본) | 영어 |
|---|---|
| `/about` | `/en/about` |
| ... | ... |

URL prefix 는 `/en/`. 기본 언어 KO 는 prefix 없음.

**zh 추가 가능성**: 클라이언트가 추후 중국 시장 진출로 zh 추가 결정하면, 위와 동일한 1줄 패치 패턴 적용 (스키마 `localeString.fields` 에 `{ name: "zh", type: "string" }` 추가 + GROQ `coalesce(field.zh, field.en, field.ko)` + types/sanity.ts 의 인터페이스 + lang 분기). 코드 비용은 EN 과 독립적으로 같음. 콘텐츠 비용은 별개. 즉 v1.3.8 의 zh 폐기 결정은 미래 zh 추가 가능성을 차단하지 않음.

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
- 흰 배경 (`bg-background`) — `feedback_design_tone` 규칙 #1 (모든 섹션 흰 바탕 통일, 푸터만 검은색)
- 큰 카피 (세리프): **"보이는 것을 함께 쌓는 일."** — `feedback_design_tone` 규칙 #9 (Hero "보이는 것이, 전해지는 것입니다" 와 수미 호응)
- 영문 부제 (세리프 italic): **"What we build, together."**
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

- 섹션 1 — 페이지 헤더 (`ContactPageHead.astro` → `PageHead` 패턴)
  - 가운데 정렬 큰 세리프 italic lowercase 제목 — **"contact"**
  - 부제 없음 — `feedback_design_tone` 규칙 #3 (카테고리 페이지 PageHead 부제 금지)
  - 서브 메뉴: `Personal / Corporate ★ / Academy` (filterKey="form")

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

### 6.10 데이터 필터링 (SSG 환경) — v1.3.5

> **함정**: Astro 5 + Cafe24 정적 호스팅 = **순수 SSG 빌드**. 빌드 타임에 `Astro.url.searchParams.get()` 은 **1회만 평가** 되며, 결과적으로 모든 쿼리에 대해 **동일한 HTML 1개만 생성**된다. 즉 `/consulting?category=corporate` 와 `/consulting?category=media` 는 같은 HTML 을 서빙한다 → **서버 필터 효과 0**.

#### 6.10.1 잘못된 패턴 (작동하지 않음)
```astro
---
// /consulting/index.astro — SSG 에서 작동 안 함
const categoryParam = Astro.url.searchParams.get("category");
const filtered = categoryParam
  ? services.filter((s) => s.category === categoryParam)
  : services;
---
{filtered.map((s) => <Card ... />)}
```

#### 6.10.2 올바른 패턴 — **모든 카드 박은 정적 HTML + 클라이언트 JS 필터** (옵션 A)

서버에서는 모든 카드를 노출하고, 각 카드에 `data-*` 속성을 박는다. 클라이언트 JS 가 URL 쿼리 읽어서 매칭 안 되는 카드를 `hidden` 처리. URL 변경 시 nav active 표시도 동기화.

```astro
---
// /consulting/index.astro
const services = await sanityClient.fetch<Service[]>(servicesAllQuery);
---

<ConsultingPageHead />

<section class="bg-background">
  <div class="mx-auto max-w-[var(--container-max)] px-[var(--container-padding)] py-24">
    <div class="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-20" data-filter-root>
      {services.map((service) => (
        <div data-card data-category={service.category}>
          <CategoryCard ... />
        </div>
      ))}
    </div>
  </div>
</section>

<FilterScript filterKey="category" />
```

`components/common/FilterScript.astro` (v1.3.6 — `defaultValue` prop 추가):
```astro
---
interface Props {
  filterKey: string;
  /** URL 에 해당 키가 없을 때 사용할 기본값. 미지정 시 모든 카드 노출. */
  defaultValue?: string;
}
const { filterKey, defaultValue = "" } = Astro.props;
---

<script is:inline define:vars={{ FILTER_KEY: filterKey, DEFAULT_VALUE: defaultValue }}>
  (function () {
    const KEY = FILTER_KEY;
    const DEFAULT = DEFAULT_VALUE;
    const cards = document.querySelectorAll("[data-card]");
    const nav = document.querySelector(`[data-filter-nav="${KEY}"]`);
    const navLinks = nav ? nav.querySelectorAll("a") : [];

    function apply() {
      // URL 에 키 없으면 DEFAULT 사용. DEFAULT 가 "" 이면 모든 카드 노출.
      const urlValue = new URL(window.location.href).searchParams.get(KEY);
      const value = urlValue ?? DEFAULT;
      cards.forEach((c) => {
        const cardValue = c.getAttribute("data-" + KEY) ?? "";
        const match = value === "" || cardValue === value;
        c.classList.toggle("hidden", !match);
      });
      navLinks.forEach((a) => {
        const linkValue = new URL(a.href).searchParams.get(KEY) ?? "";
        a.classList.toggle("is-active", linkValue === value);
      });
    }

    navLinks.forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = new URL(a.href, window.location.origin);
        history.pushState({}, "", target.pathname + target.search);
        apply();
      });
    });
    window.addEventListener("popstate", apply);
    apply();
  })();
</script>
```

PageHead 의 nav 메뉴는 `data-filter-nav="category"` 컨테이너 + 각 `<a>` 의 active 표시는 CSS `.is-active` 로 처리하면 서버·클라이언트 모두 동일하게 작동.

**적용 대상 (4곳, 일괄)**:
- `/consulting` — `category` (corporate/executive/public/media)
- `/academy` — `level` (기초·심화·실기·강사양성)
- `/community` — `category` (공지/행사/수상·인증/강의·미디어/인터뷰·기고)
- `/contact` — `form` (personal/corporate/academy), **defaultValue="corporate"** (B2B 본진 우선 노출)

**defaultValue 의 의미** (v1.3.6 추가):
- 미지정 — 모든 카드 노출 (Consulting/Academy/Community 같은 카탈로그 패턴)
- 지정 — URL 에 키 없을 때 default 가 active. Contact 처럼 "기본 진입 시 어떤 폼 보일지" 결정해야 하는 단일 페이지 분기에 사용.

> 위 4 곳은 같은 단일 클라이언트 JS 패턴이라 `FilterScript` 컴포넌트로 추출함. defaultValue prop 만 페이지별로 다르게.

---

## 7. 공통 컴포넌트

### 7.1 Header (`components/layout/Header.astro`)

```
[LOGO]                       [About  Consulting  Academy  Community  Contact]                       [    ]
좌측                                          정중앙 (absolute centering)                           우측 (현재 비움)
```

- 좌측: CMK 로고 (텍스트 또는 SVG, `font-serif text-2xl`)
- **정중앙**: nav 메뉴 `About / Consulting / Academy / Community / Contact` (1차 오픈 KO only 라 언어 토글 없음. Image Lab 은 조건부 — 2차 오픈)
- 우측: 비움 (추후 LangToggle 추가 시점에 채움 — §5.2 EN 확장 마일스톤)
- **nav 정렬**: `absolute left-1/2 -translate-x-1/2` (flex 흐름에서 빠지고 헤더 정중앙. 로고 폭과 무관)
- **메뉴 글씨**: `text-[14px] font-semibold uppercase tracking-[0.18em]` — v1.3.9 사용자 결정 (Vogue/W 매거진 톤 유지하면서 가독성 키움). 메뉴 간격 `gap-10`
- 헤더 두께: `py-8` (32px) — `feedback_design_tone` 규칙 #5
- 스크롤 시 행동: 현재 미구현. 1차 오픈엔 정적 헤더 유지 (검수 라운드 또는 Phase 7 결정)

모바일 (`< md` / 768px 미만): nav hidden + 우측 햄버거 "Menu" 버튼. 풀스크린 오버레이는 추후 구현 (1차 오픈은 단순 표시).

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

#### 9.1.1 URL query → 폼 자동 prefill (v1.3.7)

ColorQuiz 결과 페이지 → contact 흐름의 **유입 추적** + Academy 강좌 페이지 → contact 흐름의 **희망 과정 자동 입력** 을 위해, InquiryForm 이 mount 시 URL query 를 클라이언트 측에서 직접 읽어 `source` / `preferredCourse` 등을 자동 채운다.

**왜 서버에서 못 읽나** — §6.10 SSG 함정. `Astro.url.searchParams.get()` 은 빌드 타임 1회 평가라 모든 URL 에 같은 HTML 반환. 그래서 **클라이언트 useEffect 에서 처리**.

```tsx
// InquiryForm.tsx 내부
const PREFILL_FROM_QUERY: Record<InquiryKind, string[]> = {
  personal: [],
  corporate: ["service"],   // ?service=corporate 등 (현재는 추적용)
  academy: ["course"],      // ?course=foundation 등
};
const QUERY_TO_FIELD: Record<string, string> = {
  course: "preferredCourse",
};

useEffect(() => {
  const params = new URL(window.location.href).searchParams;

  // source 는 모든 kind 공통
  const urlSource = params.get("source");
  if (urlSource && !sourceProp) setSource(urlSource);

  // kind 별 prefill
  PREFILL_FROM_QUERY[kind].forEach((k) => {
    const v = params.get(k);
    if (v) {
      const fieldName = QUERY_TO_FIELD[k] ?? k;
      setValues((prev) => ({ [fieldName]: v, ...prev }));  // 기존 입력 우선
    }
  });
}, [kind, sourceProp]);
```

**유입 추적 라벨 규칙**:
- `color-quiz-spring` / `color-quiz-summer` 등 — Color Quiz 결과 페이지 출처
- `consulting-corporate` — Consulting 카드 클릭 출처
- `academy-{slug}` — Academy 강좌 페이지 출처
- (자유 입력 가능)

Sanity inquiry 의 `source` 필드에 박혀서 운영진이 어느 페이지에서 폼 제출이 일어났는지 추적 가능.

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
  /** v1.3.7 — 쉼표 분리 화이트리스트 ("http://localhost:4321,https://cmk-staging.pages.dev,https://cmkimage.co.kr") */
  CORS_ORIGIN: string;
  TURNSTILE_SECRET: string;        // Cloudflare Turnstile secret key
  RATE_LIMIT_KV: KVNamespace;      // 간단 IP 레이트리밋용 (wrangler.toml에 binding)
}

// 요청의 Origin 헤더가 화이트리스트에 있으면 그걸 반환, 없으면 첫 번째 (서버 default).
function resolveAllowedOrigin(req: Request, env: Env): string {
  const allowed = env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  const reqOrigin = req.headers.get("origin") || "";
  if (allowed.includes("*")) return "*";
  if (allowed.includes(reqOrigin)) return reqOrigin;
  return allowed[0] || "";
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
  // ctx 추가 — v1.3.6 ctx.waitUntil() 로 Resend 를 background 처리
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(req, env) });
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
        return Response.json({ ok: true }, { headers: corsHeaders(req, env) });
      }

      // 2) 폼 체류 시간: 너무 빠른 제출은 봇으로 간주
      const loadedAt = Number(formLoadedAt);
      if (!loadedAt || Date.now() - loadedAt < MIN_FORM_AGE_MS) {
        return Response.json({ ok: true }, { headers: corsHeaders(req, env) });
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
          { status: 400, headers: corsHeaders(req, env) }
        );
      }

      // 4) (IP, UA) 조합 rate limit (KV) — 회사 NAT IP에서 다수 담당자 제출 허용
      const ua = req.headers.get("user-agent") || "unknown";
      const rlKey = `rl:${ip}:${hashStr(ua)}`;
      const current = Number((await env.RATE_LIMIT_KV.get(rlKey)) ?? 0);
      if (current >= RATE_LIMIT_MAX) {
        return Response.json(
          { ok: false, error: "rate_limited" },
          { status: 429, headers: corsHeaders(req, env) }
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

      // 6) Resend 발송 — v1.3.6: ctx.waitUntil() 로 background 처리
      //    Sanity 저장 즉시 200 응답 → 클라이언트 대기 시간 최소화 (Resend hanging 영향 0).
      //    AbortController 10 초 timeout — Resend 가 응답 안 줄 때 cut-off.
      //    실패해도 silent log. (운영 패턴 §9.2.1 — Studio 1일 1회 확인 필수)
      const resendPromise = (async () => {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10_000);
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: env.RESEND_FROM,
              to: env.NOTIFY_EMAIL,
              subject: `[${String(kind).toUpperCase()}] 새 문의 — ${fields.name || fields.company || ""}`,
              html: renderEmail(kind, fields),
            }),
            signal: ctrl.signal,
          });
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            console.error("resend_http_error", { inquiryId: doc._id, status: res.status, body });
          }
        } catch (mailErr) {
          console.error("resend_failed", { inquiryId: doc._id, err: String(mailErr) });
        } finally {
          clearTimeout(timeout);
        }
      })();

      ctx.waitUntil(resendPromise);

      return Response.json(
        { ok: true, id: doc._id },
        { headers: corsHeaders(req, env) }
      );
    } catch (err) {
      console.error(err);
      return Response.json(
        { ok: false, error: String(err) },
        { status: 500, headers: corsHeaders(req, env) }
      );
    }
  },
};

function corsHeaders(req: Request, env: Env) {
  return {
    "Access-Control-Allow-Origin": resolveAllowedOrigin(req, env),
    "Vary": "Origin",                          // 캐시가 origin 별로 분리
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
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
# v1.3.7 — 쉼표 분리 화이트리스트. 개발 + staging + 운영 모두 동시 지원.
CORS_ORIGIN = "http://localhost:4321,https://cmk-staging.pages.dev,https://cmkimage.co.kr"

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

> **두 가지 직렬화 패턴 모두 유효** — 폼이 vanilla HTML `<form>`이고 `website` / `turnstileToken` / `formLoadedAt`이 hidden input으로 form 안에 포함되면 아래 `FormData → Object.fromEntries` 패턴이 그대로 동작한다. 폼을 React state로 관리하는 경우는 §9.1의 **명시 payload 패턴**을 사용한다. 둘 중 하나라도 누락 필드 없이 직렬화되기만 하면 됨.

```ts
// vanilla HTML form 케이스 — hidden inputs로 보안 필드 모두 포함된 경우
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

    steps:
      - uses: actions/checkout@v4

      # pnpm 모노레포 — 루트에서 install 후 --filter web 으로 빌드
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 11

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: pnpm-lock.yaml

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build (apps/web)
        env:
          PUBLIC_SANITY_PROJECT_ID:  ${{ secrets.SANITY_PROJECT_ID }}
          PUBLIC_SANITY_DATASET:     ${{ secrets.SANITY_DATASET }}
          SANITY_TOKEN:              ${{ secrets.SANITY_READ_TOKEN }}
          PUBLIC_WORKER_URL:         ${{ secrets.WORKER_URL }}
          PUBLIC_TURNSTILE_SITE_KEY: ${{ secrets.TURNSTILE_SITE_KEY }}
          PUBLIC_SITE_URL:           https://cmkimage.co.kr
        run: pnpm --filter web build

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
- [ ] **카테고리 필터는 §6.10 클라이언트 JS 패턴 사용** — `Astro.url.searchParams.get()` 으로 서버 필터 금지 (SSG 빌드 시 1회 평가라 효과 없음)
- [ ] **Phase 3 완료 시점 — 클라이언트에게 다음 정보 요청**: Cafe24 FTP 호스트/계정/비번/경로, 도메인 등록기관 확인 (Cafe24 자체인지 외부인지)

### Phase 4 — 컬러 퀴즈 & 폼 (Day 6~7)
- [ ] ColorQuiz React island 구현
- [ ] 5개 결과 페이지 (또는 4개)
- [ ] 인스타 공유 카드 (HTML2Canvas)
- [ ] 3개 폼 컴포넌트 (honeypot + Turnstile widget + formLoadedAt 포함, §9.1 참조)
- [ ] **Cloudflare Turnstile widget 발급** (CF 대시보드 → Application security → Turnstile → Add widget. 2026 UI 기준 메뉴명은 "widgets") → `PUBLIC_TURNSTILE_SITE_KEY` + Worker secret `TURNSTILE_SECRET` 등록
- [ ] **Cloudflare KV namespace 생성**: `cd apps/worker && npx wrangler kv namespace create RATE_LIMIT_KV` → 출력된 id 를 `wrangler.toml` 바인딩에 붙여넣기
- [ ] **Resend 가입 + API Key 발급** — 개발용 발신은 `onboarding@resend.dev` 사용 (가입 이메일 1개로만 발송 가능, verification 제한). 정식 도메인 인증은 Phase 6
- [ ] Cloudflare Worker 작성 및 배포 (§9.2) — `ctx.waitUntil()` + AbortController 패턴으로 Resend 격리 (v1.3.6)
- [ ] 로컬에서 폼 제출 → Sanity 저장 즉시 200 응답 → Resend 는 background → end-to-end 확인
- [ ] **Phase 4 종료 시점 — 노출된 모든 secret 재발급**: Sanity Editor token, Resend API key, Turnstile Secret. 채팅·문서·터미널 어디서든 노출됐으면 무조건 새로 발급 후 `.dev.vars` / Worker secret 교체

### ~~Phase 5 — i18n~~ (v1.3.8 폐기)

**폐기 사유**: 기획안 v2 의 zh 결정은 클라이언트 의향 미반영 가능성 + 영어 진출 결정 미확정. KO only 1차 오픈으로 단순화 (§5.2). EN 추가는 별도 마일스톤.

**Day 8 재할당** — 푸터 본격 작업:
- [ ] 현재 `Footer.astro` placeholder 상태를 §1.1·§7.2 명세대로 본격 구현
- [ ] 3컬럼 (회사 정보 · 사이트 맵 · 연락처) + SNS 아이콘 + 법적 링크 (`/privacy`, `/terms`)
- [ ] 매거진 톤 (Nude · Serif · White space)
- [ ] 모바일 1컬럼 자연스럽게

### Day 9 — Phase 6 사전 준비 + 약관 콘텐츠 입수 푸쉬 (v1.3.8 신설)
- [ ] **약관 콘텐츠 입수 푸쉬**: 클라이언트한테 `/privacy` (개인정보처리방침) + `/terms` (이용약관) 본문 요청. 법무 검토 필요라 lead time 길어 일찍 시작. 도착 시 KO 페이지 신설.
- [ ] **Phase 6 사전 준비**: Cafe24 FTP 정보 확보 (§13.2 Phase 3 끝 체크리스트가 미해결이면 여기서), DNS 권한 확인, Resend 클라이언트 도메인 인증 시작 (DKIM 1~3 + SPF + DMARC TXT 등록 — propagation 수 분~수 시간)
- [ ] GitHub Actions Secrets 등록 검증 (§10.3)

### Day 10 — 전체 디자인 검수 라운드 (v1.3.8 신설)
- [ ] **클로드B 통합 디자인 메모 작성**: Phase 3/4 검수 시 흩어진 디자인 메모 (사소한 메모 4건 등) 한 번에 통합 + 페이지별 일관성 점검 리포트
- [ ] **사용자 직접 검수**: 모든 페이지 (HOME · ABOUT 5 · CONSULTING · ACADEMY · COMMUNITY · CONTACT · 색상 퀴즈 흐름) 브라우저에서 시각 검수
- [ ] 수정 사이클 1회 + 클로드B 최종 PASS

### Phase 6 — 배포 (Day 11)
*기존 Phase 6 항목 그대로 (아래)*


- [ ] GitHub Actions workflow 작성
- [ ] (Phase 3에서 확보된) Cafe24 FTP 정보를 GH Secrets 등록
- [ ] 도메인 연결 — 등록기관에 따라 분기: **Cafe24 자체 등록**이면 네임서버 위임 자동, **외부 등록**이면 A 레코드(또는 CNAME)로 Cafe24 IP 가리키도록 설정
- [ ] Resend 클라이언트 도메인 인증 — DKIM(1~3) + SPF + DMARC TXT 레코드 등록 → Worker secret `RESEND_FROM` 을 `noreply@cmkimage.co.kr` 형태로 교체
- [ ] Sanity webhook → GitHub repository_dispatch 연결
- [ ] 첫 배포 후 도메인 연결 확인
- [ ] SSL 적용 확인

### Phase 7 — QA & 다듬기 (Day 12)
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

### 13.5 Secret 회전 절차 (v1.3.7) — 필수 운영 메뉴얼

**다음 상황에서 무조건 실행**:
- 채팅·문서·커밋·터미널 어디서든 실 secret 이 한 번이라도 노출됨
- 팀원·운영진 변경
- 정기 회전 (분기 1회 권장)
- 운영 이관 시점 (V-Directors → 클라이언트, §13.1 참조)

**영향 시나리오 (회전 안 하면)**:
| Secret | 노출 시 가능 공격 |
|---|---|
| **Sanity Editor token** | 누구나 contactInquiry·콘텐츠 변조·삭제 가능 |
| **Resend API key** | cmkimage.co.kr 이름으로 임의 메일 발송 → 도메인 reputation 영구 손상 |
| **Turnstile Secret** | CAPTCHA 우회 토큰 위조 가능 → 봇 무방비 |

#### 13.5.1 Sanity Editor Token 회전
1. https://www.sanity.io/manage → CMK Image Korea → **API** 탭 → **Tokens**
2. 기존 토큰 `…` → **Delete** (= revoke)
3. **+ Add API token** → 동일 이름·Editor 권한으로 새 발급
4. 새 토큰 즉시 Worker 측 secret 교체:
   ```bash
   cd apps/worker
   npx wrangler secret put SANITY_TOKEN
   # (prompt 에 새 토큰 붙여넣기)
   ```
5. 로컬 dev: `apps/worker/.dev.vars` 의 `SANITY_TOKEN=` 라인 직접 교체 (채팅·git 절대 노출 금지)
6. Worker dev 서버 재시작 (`Ctrl+C` → `npx wrangler dev --port 8787`)

#### 13.5.2 Resend API Key 회전
1. https://resend.com/api-keys → 기존 키 `…` → **Delete**
2. **Create API Key** → `Sending access` 권한 → 새 키 발급
3. Worker secret 교체:
   ```bash
   cd apps/worker
   npx wrangler secret put RESEND_API_KEY
   ```
4. `.dev.vars` 의 `RESEND_API_KEY=` 교체

#### 13.5.3 Cloudflare Turnstile Secret 회전
> Turnstile 은 site 단위로 site_key + secret 페어를 관리. **secret 만 단독 회전이 불가** — 새 widget 생성 또는 기존 widget 의 rotation 기능 사용.

방법 A — 기존 widget 의 **Settings → Rotate secret key** (가능하면 권장, site key 유지)

방법 B — 기존 widget 삭제 후 새 widget 생성 (site key 도 바뀜 → 사이트 환경변수도 교체):
1. CF 대시보드 → Application security → Turnstile → 기존 widget Delete
2. **Add widget** → 새 widget 생성 → 새 site key + secret key 확보
3. Worker secret + 사이트 환경변수 교체:
   ```bash
   cd apps/worker
   npx wrangler secret put TURNSTILE_SECRET
   ```
4. `apps/web/.env` 의 `PUBLIC_TURNSTILE_SITE_KEY=` 도 교체 (방법 A 는 site key 유지라 이 단계 생략)
5. GH Actions Secrets 에도 `TURNSTILE_SITE_KEY` 교체 (Phase 6 배포 후라면)

#### 13.5.4 회전 후 검증
1. Worker dev 서버 **재시작** (`Ctrl+C` → `npx wrangler dev --port 8787`) — wrangler 의 `.dev.vars` hot-reload 한계로 재시작 필수 (§3.7.5)
2. 브라우저에서 `/contact` 폼 1회 제출
3. Sanity Studio "문의 내역" 에 새 inquiry 정상 생성 확인
4. Worker 로그 (dev 서버 stdout) 에서 `resend_failed` / `sanity_unauthorized` 같은 에러 없는지 확인. Resend 403 (`validation_error` "You can only send testing emails to your own email address") 은 dev 환경 도메인 미인증 제약으로 정상 — Phase 6 도메인 인증 후 해소

#### 13.5.5 Grep / Bash 사용 시 secret 파일 노출 방지 (v1.3.8)

`Grep` 의 검색 경로에 `.dev.vars` / `.env*` 파일이 간접적으로 포함되면, 패턴이 토큰 값 안의 부분 문자열(예: `zh`, `re_`, `sk_`, `0x`) 에 매치되어 **토큰 값이 통째로 grep 결과에 출력**되어 채팅 transcript 노출됨. v1.3.7 → v1.3.8 회전 검증 중 실 사고 1건 발생 (RESEND_API_KEY 즉시 재회전 필요).

**필수 규칙**:
- `Grep path` 에 디렉토리를 지정할 때 (예: `apps`, `apps/worker`, 프로젝트 루트), 그 안에 secret 파일이 있을 가능성 검토 필수
- secret 파일이 포함될 가능성이 있으면 반드시 `--glob "!**/.dev.vars"` `--glob "!**/.env*"` 둘 다 추가
- 보수적 안전 패턴: 코드 검색은 `apps/web/src` / `apps/studio/schemas` 처럼 src 안쪽으로 한정. `apps/worker` 통째 검색 금지 — `apps/worker/src` 로 좁힘
- 짧은 알파벳·숫자 패턴 (2~3자) 은 토큰 값 부분 문자열에 매치될 위험 매우 높음 → glob 제외 의무

이 규칙은 클로드A·B 모두에게 적용. Anthropic 서버에 대화 저장되므로 한 번 노출 = 영구 노출로 간주.

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

**이 문서는 v1.3.9이며, 개발 진행 중 발견되는 결정 사항은 본 문서에 추가·갱신함.**

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
- v1.3.1 — 클로드B v1.3 재검토 잔여 2건 정리:
  - §9.4 프론트엔드 호출 예시 위에 **두 패턴 병기 명시** 박스 추가 — vanilla HTML form은 `FormData → Object.fromEntries` 패턴, React state 폼은 §9.1의 명시 payload 패턴, 둘 다 유효
  - §12 Phase 4 체크리스트 오타 수정 ("정상 인 동작" → "정상 동작")
- v1.3.2 — Phase 1 산출물(pnpm 모노레포)에 맞춰 §10.1 GH Actions 워크플로 pnpm 전환:
  - `pnpm/action-setup@v4` 단계 추가 (pnpm 11 핀)
  - `actions/setup-node@v4` 의 `cache: 'npm'` → `cache: 'pnpm'`, `cache-dependency-path: pnpm-lock.yaml` (루트 lockfile)
  - `npm ci` → `pnpm install --frozen-lockfile` (루트 install로 워크스페이스 전체 한 번에)
  - `npm run build` → `pnpm --filter web build` (모노레포 필터)
  - `defaults.run.working-directory: ./apps/web` 제거 (루트 실행으로 변경, FTP local-dir는 그대로 `./apps/web/dist/`)
- v1.3.3 — Phase 2 실작업 중 발견된 명세 ↔ Sanity v3 동작 차이 2건 수정:
  - **(실 버그)** §4.1 sanity.config.ts 의 `S.listItem()`에 **`.id("siteSettings")` 추가**. v3.99에서는 `S.documentTypeListItem("type")` 헬퍼와 달리 순수 `S.listItem()`은 id가 자동 생성되지 않아 `"id is required for list items"` 에러로 Studio가 아예 안 열림. Phase 2.4에서 실제 발견됨
  - **(실 버그)** §4.3.2 service / §4.3.3 academyCourse / §4.3.4 post / §4.3.5 labArticle / §4.3.10 page 의 slug 정의를 `source: "title.ko"` **dot-notation 문자열**에서 `options: { source: (doc) => doc?.title?.ko ?? "" }` **function source**로 변경. 커스텀 object(`localeString`) 내부 필드는 string path로는 안정적으로 안 잡혀 Generate 버튼이 동작 안 함. Phase 2.4에서 실제 발견됨
- v1.3.4 — Phase 2 클로드B 검토 메모 #2(싱글톤 enforcement) 즉시 반영:
  - §4.1 sanity.config.ts 에 `document.actions` + `newDocumentOptions` 콜백 추가로 **siteSettings 싱글톤 강제**. 구조 메뉴 단일화에 더해 "Create new" 글로벌 진입 차단 + delete/duplicate/unpublish 액션 차단. 운영진 실수로 siteSettings가 2개 이상 생성되는 사고 방지
  - `SINGLETON_TYPES` Set 으로 확장 가능 구조 (향후 다른 싱글톤 추가 시 Set에 type 이름만 추가)
- v1.3.5 — Phase 3 작업·검수 중 발견된 함정 3건 패턴 명세화:
  - §3.7.1 **Tailwind v4 jit arbitrary value 누락 시 inline style fallback** 규칙 — 큰 `clamp()` 와 큰 gap 은 inline `style` 로 강제. PageHead 의 about 제목 크기와 메뉴 gap 적용 안 됐던 실 사례 (Phase 3)
  - §3.7.2 **Astro `class:list` 안 multi-line ternary 회피** — template literal 또는 short-circuit. Phase 1·3 Header 에서 두 번 `Expected "}" but found ":"` 빌드 에러로 발견
  - §6.10 **SSG 환경에서 query string 필터는 클라이언트 JS 로** — `Astro.url.searchParams.get()` 은 빌드 타임 1회 평가라 모든 쿼리에 동일 HTML 반환. `data-*` 속성 + 클라이언트 필터 + URL 동기화 패턴 명세 + 옵션 A 코드 스니펫 포함. /consulting · /academy · /community · /contact 4 곳 동일 패턴 적용 필수
- v1.3.6 — Phase 4 실작업·검증 중 발견된 함정·운영 패턴 5건 명세화:
  - §3.7.3 **pnpm 11+ `verify-deps-before-run` 자동 install 차단 회피** — 루트 `.npmrc` 에 `verify-deps-before-run=false` 또는 `npx wrangler` 우회. Phase 4 wrangler login 시 sharp@0.33.5 빌드 차단으로 exit 1 발생한 실 사례
  - §9.2 Worker — Resend 발송을 **`ctx.waitUntil()` background + AbortController 10초 timeout** 으로 격리. Sanity 저장 즉시 200 응답. 실 사례: Resend `onboarding@resend.dev` 가 reject 응답을 늦게 줘서 클라이언트 127초 hanging 발생 → ctx.waitUntil 로 해결
  - §6.10 FilterScript 에 **`defaultValue` prop 추가** — URL 에 키 없을 때 기본 노출 카드 지정. Contact 페이지의 3 폼 중 Corporate 가 기본이어야 했던 실 사례
  - §12 Phase 4 — Resend `onboarding@resend.dev` 발신 제한 명시 (가입 이메일 1개로만 발송, 도메인 인증은 Phase 6)
  - §12 Phase 4 종료 시점 — **모든 노출 secret 재발급** 의무화 (Sanity Editor token / Resend API key / Turnstile Secret). 채팅·문서·터미널 어디서든 노출 시 무조건 새로 발급
- v1.3.7 — 클로드B Phase 4 검수 메모 3건 반영:
  - §9.1.1 **InquiryForm URL query 자동 prefill** — ColorQuiz 결과 → contact, Academy 상세 → contact 흐름의 `?source=color-quiz-spring` / `?course=foundation` 등을 클라이언트 useEffect 에서 직접 읽어 폼·source 추적에 자동 주입 (SSG 함정 회피)
  - §9.2/§9.3 **CORS_ORIGIN 다중값 화이트리스트** — 쉼표 분리로 개발 + staging + 운영 도메인 동시 지원. `resolveAllowedOrigin()` 함수 + `Vary: Origin` 헤더. Phase 5/6 Cloudflare Pages staging 띄울 때 CORS 막힘 방지
  - §13.5 **Secret 회전 절차 박스 신설** — Sanity Editor token / Resend API key / Turnstile Secret 의 3 콘솔 위치 + wrangler 명령 + `.dev.vars` 교체 + 검증 절차 명문화. 노출 시·정기·이관 시점 모두 사용
- v1.3.8 — 다국어 정책 재결정 + dev 환경 함정 4건 + 보안 운영 절차 1건 명문화:
  - **§0 / §5 — 다국어를 KO only 로 단순화 (Phase 5 폐기)**. 기획안 v2 의 zh 결정은 클라이언트 의향 미반영 가능성 + 영어 진출 미확정 → 1차 오픈 KO only. EN 확장은 별도 마일스톤(§5.2). 코드 측 zh 잔재 제거 — Sanity 스키마 (`localeString` / `localeText` / `localeBlockContent`) 의 `zh` 필드 삭제, 프론트 `BaseLayout.astro` 의 `lang` prop 제거, `types/sanity.ts` 의 `Lang` 타입 및 `pickLocale` 의 lang 분기 제거. 객체 구조(`{ko}` 단일 키) 는 유지해 추후 EN 확장 시 1줄 추가로 끝
  - **§4.2 — 다국어 헬퍼 KO only 명시** + EN 확장 시점의 1줄 패치 예시 주석
  - **§3.7.4 신설** — pnpm `--filter` 가 `.npmrc` 의 `verify-deps-before-run=false` 를 무시. `pnpm --filter web dev` / `pnpm --filter studio dev` 가 `[ERR_PNPM_IGNORED_BUILDS] sharp@0.33.5` 로 exit 1. 우회: 각 앱 디렉토리에서 `npx astro dev` / `npx sanity dev` 직접 실행 (worker `npx wrangler dev` 패턴 확장)
  - **§3.7.5 신설** — wrangler dev 의 `.dev.vars` hot-reload 한계. secret 회전 후 토큰이 거부되면 `Ctrl+C` → 재기동 필수. 토큰 회전 검증 시 실 발생
  - **§3.7.6 신설** — dev 서버 좀비 프로세스 정리 패턴. `Get-NetTCPConnection -LocalPort` + `Stop-Process -Id ... -Force`. 메모상 "이전 세션 종료 시 멈춤" 으로 적혀 있어도 실제로 살아있을 수 있음
  - **§13.5.4 보강** — Worker 재시작 단계 명시 + Resend 403 dev 제약 (도메인 미인증) 정상 동작 안내
  - **§13.5.5 신설** — Grep / Bash 사용 시 secret 파일 노출 방지 규칙. `apps` 전체 grep 시 `--glob "!**/.dev.vars"` 의무. v1.3.7 → v1.3.8 회전 검증 중 RESEND_API_KEY 1회 노출 → 즉시 재회전한 실 사고. 짧은 패턴이 토큰 값 부분 문자열에 매치되는 위험을 명문화
  - **§12 Phase 5 폐기 + Day 8/9/10 재할당** — Day 8 푸터 본격 작업, Day 9 약관 콘텐츠 입수 + Phase 6 사전 준비, Day 10 전체 디자인 검수 라운드. Phase 6 → Day 11, Phase 7 → Day 12
- v1.3.9 — 클로드B v1.3.8 검수 메모 4건 반영 + Header 디자인 결정 1건 명문화:
  - **§6.1 섹션 7 (HOME ContactCta) 카피 동기화** — "지금, 상담을 시작합니다." → "보이는 것을 함께 쌓는 일." (`feedback_design_tone` #9 인용). 영문 부제는 "What we build, together." 로 명시. 배경은 흰색 (`bg-background`, `feedback_design_tone` #1)
  - **§6.7 섹션 1 (CONTACT 페이지 헤더) 정정** — 옛 "한 줄: 지금, 상담을 시작합니다." 부제 제거. `PageHead` 패턴 ("contact" 세리프 italic lowercase + 부제 금지, `feedback_design_tone` #3) + 서브 메뉴 `Personal / Corporate ★ / Academy` 명시
  - **§5.2 EN 확장 마일스톤에 zh 추가 가능성 1줄 추가** — 추후 zh 추가 결정 시도 EN 과 같은 1줄 패치 패턴, 코드 비용 동일·콘텐츠 비용 별개. v1.3.8 zh 폐기 결정이 미래 zh 추가를 차단하지 않음을 명시
  - **§7.1 Header 명세 갱신** — nav 정중앙 absolute centering (`left-1/2 -translate-x-1/2`), 메뉴 글씨 `text-[11px]` → `text-[14px]`, 간격 `gap-10` (사용자 결정 — Vogue/W 매거진 톤 유지하면서 가독성 키움). 1차 오픈 KO only 라 언어 토글 자리 비움 (§5.2 EN 확장 시 채움)
  - **메모 인덱스 보강** — `MEMORY.md` 가 실제 메모 7건을 모두 등록하도록 재구성 (User 1 / Project 1 / Reference 1 / Feedback 4). 깨진 link 제거 (`project-phase4-complete-phase5-pending`) + `feedback_secrets` cross-link 갱신

— V-Directors · 2026
