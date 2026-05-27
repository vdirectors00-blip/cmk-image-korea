# 검수 요청 — v1.3.14 / 2026-05-25 세션 #2 (Day 10 디자인 검수 마무리)

> 클로드B 검토자에게 — 이전 클로드B 검수 회신 (v1.3.13 후보 4건) 모두 패치 완료 + 사용자 디자인 개선 18건 + 콘텐츠 시드 + audit §10 본문 갱신.
> 모든 변경은 `docs/CMK_홈페이지_핸드오프_v1.3.14.md` Changelog 에 명문화 (~25 항목 entry).
> 검수 결과: **PASS / FAIL / 패치 권장 (v1.3.15 후보 명시)** 으로 답해 주세요.

---

## 0. 세션 컨텍스트

- 직전 상태: v1.3.13 발행 + 클로드B 검수 결과 = "패치 권장, v1.3.14 후보 4건 (회귀·차단 항목 없음)". 사용자 dev 서버에서 시각 검수 진행.
- 이번 세션의 흐름:
  1. 사용자가 시각 검수 시작 (Hero / 별표 / Stats / Header 등) → 디자인 개선 사항 알려줌 → 클로드A 즉시 적용 + 시각 재확인
  2. 클로드B v1.3.13 후보 4건 평가 → 모두 동의 → v1.3.14 일괄 패치 결정
  3. **콘텐츠 시드** — `apps/studio/scripts/seed.ts` 신설로 audit §11 입력 순서 (siteSettings/CEO/stat/service/academy/post/page) 자동화. 사용자 PowerShell `$env:SANITY_AUTH_TOKEN` 일회성 주입 + `npx sanity exec` 으로 29 문서 createOrReplace 성공
  4. 디자인 검수 라운드 + 결정 18건 코드 적용 (Hero / 별표 / Stats grid / ContactCta 동등 / ServiceCards hover / StatsCounter 폰트 / Header underline → border-b / Philosophy 3C+3축 zigzag / CEO 사진 fallback / CEO 약력 임시 숨김 / HistoryTimeline audit §2-4 + zigzag + 2008-2016 / PeopleGrid 사진 절반 + 이름만 / consulting PortableText body 활성화 / LogoWall 임시 시드 등)
  5. 강사진 73명 (Appearance 56 / Behavior 7 / Communication 10) OCR 로 이름 확보. **v1.3.15+ 별도 작업으로 보류** (axes 스키마 + 73 개별 페이지 + 사진 업로드 + 약력)
- 보안 — `$env:SANITY_AUTH_TOKEN` 일회성 패턴 ([[feedback-secrets]] 준수). 채팅 transcript 에 토큰 노출 0. 사용자가 시드 후 토큰 정리 권장됨

---

## 1. 작업 요약

### 1.1 클로드B v1.3.13 검수 후보 4건 모두 해소

| 클로드B 후보 | 처리 |
|---|---|
| #1 `StatsCounter.tsx:42-44` grid/슬라이스 불일치 | `slice(0, 4)` → `slice(0, 3)`. audit §11 #4 stat 3건 의도 + `md:grid-cols-3` 양 끝 일치 |
| #2 핸드오프 §7.2 line 1220 Footer 4메뉴 표기 | `빠른 링크 (About, Consulting, Academy, Contact)` → `Site Map (About · Consulting · Academy · Image Lab · Community · Contact — 6 메뉴, Header 와 동기화)` |
| #3 `docs/legacy-content-audit.md` §10 본문 미갱신 | 11 항목 체크박스 [✓/◐/☐] 마크 + v1.3.13/v1.3.14 결정 인용. §10 상단 진행 상태 박스 추가 |
| #4 `apps/web/src/lib/image.ts:2` sub-path import | `import type { SanityImageSource } from "@sanity/image-url/lib/types/types"` 제거. `type ImageSource = Parameters<typeof builder.image>[0]` 패턴으로 외부 dep 없이 타입 추출 |

### 1.2 사용자 디자인 개선 18건 (시각 검수 → 즉시 적용)

