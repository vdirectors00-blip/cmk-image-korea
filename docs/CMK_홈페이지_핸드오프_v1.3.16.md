# CMK 이미지코리아 홈페이지 리뉴얼 — Claude Code 핸드오프 v1.3.16

> 본 문서는 **v1.3.14 → v1.3.16 변경분만** 명문화. 전체 명세·기술 스택·디자인 시스템·Phase 로드맵은 `docs/CMK_홈페이지_핸드오프_v1.3.14.md` 정본 유지.
> v1.3.16 은 **콘텐츠 시드 자동화 + 카테고리 라우팅 + LogoWall 정규화 + 매거진 톤 강화** 4 축의 패치 묶음.

---

## 0. 한눈에 보기

| 항목 | v1.3.14 → v1.3.16 |
|---|---|
| 버전 | v1.3.14 (Day 10 디자인 검수 마무리) → **v1.3.16 (Day 10 콘텐츠 시드 + 라우팅 + LogoWall)** |
| 날짜 | 2026-05-26 |
| post 도큐먼트 수 | 4 → **154** (65 강의·미디어 + 89 뉴스) |
| clientLogo 도큐먼트 수 | 10 임시 → **49** (32 = LogoWall 표시용 + 17 = audit 잔재·`consentGiven=false`) |
| Community 라우트 | `/community` 1축 → **3축** (`/community`, `/community/media`, `/community/news`) |
| LogoWall | 텍스트 10건 | → **4 섹션 × 8 박스 = 32 컬러 로고 grid** |
| 매거진 톤 | 컬러 thumbnail | → **grayscale + group-hover 컬러 복귀** (PostCard 한정) |
| audit §2-4 정정 | "감사원장" 인용 | → **사용자 부정 → 전면 제거** (`client-bai` 삭제, "법무부" 로 치환) |
| Consulting [slug] | 상단 image HERO | → **HERO 제거** (사용자 결정 — 사이즈 불일치) |
| 함정 패턴 | §3.7.6 + §13.5.6 | **§3.7.7 ~ §3.7.12 신설 6건** (시드·라우팅·BOM·pnpm·sanity CLI·dev 좀비) |

### v1.3.16 변경 요약 표 (10 항목)

| # | 영역 | 변경 |
|---|---|---|
| 1 | 영상 65 시드 | `apps/web/public/videos/media-001..065.mp4` (572MB, 사용자 캡처) + `apps/studio/scripts/media-data.json` 자동 생성 + `seed.ts` 가 JSON 읽어 65 post (category=강의·미디어, videoUrl 포함) 시드 |
| 2 | 뉴스 89 시드 | 9 페이지 스크린샷 OCR (`스크린샷/news/뉴스1-9.png`) → `apps/studio/scripts/news-data.json` 89 항목 (별표 4 공지 + 번호 1-85, slug=news-001~089) + `seed.ts` 가 89 post (category=뉴스) 시드 |
| 3 | Community 카테고리 라우팅 | `/community` (전체 13 페이지) + `/community/media` (6 페이지) + `/community/news` (8 페이지). nested dynamic route `[category]/index.astro` + `[category]/page/[page].astro`. `postsByCategoryQuery` 신설 |
| 4 | LogoWall 정규화 | `apps/web/public/images/clients/{public-affairs,luxury-corporate,finance,school}/` 4 폴더 × 8 PNG. `CLIENT_LOGO_MAP` 정적 매핑 (32 항목, LogoWall.astro 내부). 박스 = `aspect-[16/7] + border-line + bg-white + object-contain`. 하단 italic 통합 캡션 |
| 5 | 매거진 톤 PostCard | thumbnail = `grayscale brightness-90 → group-hover:grayscale-0 group-hover:brightness-100`. Vogue / Marie Claire 패턴. 영상 재생 페이지 자체는 컬러 유지 |
| 6 | 뉴스 카드 제목 축소 | `clamp(26px-40px)` → `clamp(13px-20px)` + `leading-[1.25]` |
| 7 | post 스키마 videoUrl | `apps/studio/schemas/documents/post.ts` field 추가 + `apps/web/src/types/sanity.ts` Post interface + `queries.ts` 3 쿼리 projection |
| 8 | community/[slug] 영상 embed | `<video controls preload="metadata" playsinline>` aspect-video. videoUrl 없으면 coverImage 또는 텍스트만 (뉴스) |
| 9 | 감사원 제거 (사용자 정정) | `client-bai` → `client-moj` (법무부) 로 치환. `consulting/[slug].astro` "주요 사례" 카피 정리. `cleanup.ts` 신설로 잔재 도큐먼트 삭제 |
| 10 | Consulting [slug] HERO 제거 | 사용자 피드백 "사이즈 안 맞음" → 상단 image 영역 제거. 인덱스 카드 (`/consulting`) image 는 유지. `service-hero-fallback.ts` 의 `personal` 추가 |