| # | 위치 | 변경 |
|---|---|---|
| 1 | `Hero.astro:15` | `h-[100svh]` → `h-[calc(100svh-89px)]`. 헤더 포함 화면 꽉 차게. 사용자 OK |
| 2 | `ContactPageHead.astro:13` + `contact.astro:28` | `Corporate ★` → `Corporate`. 별표 제거 (3폼 동등화) |
| 3 | `consulting/index.astro:36` + `consulting/[slug].astro:45` | `Corporate ★ / Corporate ★ · 본진` → `Corporate`. 사이트 전체 별표 제거 일관성 |
| 4 | `StatsCounter.tsx:42` | `slice(0, 4)` → `slice(0, 3)` (클로드B #1 해소와 동일) |
| 5 | `apps/studio/scripts/seed.ts` (신설) | audit §11 입력 자동화. 29 문서 createOrReplace |
| 6 | `apps/studio/package.json` | `@sanity/client` devDep 추가 (pnpm transitive 차단 우회) |
| 7 | `Header.astro:16, 27-31` | underline → border-b 패턴 (jit 안전). active = 항상 노출, hover = 비active 도 border-foreground |
| 8 | `ContactCta.astro:15-25` | `flex flex-wrap` → `grid grid-cols-3 max-w-2xl`. 셋 다 `secondary + w-full justify-center`. "기업 출강 문의 →" 화살표 제거 |
| 9 | `Stats.astro` | 12-col 재구성. 좌 7 (eyebrow + 큰 제목 + 카피 + StatsCounter) / 우 5 (`aspect-[4/5]` 사진 placeholder) |
| 10 | `Button.astro` | `class` prop 추가 + 머지 (외부에서 폭·정렬 부여 가능) |
| 11 | `ServiceCards.astro:30-33` | `origin-bottom-left transition-transform duration-500 hover:scale-[1.02]`. 카드 hover 시 우상단 살짝 커짐 |
| 12 | `StatsCounter.tsx:64-67` | 폰트 clamp(48,7vw,96) → clamp(24,3vw,48) + `whitespace-nowrap`. col-span-7 안 깨짐 방지 |
| 13 | `BrandPhilosophy.astro` 통째 (대형) | audit §2-1 CMK 3C 정신 (Creative / People / Communication) + 3축 방법론 (Appearance / Behavior / Communication = 호감 / 기억 / 감동) 정식 카피. zigzag 큰 fade 숫자/한글 패턴 (이미지 박스 폐기 — 페이지 길이 1/2 압축) |
| 14 | `apps/web/public/images/ceo-fallback.jpg` (신설) | 스크린샷 사진 복사. `CeoProfile.astro` + `CeoIntro.astro` 의 `ceo.image` 비어있을 때 fallback (`object-position: 50% 25%`) |
| 15 | `CeoProfile.astro:80-98` | Credentials 섹션 + placeholder 박스 통째 제거. Sanity 의 7건 데이터는 보존 |
| 16 | `HistoryTimeline.astro` 통째 (대형) | audit §2-4 9 마일스톤 (2008-2016) + zigzag 매거진 패턴 (가운데 vertical line + 좌우 교차 + 큰 italic 연도 clamp 40-84px). 2017 이후는 클라이언트 자료 확정 후 추가 |
| 17 | `PeopleGrid.astro` 통째 | grid cols `2/3/4` → `3/4/6`. title·role 제거 (이름만). 데이터 0건일 때 placeholder 12 카드 자동 노출 |
| 18 | `consulting/[slug].astro` | PortableText body 렌더링 활성화 + Tailwind arbitrary variant 매거진 톤 (`[&_h2]:font-serif [&_h2]:text-3xl [&_h2]:mt-14 ... [&_p]:leading-[1.85] [&_p]:text-soft`). 시드된 body 6단락 모두 노출 |
| ◯ | `Footer.astro:12-19` | Site Map 6 메뉴 동기화 (Image Lab 추가) — v1.3.13 에서 적용. Changelog 도 §7.2 본문 갱신 (위 클로드B #2) |
| ◯ | `clientLogo` 10건 시드 (audit §2-4) | LogoWall 노출용. 정치인·외국·동의 어려운 항목 제외. 정식 명단은 §9-2 #7 컨펌 후 |

### 1.3 핸드오프 v1.3.14 패치

| 위치 | 변경 |
|---|---|
| `docs/CMK_홈페이지_핸드오프_v1.3.14.md` (신설) | v1.3.13 복사 후 패치 (보존 원칙) |
| §7.2 line 1220 | Site Map 6 메뉴 표기 (클로드B #2) |
| Changelog | v1.3.14 entry 추가 (~25 항목) |
| 본문 끝 "v1.3.13" → "v1.3.14" | |

### 1.4 audit §10 본문 갱신

`docs/legacy-content-audit.md` §10 — 11 항목 체크박스 갱신:
- ✓ 해소 4건 (시그니처 4카드 / Contact 3폼 분기 / Stats 카운트업 / History 9년 공백)
- ◐ 부분 해소 3건 (LogoWall 시각 / Image Lab 카드 시각 / Color Quiz 5단계)
- ☐ 미해소 4건 (Hero 영상·이미지 / About 서브 메뉴 순서 / PageHead 영문 / Academy 가격)
- 상단 v1.3.14 진행 상태 박스 추가

### 1.5 강사진 작업 (v1.3.15+ 보류)

사용자가 스크린샷 7장 OCR 로 강사 이름 **73건 확보** — Appearance 56 + Behavior 7 + Communication 10. 동명이인 이지연 2명 / CEO 조미경 겸직 확인 완료.

진행 시점 = 사용자가 강사 사진 (개별 파일) + 약력 데이터 제공할 때. v1.3.15+ 별도 작업 — Sanity person 스키마에 `axes` array 필드 추가 + 73건 시드 + 개별 페이지 (`/about/people/[slug]`, VOGUE contributor 패턴, SSG 73 페이지 부담 없음 확인).

PeopleGrid 현재 = placeholder 12 카드 grid (자리잡기). 강사진 데이터 들어오면 자동으로 채워짐 + 3 섹션 (Appearance/Behavior/Communication) 분기 코드 추가.

---

## 2. 검수 포커스

### A. 회귀 리스크 (시급도 ★★★)

1. **`image.ts` 타입 추출 패턴** — `type ImageSource = Parameters<typeof builder.image>[0]` 가 정상 작동하는지. `tsc --noEmit --skipLibCheck` exit 0 기대. 새 에러 0건이어야. `urlFor()` 호출처 13개 (`CeoProfile / CeoIntro / Hero / LogoWall / ServiceCards / ContactCta? / Footer / consulting/[slug] / academy/[slug] / community/[slug] / image-lab/[slug] / about/* / PeopleGrid`) 모두 타입 호환 확인 권장.
2. **consulting/[slug] PortableText body 렌더링** — 시드된 service.body (3 H2 + 본문) 가 매거진 톤으로 정상 노출. 4 카테고리 (corporate / executive / public / media) 모두 빌드. arbitrary variant `[&_h2]:...` 가 Tailwind v4 jit 에 정상 잡혀야 — 깨지면 inline style fallback (§3.7.1) 필요. 단 일반 typography 클래스 (`max-w-prose`, `space-y-4`) 는 jit 안전
3. **Header active/hover 패턴** — active = `border-foreground`, 비active = `border-transparent` + hover = `border-foreground`. 점프 없음. 사용자 시각 OK 받음. 모든 페이지에서 active 상태 검증
4. **Stats 12-col 레이아웃** — 좌 7 (StatsCounter `slice(0, 3)` + `md:grid-cols-3`) / 우 5 (사진 placeholder). md 폭에서 좌측 grid 3 cols 안 깨짐. 폰트 `clamp(24,3vw,48)` + `whitespace-nowrap` 으로 "12,000명" 한 줄 유지
5. **시드 스크립트 idempotent** — 재실행 시 동일 데이터로 덮어쓰기. 추가 사이드이펙트 0건. `package.json` 의 `@sanity/client` devDep 추가가 다른 의존성 충돌 없는지
6. **BrandPhilosophy zigzag** — 6 항목 (3C 3개 + 3축 3개) 좌우 교차. `text-foreground/15` fade 숫자/한글이 매거진 톤 + 실제 가독성. 너무 흐릴 가능성 (사용자 시각 검수에서 미언급 = OK 추정)
7. **HistoryTimeline zigzag** — 가운데 `border-l` line + 좌우 grid + invisible 처리. 모바일은 단순 vertical (line 숨김). 9 마일스톤 모두 노출. 큰 italic 연도 (clamp 40-84) 가독성

### B. v1.3.14 문서 정확성 (시급도 ★★)

1. **Changelog v1.3.14 entry** — ~25 항목이 1.2 코드 변경 표와 1:1 매칭. 빠진 변경 0건. 표기 패턴 (`**...**` 강조 + 파일 경로 + v1.3.13/14 인용) 이전 entry 와 일관
2. **§7.2 line 1220** — Site Map 6 메뉴 표기. Header(§7.1) 와 동기화 OK
3. **audit §10 본문 갱신** — 11 체크박스 마크 + 결정 인용 정확. v1.3.13/14 의 추가 결정 11건 (Image Lab 신설 / Founder→CEO 등) 은 §10 외 별도 명시 (audit §10 가 audit 작성 시점 11건만)
4. **v1.3.10/v1.3.11 보존 회고** — v1.3.13 Changelog 에서 다뤘던 보존 원칙 위반 회고. v1.3.13 부터 별도 파일 보존 패턴 복귀. v1.3.14 도 동일 패턴 (v1.3.13 → 별도 v1.3.14 신설)

### C. 디자인 일관성 (시급도 ★★)

1. **별표 ★ 완전 제거** — Contact/Consulting 4 위치 모두 제거. 다른 위치 잔재 없는지 grep 권장 (`Corporate ★|Corporate Inquiry ★|corporate.*★`)
2. **Founder → CEO 라벨** — 3 위치 (AboutPageHead/CeoProfile/CeoIntro) 일관. 코드 레벨 `ceo` 식별자(변수·URL slug·Sanity 필드) 는 유지 — 사용자 노출 라벨만 통일
3. **Philosophy zigzag 매거진 톤** — 큰 fade 숫자 (3C `text-foreground/15`) + 큰 fade 한글 (3축) + audit §2-1 원본 1문장 본문. 페이지 길이 압축. VOGUE/HARPER 톤
4. **History zigzag 매거진 톤** — 가운데 line + 좌우 큰 italic 연도. 정식 마커 (검은 점) vs placeholder 마커 (빈 점) 시각 구분 — 단 v1.3.14 사용자 결정으로 2017+ placeholder 자체 제거. 모든 마커 검은 점
5. **PeopleGrid placeholder** — 12 카드 grid + 작은 박스 + 우하단 번호 + 이름 자리 `—`. 자리잡기용. v1.3.15 강사진 시드 시 자동 교체
6. **LogoWall 텍스트만 노출** — 10건 (로고 이미지 없음) 텍스트 grid. `bg-cream` 톤 자연. 정식 로고 제공 시 Studio 업로드

### D. audit·handoff 정합성 (시급도 ★★)

1. **audit §10 진행 상태 박스** — v1.3.14 마감 시점 통계 (해소 4 / 부분 3 / 미해소 4). 사용자 시각 검수 + 클라이언트 컨펌 후 미해소 4건 진행 시 audit §10 추가 갱신
2. **audit §11 (Sanity Studio 입력 순서)** — 시드 스크립트 신설로 1~8 자동화 + 9 labArticle (콘텐츠 미정) + 10 page 약관 (법무 후) + 강사진 5~10명 (v1.3.15+) 가 별도 단계. §11 본문에 시드 자동화 명시 가치 (v1.3.15 후보)
3. **audit §2-1 카피 출처** — 기존 cmk 홈페이지 SERVICE CONTENTS / CMK 페이지에서 추출. BrandPhilosophy 정식 적용. 사용자(V-Directors) 본인 콘텐츠 확인 완료
4. **audit §2-4 history** — HistoryTimeline 에 정식 적용 (9건 + 2017+ 미표시). 정확한 마일스톤은 audit §9-2 클라이언트 컨펌 패키지로 확장

### E. 시각 검수 영역 — 사용자 시각 검수 완료분 / 미완료분 (시급도 ★)

**완료** (사용자 OK 받음):
- HOME Hero 사이즈 / Header active hover / ContactCta 동등 / ServiceCards hover / Stats 12-col / BrandPhilosophy zigzag / CeoProfile 사진+약력 임시 숨김 / HistoryTimeline 2008-2016 zigzag / PeopleGrid placeholder 자리잡기 / consulting/[slug] body 풍부함 / LogoWall 텍스트 10건

**부분 검수** (사용자가 "다른 페이지로 넘어가자" 라 보류):
- /academy + /academy/[slug] 4 강좌
- /community 4 post
- /image-lab + /image-lab/[slug]
- /contact (별표 제거 후 시각 재확인)
- /privacy + /terms placeholder

**미검수** — audit §10 미해소 4건 시각 결정:
- HOME Hero 영상·이미지 콘텐츠
- About 5 서브 메뉴 순서
- PageHead 영문 라벨
- Academy 가격 노출 여부

### F. LOW / 사소 (시급도 ✩)

1. **ColorQuizPlaceholder.astro 미사용** — v1.3.13 ColorQuizSection 교체 후 사용 안 함. 안전 위해 보존. 추후 사용자 결정 시 삭제 (v1.3.15+ 후보)
2. **콘텐츠 보강** — 사용자가 스크린샷으로 추가 콘텐츠 모아 seed.ts body 확장 예정 (v1.3.15+)
3. **시드 스크립트 강사진 73명 부분** — `apps/studio/scripts/seed.ts` 에 강사진 데이터 추가는 v1.3.15+ (axes 스키마 변경 + 사진 + 약력 함께)
4. **`feedback_secrets` 메모리 — 본 세션 위반 0건** — `$env:SANITY_AUTH_TOKEN` SecureString 패턴 + `--with-user-token` 시도 / sub-path Read·Grep 회피. 누적 위반 2건 유지

---

## 3. 산출물 형식 요청

### PASS 시
- "PASS · v1.3.14 코드 변경 18건 + 핸드오프/audit 패치 + 콘텐츠 시드 모두 통과. Day 11 (Phase 6 사전 준비) 진입 OK."
- (선택) 작은 메모

### 패치 권장 시
- "패치 권장 — v1.3.15 후보 N건"
- 발견 항목 numbered list:
  - 위치 (파일:line 또는 §)
  - 현 상태
  - 수정 방향 제안
- 우선순위 (시급 / 일반 / 사소)

### FAIL 시
- "FAIL — 차단 항목 N건"
- 차단 사유 + 수정 후 재검수 요청 항목

---

## 4. 검수 시작 조건

- 클로드A 가 코드 변경 18건 + 시드 + 핸드오프 v1.3.14 + audit §10 갱신 완료
- 새 코드 정합성 `tsc --noEmit --skipLibCheck` exit 0 기대 (image.ts 변경 후 재검증)
- 사용자 dev 서버 3개 (worker 8787 / web 4321 / studio 3333) 띄운 상태 — 시각 검수 진행 중

- 클로드B 가 우선 점검할 파일:
  - `docs/CMK_홈페이지_핸드오프_v1.3.14.md` — Changelog + §7.2 line 1220
  - `docs/legacy-content-audit.md` §10
  - 코드 변경 18건 (§1.2 표 참조)
  - `apps/studio/scripts/seed.ts` (29 문서 시드 정합성)

---

**관련 메모**: [[project-phase5-dropped-handoff-v138]] [[feedback-collaboration-pattern]] [[feedback-design-tone]] [[feedback-secrets]]