### v1.3.15 산출물 — 보강 명시 (검수 #13 회신 반영)

v1.3.14 핸드오프 의 "v1.3.15+ 후속 작업 보류" 와 다르게 실제 진행된 산출물 4건. v1.3.17 핸드오프에서 정식 명문화 권장.

| # | 영역 | 변경 |
|---|---|---|
| v15-1 | Consulting 3축 카드 컴포넌트 | `apps/web/src/lib/consulting-axes.ts` 신설 — `CategoryAxes` 데이터 모듈 (5 카테고리 × 3 축 × 형식별 modules) + `apps/web/src/components/consulting/ConsultingAxes.tsx` React island (`client:visible` 카드 토글) |
| v15-2 | service-personal 추가 | `seed.ts` service 4건 → **5건** (personal 추가). `service-hero-fallback.ts` 의 personal 매핑 = v1.3.16. consulting 페이지에만 노출 (HOME ServiceCards `slice(0, 4)` 유지) |
| v15-3 | ConsultingPageHead 5 카테고리 | `apps/web/src/components/consulting/ConsultingPageHead.astro:12-18` — corporate/executive/public/media/**personal** nav |
| v15-4 | consulting/[slug] axes 분기 | `consulting/[slug].astro:6, 28, 62-70` — `axesData = consultingAxesByCategory[service.category]` 가 있으면 `ConsultingAxes` 카드, 없으면 PortableText fallback |

---

## 1. 영상 65 시드 + 자동화

### 1.1 파일 위치

```
apps/web/public/videos/
├── media-001.mp4
├── media-002.mp4
├── ...
└── media-065.mp4
```

- 총 65 파일, 합계 약 572MB, 평균 8.8MB
- 사용자 캡처 영상 — 강의·방송·미디어 영상의 짧은 클립
- 정적 배포 결정 — **GitHub 포함 + Cafe24 FTP 정적 배포**. Sanity Asset CDN 또는 Cloudflare R2 미사용 (트래픽·비용 양쪽 무료 티어 안에서 해결)

### 1.2 메타데이터 JSON 자동 생성

`apps/studio/scripts/media-data.json` 패턴:

```json
{
  "items": [
    {
      "slug": "media-001",
      "title": "임원 PI · 단상에서의 첫 1분",
      "publishedAt": "2024-08-12",
      "videoUrl": "/videos/media-001.mp4"
    },
    ...
  ]
}
```

생성 절차 (1회성):
1. 사용자가 `apps/web/public/videos/` 에 mp4 65개 업로드
2. PowerShell 스니펫으로 파일명 → JSON 자동 생성 (날짜는 mtime, title 은 비워두고 사용자가 후속 채움)
3. JSON commit 후 seed.ts 가 빌드 시 읽음

### 1.3 seed.ts 자동 패턴

```ts
import mediaData from "./media-data.json" with { type: "json" };

const mediaPosts = mediaData.items.map((item) => ({
  _id: `post-${item.slug}`,
  _type: "post",
  slug: { current: item.slug, _type: "slug" },
  category: "media",            // 강의·미디어
  title: { ko: item.title },
  publishedAt: item.publishedAt,
  videoUrl: item.videoUrl,
}));
```

`createOrReplace` 패턴 — idempotent. 재실행 시 동일 데이터로 덮어쓰기.

### 1.4 영상 호스팅 결정 배경

- **Cafe24 정적 호스팅 트래픽** — 무료 티어 일 5GB. mp4 평균 8.8MB × 일 100 재생 = ~880MB. 여유 있음
- **GitHub 저장소 크기** — 572MB. GitHub 권장 1GB 제한 안. LFS 미사용
- **CDN 캐싱** — Cafe24 캐싱 없음. 향후 트래픽 폭증 시 R2 + Cloudflare Workers signed URL 이관 (코드 영향 최소 — `videoUrl` 절대경로만 교체)

---

## 2. 뉴스 OCR + 시드

### 2.1 OCR 소스

```
스크린샷/news/
├── 뉴스1.png    (16 항목)
├── 뉴스2.png    (12 항목)
├── ...
└── 뉴스9.png    (9 항목)
```

9 페이지 = 별표 4 공지 + 번호 1-85 = **총 89 항목**. 사용자 보유 기존 사이트의 News 게시판 capture.

### 2.2 news-data.json 구조

```json
{
  "items": [
    {
      "slug": "news-001",
      "title": "감사원 신임 사무차장 의전 강의",
      "publishedAt": "2024-03-15",
      "isPinned": true,
      "summary": "..."
    },
    ...
  ]
}
```

- slug = `news-001` ~ `news-089` (3자리 zero-padding, 표시 순서 = 별표 공지 우선 + 번호 desc)
- `isPinned: true` 별표 4건이 상단 고정 (`postsByCategoryQuery` 정렬 = `isPinned desc, publishedAt desc`)
- body 본문은 없음 — title + summary 만. `community/[slug].astro` 가 분기

### 2.3 seed.ts 패턴

```ts
import newsData from "./news-data.json" with { type: "json" };

const newsPosts = newsData.items.map((item) => ({
  _id: `post-${item.slug}`,
  _type: "post",
  slug: { current: item.slug, _type: "slug" },
  category: "news",
  title: { ko: item.title },
  summary: { ko: item.summary },
  publishedAt: item.publishedAt,
  isPinned: item.isPinned ?? false,
}));
```

### 2.4 시드 결과 (사용자 확인됨)

```
Seeding 291 documents to Sanity…
  ✓ siteSettings (1)
  ✓ person (73)
  ✓ stat (3)
  ✓ service (5)
  ✓ academyCourse (4)
  ✓ post (154 = 65 media + 89 news)
  ✓ clientLogo (49 incl. 1 consentGiven=false)
  ✓ page (2)
```

---

## 3. Community 카테고리 라우팅

### 3.1 사용자 의도

- `/community` = 전체 13 페이지 (publishedAt desc)
- `/community/media` = 강의·미디어만 6 페이지 (65 / 12)
- `/community/news` = 뉴스만 8 페이지 (89 / 12)

이전 v1.3.14 까지는 `/community` 1축에 4 post 만 노출. 154 post 시드 후 카테고리 분리 + 페이지네이션 필수.

### 3.2 파일 구조

```
apps/web/src/pages/community/
├── index.astro                       # 전체 페이지 1
├── page/
│   └── [page].astro                  # 전체 페이지 2-13
├── [category]/
│   ├── index.astro                   # 카테고리 페이지 1
│   └── page/
│       └── [page].astro              # 카테고리 페이지 2-N
└── [slug].astro                      # post 상세 (영상 / 텍스트 분기)
```

### 3.3 `postsByCategoryQuery` 신설

`apps/web/src/lib/queries.ts`:

```ts
export const postsByCategoryQuery = `
  *[_type == "post" && category == $category]
  | order(isPinned desc, publishedAt desc)
  [$start...$end] {
    _id,
    title,
    slug,
    category,
    summary,
    publishedAt,
    isPinned,
    "coverImage": coverImage.asset->url,
    videoUrl
  }
`;

export const postsByCategoryCountQuery = `
  count(*[_type == "post" && category == $category])
`;
```

### 3.4 getStaticPaths 패턴 (PAGE_SIZE 함수 안)

```astro
---
// [category]/page/[page].astro
export async function getStaticPaths() {
  const PAGE_SIZE = 12;                 // ← 함수 안에 선언 필수 (§3.7.7)
  const categories = ["media", "news"];
  const paths = [];

  for (const category of categories) {
    const count = await client.fetch(postsByCategoryCountQuery, { category });
    const totalPages = Math.ceil(count / PAGE_SIZE);

    for (let page = 2; page <= totalPages; page++) {
      paths.push({
        params: { category, page: String(page) },
        props: { category, page, totalPages },
      });
    }
  }
  return paths;
}
---
```

→ `page=1` 은 `[category]/index.astro` 가 담당, `page=2..N` 만 `[category]/page/[page].astro`. nested dynamic 충돌 회피.

---

## 4. LogoWall 32 박스 (정적 매핑)

### 4.1 자산 구조

```
apps/web/public/images/clients/
├── public-affairs/        # 공공기관 8개
│   ├── audit-board.png
│   ├── moj.png            # 법무부 (감사원 자리 대체)
│   ├── jcs.png            # 합참
│   └── ...
├── luxury-corporate/      # 럭셔리·대기업 8개
│   ├── samsung.png
│   ├── hyundai.png
│   ├── sk.png
│   └── ...
├── finance/               # 금융 8개
│   ├── kb.png
│   ├── shinhan.png
│   └── ...
└── school/                # 교육·학교 8개
    ├── ewha.png
    ├── snu.png
    └── ...
```

각 폴더 정확히 8 PNG = **4 섹션 × 8 = 32 컬러 로고**.

### 4.2 CLIENT_LOGO_MAP 정적 매핑

`LogoWall.astro` 내부:

```ts
const CLIENT_LOGO_MAP: Record<string, { src: string; label: string }> = {
  // public-affairs
  "client-audit-board":  { src: "/images/clients/public-affairs/audit-board.png", label: "감사원" },
  "client-moj":          { src: "/images/clients/public-affairs/moj.png",         label: "법무부" },
  "client-jcs":          { src: "/images/clients/public-affairs/jcs.png",         label: "합동참모본부" },
  ...
  // 32 항목
};

const SECTIONS = [
  { key: "public-affairs",   title: "Public Affairs" },
  { key: "luxury-corporate", title: "Luxury · Corporate" },
  { key: "finance",          title: "Finance" },
  { key: "school",           title: "Schools" },
];

const EXCLUDE_NAMES = new Set(["감사원"]);   // Sanity 잔재 차단 fallback
```

### 4.3 박스 디자인

```astro
<div class="grid grid-cols-4 gap-x-6 gap-y-8">
  {logos.map((logo) => (
    <div class="aspect-[16/7] border border-line bg-white flex items-center justify-center p-4">
      <img src={logo.src} alt={logo.label} class="max-w-[78%] max-h-[72%] object-contain" />
    </div>
  ))}
</div>
```

- `aspect-[16/7]` — 가로로 긴 컬러 로고 매거진 박스
- `border-line + bg-white` — 누드 톤 배경에 흰 박스 + 얇은 경계
- `object-contain` — 로고 비율 보존

### 4.4 하단 italic 통합 캡션

```astro
<p class="mt-12 text-center text-muted italic font-serif text-base leading-relaxed">
  그 외 100여 클라이언트와 함께해 왔습니다.
</p>
```

→ 32 박스 = 노출, 나머지는 통합 캡션으로 명시. 사용자 결정 — "모든 클라이언트를 다 노출하면 매거진 톤 깨짐".

### 4.5 Sanity 잔재 차단

`EXCLUDE_NAMES` fallback — Studio 에서 누가 "감사원" 으로 다시 추가해도 LogoWall 출력에서 자동 제외. seed.ts cleanup 후에도 우회 안전판.

---

## 5. Magazine 톤 강화 — PostCard grayscale + hover 컬러

### 5.1 변경 위치

`apps/web/src/components/community/PostCard.astro` thumbnail:

```astro
<div class="aspect-[4/5] overflow-hidden bg-cream">
  {coverImage ? (
    <img
      src={coverImage}
      alt={title}
      class="h-full w-full object-cover
             grayscale brightness-90
             transition-all duration-700 ease-out
             group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.02]"
    />
  ) : videoUrl ? (
    <video
      src={videoUrl}
      muted preload="metadata"
      class="h-full w-full object-cover
             grayscale brightness-90
             transition-all duration-700 ease-out
             group-hover:grayscale-0 group-hover:brightness-100"
    />
  ) : (
    <!-- placeholder -->
  )}
</div>
```

### 5.2 패턴 의도

- Vogue · Marie Claire 패턴 — 카드 grid 에서 컬러는 정보 노이즈, hover 시 reveal
- 영상 thumbnail 도 동일 적용 (브라우저가 첫 프레임을 자동 노출)
- `community/[slug].astro` 상세 페이지 자체는 컬러 유지 — 카드 grid 와 상세 페이지의 톤 분리

### 5.3 뉴스 카드 제목 축소

`PostCard.astro`:

```diff
- <h3 class="font-serif" style="font-size: clamp(26px, 2.4vw, 40px); line-height: 1.15">
+ <h3 class="font-serif" style="font-size: clamp(13px, 1.1vw, 20px); line-height: 1.25">
```

- 뉴스 89개 listing 시 큰 제목이 grid 깨뜨림 → 1/2 축소
- 매거진 본문 캡션 톤 (작은 세리프)

---

## 6. 삽질 패턴 6건 (§3.7.7 ~ §3.7.12)

### §3.7.7 `getStaticPaths` module-scope 변수 인식 X

Astro 의 `getStaticPaths()` 는 빌드 타임에 별도 vm 컨텍스트에서 실행. 파일 상단 module-scope 의 `const PAGE_SIZE = 12` 가 함수 내부에서 `ReferenceError: PAGE_SIZE is not defined` 로 터짐.

**규칙**: `getStaticPaths` 안에서 쓰는 상수는 **함수 안에 선언**.

```diff
- const PAGE_SIZE = 12;
- export async function getStaticPaths() {
-   const count = ...;
-   const totalPages = Math.ceil(count / PAGE_SIZE);   // ← ReferenceError
+ export async function getStaticPaths() {
+   const PAGE_SIZE = 12;
+   const count = ...;
+   const totalPages = Math.ceil(count / PAGE_SIZE);   // ← OK
```

실 사례: `[category]/page/[page].astro` 와 `page/[page].astro` 2 파일 모두 v1.3.16 빌드 1회차 실패.

### §3.7.8 ES module `__dirname` 미정의

Node 24 + sanity 3.99 ESM 환경에서 seed.ts·cleanup.ts 가 `__dirname` 참조 시 `ReferenceError`. CJS 잔재.

**패턴**:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

`media-data.json` / `news-data.json` 의 경로를 `path.join(__dirname, "media-data.json")` 으로 해석할 때 필수.

### §3.7.9 PowerShell `Out-File -Encoding utf8` = UTF-8 BOM 포함

PowerShell 5.1 의 `Out-File -Encoding utf8` 은 **UTF-8 BOM 포함** (`﻿` 선두 1자). Node 의 `JSON.parse()` 가 BOM 만나면 `SyntaxError: Unexpected token` 으로 터짐.

**처리**: seed.ts 에서 BOM strip 유틸 적용.

```ts
const stripBom = (s: string) => s.replace(/^﻿/, "");
const raw = stripBom(fs.readFileSync(jsonPath, "utf8"));
const data = JSON.parse(raw);
```

PowerShell 7+ 는 BOM 없지만 클라이언트 PC 가 5.1 fallback 가능성. 안전판 의무.

### §3.7.10 pnpm v11.1.3 의 `onlyBuiltDependencies` 위치 변경

pnpm 11 부터 `package.json.pnpm.onlyBuiltDependencies` 가 무시됨. `pnpm-workspace.yaml` 의 `onlyBuiltDependencies` 만 인식.

**증상**:
```
> @cmk/web@0.0.1 dev
[ERR_PNPM_IGNORED_BUILDS] sharp@0.33.5, @parcel/watcher@2.4.1
```

**해결**:
1. 루트 `pnpm-workspace.yaml` 에 추가:
   ```yaml
   onlyBuiltDependencies:
     - sharp
     - "@parcel/watcher"
   ```
2. `pnpm approve-builds` 대화형 = **위험**. space 안 누르고 enter 만 누르면 `allowBuilds: false` 가 저장되어 sharp 가 영구 차단. 한 번 잘못 저장하면 `~/.config/pnpm/rc` 수동 편집으로 `true` 복원 필요

**대체 우회** (이미 작성된 패턴): `npx astro dev` / `npx sanity dev` 직접 실행 — pnpm filter 우회 (§3.7.4).

### §3.7.11 sanity-3.99 CLI 의 `--with-user-token` 제약

`npx sanity documents delete` / `npx sanity dataset export` 같은 CLI 명령은 **로컬 login 세션 필요** (`~/.config/sanity/config.json`). `--with-user-token` 플래그도 login 세션 의존.

**우회 패턴**:
- **시드** — `seed.ts` 가 `process.env.SANITY_AUTH_TOKEN` 직접 읽음. CLI 거치지 않고 `@sanity/client` 의 `createClient({ token })` 로 인증. login 세션 불필요
- **삭제** — `cleanup.ts` 별도 스크립트 (createClient + `client.delete(documentId)` 패턴). login 세션 우회

```ts
// apps/studio/scripts/cleanup.ts
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset:   process.env.SANITY_DATASET!,
  token:     process.env.SANITY_AUTH_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const idsToDelete = [
  "client-bai",
  "post-mnd-2024",
  "post-mk-2013",
  "post-ytn-2013",
  "post-channela-2016",
];

for (const id of idsToDelete) {
  await client.delete(id);
  console.log(`✓ deleted ${id}`);
}
```

실행: PowerShell 에서 환경변수 일회성 주입 후 `npx tsx scripts/cleanup.ts`.

### §3.7.12 dev 서버 좀비·포트 충돌

`pnpm web:dev` 또는 `npx astro dev` 가 4321 점유 후 Ctrl+C 안 먹으면 새 dev 가 4322 로 시작. 사용자가 **옛 4321 탭**을 보고 "안 변했다" 오인 — v1.3.16 세션에서 2회 발생.

**규칙**:
- dev 재기동 전에 좀비 정리:
  ```powershell
  Get-Process node | Stop-Process -Force
  ```
- 또는 포트별 PID 확인 후 종료:
  ```powershell
  Get-NetTCPConnection -LocalPort 4321 | Select-Object -Property OwningProcess
  Stop-Process -Id <PID> -Force
  ```
- 새 dev 띄울 때 콘솔 banner 의 포트 번호 (4321 vs 4322) 사용자에게 명시

---

## 7. 시드 명령어 (sanity login 우회 패턴)

### 7.1 일회성 토큰 주입 (PowerShell)

```powershell
# SecureString 패턴 — 채팅 transcript 노출 0
$secure = Read-Host -AsSecureString "SANITY_AUTH_TOKEN"
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$env:SANITY_AUTH_TOKEN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

$env:SANITY_PROJECT_ID = "<projectId>"
$env:SANITY_DATASET    = "production"
```

### 7.2 시드 실행

```powershell
cd apps/studio
npx tsx scripts/seed.ts
```

기대 출력:
```
Seeding 291 documents to Sanity…
  ✓ siteSettings (1)
  ✓ person (73)
  ✓ stat (3)
  ✓ service (5)
  ✓ academyCourse (4)
  ✓ post (154)
  ✓ clientLogo (49)
  ✓ page (2)
Done.
```

### 7.3 cleanup 실행 (1회성)

```powershell
cd apps/studio
npx tsx scripts/cleanup.ts
```

기대 출력:
```
✓ deleted client-bai
✓ deleted post-mnd-2024
✓ deleted post-mk-2013
✓ deleted post-ytn-2013
✓ deleted post-channela-2016
```

### 7.4 세션 종료 후 토큰 정리

```powershell
Remove-Item Env:SANITY_AUTH_TOKEN
Remove-Item Env:SANITY_PROJECT_ID
Remove-Item Env:SANITY_DATASET
```

[[feedback-secrets]] 누적 위반 2건 유지. 본 세션 위반 0건.

---

## 8. 다음 단계 (Claude B 검수 → Day 11)

### 8.1 Claude B 검수 요청

→ `docs/CMK_검수요청_v1316_session2.md` 발행. 9 영역 검수.

### 8.2 Day 11 진입 조건

- [x] 시드 154 post + 49 clientLogo 완료
- [x] community 카테고리 라우팅 (3 축 × 빌드 정적 path)
- [x] LogoWall 32 박스 + 캡션
- [x] 매거진 톤 grayscale + hover
- [x] 감사원 제거 + cleanup
- [x] consulting [slug] HERO 제거
- [ ] **Claude B 검수 → PASS / 패치 권장 회신**
- [ ] **사용자 dev 서버 시각 재확인** (community 3 축 + LogoWall 32 + PostCard grayscale)
- [ ] Phase 6 사전 준비 — 301 매핑표 (audit §12 기존 100+ URL → 신 라우트), Cafe24 FTP 권한, DNS 옵션 B 확정

### 8.3 v1.3.17+ 보류 후보

| 후보 | 사유 |
|---|---|
| 강사진 73명 axes 매핑 + 개별 페이지 | 사용자가 사진·약력·axes 매핑 제공 시 |
| LogoWall 박스 hover 시 회사명 tooltip | 사용자 결정 보류 |
| 영상 자동재생 muted preview | 모바일 Safari 호환 검증 후 |
| Cloudflare R2 + signed URL 이관 | 트래픽 임계 도달 시 |
| Community 검색·태그 필터 | 154 post 도달로 검색 가치 발생. 단 SSG 한계 — 클라이언트 JS 필터 (§6.10) |

---

**관련 메모**: [[project-phase5-dropped-handoff-v138]] [[feedback-collaboration-pattern]] [[feedback-design-tone]] [[feedback-secrets]]

**Changelog**
- v1.3.16 — Day 10 콘텐츠 시드 자동화 + 카테고리 라우팅 + LogoWall 정규화 + 매거진 톤 강화:
  - **영상 65 시드** — `apps/web/public/videos/media-001..065.mp4` (572MB) + `media-data.json` + `seed.ts` 자동 패턴. 정적 호스팅 결정 (GitHub + Cafe24 FTP)
  - **뉴스 89 OCR + 시드** — 9 페이지 스크린샷 OCR → `news-data.json` 89 항목 + `seed.ts` 자동 패턴. isPinned 4건 + 일반 85건
  - **Community 카테고리 라우팅 3 축** — `/community` 전체 + `/community/media` + `/community/news`. nested dynamic `[category]/index.astro` + `[category]/page/[page].astro`. `postsByCategoryQuery` + `postsByCategoryCountQuery` 신설
  - **LogoWall 32 박스 정적 매핑** — `apps/web/public/images/clients/{public-affairs,luxury-corporate,finance,school}/` 4 폴더 × 8 PNG. `CLIENT_LOGO_MAP` 32 항목 + `EXCLUDE_NAMES` Sanity 잔재 차단 fallback. 박스 = `aspect-[16/7] + border-line + bg-white + object-contain`. 하단 italic 통합 캡션 "그 외 100여 클라이언트와 함께해 왔습니다."
  - **감사원 제거 (사용자 정정)** — audit §2-4 "양건·황찬현 감사원장" 자료 사용자 부정. `seed.ts` clientLogos `client-bai` → `client-moj` (법무부) 치환. `consulting/[slug].astro` "주요 사례" 카피 정리. `cleanup.ts` 신설로 잔재 도큐먼트 5건 (client-bai + 기존 4 post) 삭제
  - **Consulting [slug] HERO 제거** — 사용자 피드백 "사이즈 안 맞음" → 상단 image 영역 제거. 인덱스 카드 (`/consulting`) image 는 유지. `service-hero-fallback.ts` 의 `personal` 추가 (사용자 제공 `개인이미지.png`)
  - **PostCard thumbnail grayscale + hover 컬러** — Vogue / Marie Claire 패턴. `grayscale brightness-90 → group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.02]`. 영상 thumbnail 동일 적용. 상세 페이지 자체는 컬러 유지
  - **뉴스 카드 제목 축소** — `clamp(26px, 2.4vw, 40px)` → `clamp(13px, 1.1vw, 20px) + leading-[1.25]`. 89개 grid 매거진 캡션 톤
  - **post 스키마 + 타입 + 쿼리에 videoUrl 추가** — `apps/studio/schemas/documents/post.ts` field 추가 + `apps/web/src/types/sanity.ts` Post interface + `queries.ts` postsAllQuery / postBySlugQuery / postsByCategoryQuery 모두 videoUrl projection
  - **community/[slug].astro 영상 embed** — `<video controls preload="metadata" playsinline>` aspect-video. videoUrl 우선, 없으면 coverImage, 없으면 텍스트만 (뉴스)
  - **§3.7.7 신설** — `getStaticPaths` module-scope 변수 인식 X. PAGE_SIZE 등 상수는 함수 안에 선언 필수. v1.3.16 빌드 1회차 실제 발생
  - **§3.7.8 신설** — ES module `__dirname` 미정의. `import { fileURLToPath } from "node:url"; const __dirname = path.dirname(fileURLToPath(import.meta.url));` 패턴
  - **§3.7.9 신설** — PowerShell `Out-File -Encoding utf8` UTF-8 BOM 포함. `stripBom = (s) => s.replace(/^﻿/, "")` 처리 의무
  - **§3.7.10 신설** — pnpm v11.1.3 의 `package.json.pnpm.onlyBuiltDependencies` 무시. `pnpm-workspace.yaml` 의 `onlyBuiltDependencies` 사용. `pnpm approve-builds` 대화형 위험 명시
  - **§3.7.11 신설** — sanity-3.99 CLI `--with-user-token` 도 login 세션 의존. 우회 = `createClient + client.delete` 직접 패턴. cleanup.ts 별도 스크립트
  - **§3.7.12 신설** — dev 서버 좀비·포트 충돌. `Get-Process node | Stop-Process -Force` 또는 PID 별 종료. 옛 탭 오인 패턴 명시
  - **시드 결과 확정** — siteSettings(1) + person(73) + stat(3) + service(5) + academyCourse(4) + post(154 = 65 media + 89 news) + clientLogo(49 incl. 1 consentGiven=false) + page(2) = **291 문서**
  - **본 세션 [[feedback-secrets]] 위반 0건** — `Read-Host -AsSecureString` 패턴 유지. 누적 위반 2건 유지
- v1.3.14 ~ v1.0 — `docs/CMK_홈페이지_핸드오프_v1.3.14.md` Changelog 참조

— V-Directors · 2026-05-26
