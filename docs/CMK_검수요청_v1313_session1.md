# 검수 요청 — v1.3.13 / 2026-05-25 세션 #1 (Day 10 진입)

> 클로드B 검토자에게 — 새 세션입니다. 이전 클로드B 와 동일한 협업 사이클을 이어갑니다.
> 이번 세션에 클로드A 가 수행한 작업 = audit §10 미결 11건 중 사용자 결정 6건의 코드 반영 + 핸드오프 v1.3.13 패치.
> 모든 변경은 `docs/CMK_홈페이지_핸드오프_v1.3.13.md` Changelog 에 명문화됨.
> 검수 결과: **PASS / FAIL / 패치 권장 (v1.3.14 후보 명시)** 으로 답해 주세요.

---

## 0. 세션 컨텍스트

- 직전 상태: v1.3.12 발행 + Day 9 PASS (약관 페이지 골격 + 콘텐츠 감사 마스터 문서). 다음 세션 시작점은 메모리 [[project-phase5-dropped-handoff-v138]] 에 "Day 10 = 전체 디자인 검수 라운드 + 클라이언트 컨펌 23건 푸쉬" 로 기록.
- 이번 세션의 특이 사건 — **클로드A 컨텍스트 거대화로 인한 JSON 직렬화 깨짐 사고 (UTF-16 surrogate pair)**:
  - Day 10 진입 후 페이지별 코드 스캔 + §10 매핑표 누적 → 사용자 결정 항목 추출 단계에서 `400 The request body is not valid JSON: no low surrogate in string: line 1 column 160097` 반복 발생
  - `/model` 변경·재시도 모두 무효 → 컨텍스트에 박힌 직렬화 깨짐 영구
  - 사용자가 화면에서 사용자 결정 4건 응답 + 클로드A task list 회수 → **검수자(이전 클로드B) 가 클로드A 역할 인계**
  - 인계된 클로드A 가 미결 2건 (시그니처 카드 / History 톤) 추가 결정 회수 후 §B 코드 작업 + §D 핸드오프 패치 수행
  - 이번 검수 시점부터 클로드B 는 **새 세션** 으로 사용자가 별도 생성 (인계 받은 클로드A 와 분리)
- **§13.5.6 신설** (핸드오프 v1.3.13) — 같은 사고 재발 방지 절차 명문화

---

## 1. 작업 요약

### 1.1 사용자 결정 6건 회수 (audit §10 미결 11건 중)

| # | 항목 | 결정 |
|---|---|---|
| 1 | Image Lab 페이지 + Header 메뉴 신설 | 지금 신설 |
| 2 | HOME ColorQuizPlaceholder 처리 | HOME 에 실제 퀴즈 embed |
| 3 | About 라벨 (Founder vs CEO) | **CEO** 로 원상복구 |
| 4 | HOME Stats 카운트업 애니메이션 | 구현 |
| 5 | HOME 시그니처 카드 4 vs 5 | **4장 유지** + Image Lab 별도 진입 (Header만) |
| 6 | HistoryTimeline placeholder 톤 | **audit §0 결정 #4 대로 2016까지 + placeholder** |

### 1.2 코드 변경 (13건)

| 결정 | 파일 | 변경 |
|---|---|---|
| #3 | `apps/web/src/components/about/AboutPageHead.astro:13` | navItems "Founder" → "CEO" |
| #3 | `apps/web/src/components/about/CeoProfile.astro:50` | eyebrow "Founder · CEO" → "CEO" |
| #3 | `apps/web/src/components/home/CeoIntro.astro:42` | eyebrow "Founder" → "CEO" |
| #6 | `apps/web/src/components/about/HistoryTimeline.astro` | milestones 2018·2024 제거 / 2016 마일스톤 추가 / "2017 — present · 최근 활동…" placeholder 행 (빈 마커 + faint) / 좌측 캡션 "Recent activities to be added" italic 영문 |
| #1 | `apps/web/src/components/layout/Header.astro` | navItems 6번째 추가 — Academy ↔ Community 사이 `{ label: "Image Lab", href: "/image-lab" }` |
| #1 | `apps/web/src/components/layout/Footer.astro` | siteMap 동기화 (6개) |
| #2 | `apps/web/src/pages/index.astro` | ColorQuizPlaceholder import / tag → ColorQuizSection |
| #2 | `apps/web/src/components/home/ColorQuizSection.astro` (신설) | 매거진 톤 헤더 유지 + `<ColorQuiz client:visible />` embed |
| #4 | `apps/web/src/components/home/StatsCounter.tsx` (신설) | IntersectionObserver threshold 0.3 + ease-out cubic 1.6s + `prefers-reduced-motion` 즉시 표시 |
| #4 | `apps/web/src/components/home/Stats.astro` | 정적 표시 제거 / 섹션 wrapper 유지 + `<StatsCounter client:visible />` 위임 |
| #1 | `apps/web/src/components/lab/LabPageHead.astro` (신설) | PageHead wrapper · 분야 필터 (All/Color/Style/Body/Hair) · labArticle 0건 시 nav 숨김 |
| #1 | `apps/web/src/components/lab/LabAreaCards.astro` (신설) | §6.5 섹션 2 — 3 영역 한 줄 카피 카드 (퍼스널컬러 / 스타일 / 골격·헤어) |
| #1 | `apps/web/src/pages/image-lab/index.astro` (신설) | LabPageHead + LabAreaCards + Latest Notes 그리드 (Community 패턴) + FilterScript |
| #1 | `apps/web/src/pages/image-lab/[slug].astro` (신설) | cover + 헤더 + PortableText / 본문 미등록 시 placeholder |
| #5 | `apps/web/src/components/home/ServiceCards.astro` | **변경 없음** (이미 `slice(0, 4)` — 시그니처 4장 유지 결정 명문화만 v1.3.13 Changelog) |

미사용 처리: `apps/web/src/components/home/ColorQuizPlaceholder.astro` 는 import 끊김. 검수 후 사용자 결정으로 삭제 예정.

### 1.3 핸드오프 v1.3.13 패치

| 위치 | 변경 |
|---|---|
| `docs/CMK_홈페이지_핸드오프_v1.3.13.md` | 신설 (v1.3.12 → 복사 후 패치) |
| line 1201 | §7.1 ASCII 다이어그램 5 메뉴 → 6 메뉴 (Image Lab 정식 추가) |
| line 1206 | §7.1 nav 메뉴 서술 갱신 + Footer 동기화 메모 |
| §13.5.6 (신설) | UTF-16 surrogate pair 직렬화 깨짐 사고 + 복구 절차 + 예방 (실 사고 2026-05-25) |
| 마지막 줄 | "v1.3.12" → "v1.3.13" |
| Changelog | v1.3.13 entry 추가 (결정 6건 + 코드 13건 + §13.5.6 + §7.1 + 발견 LOW 1건 + v1.3.10/11 보존 회고) |

### 1.4 v1.3.13 발견 LOW 1건 (v1.3.14 후보 — 블로킹 아님)

- `apps/web/src/lib/image.ts:2` — `import type { SanityImageSource } from "@sanity/image-url/lib/types/types"` sub-path import 가 TS module resolution 경고 (`Cannot find module ... or its corresponding type declarations`). 빌드 통과지만 `tsc --noEmit` 시 1건 에러로 보임. `import type { SanityImageSource } from "@sanity/image-url"` 의 공식 export 로 교체 권장.

### 1.5 산출물 손실 회고

- 클로드A 사고 발생 시점에 `페이지별 코드 스캔` + `§10 미결 11건 ↔ 코드 위치 매핑표` 두 산출물이 컨텍스트에서만 존재했고 파일 저장 안 됐음. **`docs/_wip/` 파일로 사전 저장하지 않은 것이 사고 시 회복 비용 증가의 직접 원인**. §13.5.6 예방 절차에 반영됨

---

## 2. 검수 포커스

### A. 회귀 리스크 (시급도 ★★★)

1. **Image Lab 페이지 빌드 + 라우팅** — `apps/web/src/pages/image-lab/index.astro` + `[slug].astro` 가 SSG 빌드 시 정상 생성되는지. `getStaticPaths()` 가 labArticle 0건 시 `[]` 반환 → `[slug]` 페이지가 안 생성됨 (정상). dev 모드 `/image-lab` 접속 시 200 OK + 3 영역 카드 노출 + "Articles coming soon" placeholder.
2. **Header / Footer 6 메뉴 active 상태** — `Header.astro` 의 `isActive(href)` 가 `/image-lab/*` 경로에서 정상 active. Footer Site Map 6개 노출 + 시각 정렬 깨짐 없는지 (3 컬럼 그리드 안에서).
3. **HOME ColorQuiz embed 동작** — `client:visible` hydrate 후 첫 질문 노출 → 5단계 후 `/color-quiz/result/[type]` 로 navigate. `result/[type]` getStaticPaths 가 4~5종 type 다 생성하는지 확인 (`apps/web/src/pages/color-quiz/result/[type].astro` 변경 없으므로 기존 동작 그대로 기대).
4. **HOME Stats 카운트업** — Sanity stat 데이터 1건 이상일 때 섹션 노출 + 첫 진입 시 0 → value 카운트업 (threshold 0.3). `prefers-reduced-motion: reduce` 환경에서 즉시 final 값 (애니메이션 skip). 다크 모드·접근성 영향 없는지.
5. **About CEO 라벨 일관성** — 메뉴(`AboutPageHead`) / 본문(`CeoProfile`) / HOME 인트로(`CeoIntro`) 모두 "CEO". `feedback_design_tone` 규칙 위배 없는지 (eyebrow `11px / 0.18em / uppercase`).
6. **HistoryTimeline 톤** — 4 정식 마일스톤 (1995/2005/2010/2016) + 1 placeholder 행 ("2017 — present"). placeholder 마커가 시각적으로 정식 마일스톤과 구분되는지 (`border border-faint bg-background` 빈 점 vs `bg-foreground` 검은 점). 좌측 캡션 영문 italic 이 매거진 톤과 충돌 없는지.
7. **TypeScript** — `npx tsc --noEmit --skipLibCheck` 결과 새 코드 관련 에러 0건 확인 완료 (기존 `image.ts:2` 1건은 §1.4 별도). 클로드B 가 한 번 더 검증 권장.

### B. v1.3.13 문서 정확성 (시급도 ★★)

1. **Changelog v1.3.13 entry** — 결정 6건·코드 13건이 1:1 매칭으로 모두 명문화됐는지. 빠진 변경 없는지. 표기 패턴 (`**...**` 강조, 파일 경로, 결정 #N) 이전 entry 들과 일관된지.
2. **§13.5.6 신설** — 복구 절차 (산출물 보존 → `/clear` → 새 세션 진입) 가 클로드A·B 모두에게 명확히 강제되는 표현인지. "절대 금지" 항목 (무한 재시도 / 다시 토하게 시도) 추가 보완할 표현 있는지.
3. **§7.1 line 1201 / 1206 갱신** — ASCII 다이어그램이 6 메뉴 로 정확히 표기됐는지 (간격·정렬). nav 서술이 Image Lab 위치 (Academy ↔ Community) 와 이유 (콘텐츠 카테고리 그룹) 를 명확히 표현하는지.
4. **v1.3.10/v1.3.11 보존 회고** — Changelog 안에서 짧게 다뤘는데, 보존 원칙 위반을 명시적 LOW 패치 후보로 격상할 가치 있는지 (예: v1.3.10/v1.3.11 본문을 Changelog 발췌로 별도 .md 복원).

### C. 디자인 일관성 (시급도 ★★)

1. **§7.2 / §6.5 명세 부합** — Image Lab 인덱스가 명세 그대로 (헤더 → 3 영역 카드 → 분야 필터 nav (0건 시 숨김) → Latest Notes 그리드 placeholder) 인지. LabAreaCards 의 3 카피 가 audit §4 / 핸드오프 §6.5 line 1025-1027 의 카피와 완전 일치하는지.
2. **§3 디자인 시스템 토큰** — 신규 컴포넌트 (`ColorQuizSection`, `StatsCounter`, `LabPageHead`, `LabAreaCards`, `image-lab/*.astro`) 가 디자인 토큰(`bg-background`, `text-foreground/muted/faint`, `font-serif`, eyebrow `11px / 0.18em / uppercase`, `var(--container-max)`, `var(--ease-out-soft)`) 사용. raw Tailwind 색·v3 패턴 사용 0건이어야.
3. **매거진 톤 (Vogue / Marie Claire)** — Image Lab 3 영역 카드 (`LabAreaCards.astro`) 의 카드 디자인 (border-t 상단 라인 + eyebrow 영문 + 큰 세리프 한글 + soft 본문) 이 ServiceCards / CategoryCard 와 톤 일관성. 색 대비·여백 패턴 검토.
4. **alpha 색 작동** — `text-on-dark/50` `border-on-dark/10` 등 v4 jit. `text-faint` `border-faint` 의 검은 점 vs 빈 점 대비 (HistoryTimeline) 가 시각적으로 의미 전달되는지.
5. **PageHead 일관성** — LabPageHead 가 `title="image lab"` 으로 소문자 italic 세리프 (`feedback_design_tone` 규칙 #3 카테고리 페이지 PageHead 부제 금지) — community / consulting / academy 와 동일 패턴인지.

### D. audit·handoff 정합성 (시급도 ★★)

1. **audit §10 미결 11건 vs 결정 6건** — 어느 항목이 해소됐고 어느 게 시각 검수 영역에 남았는지 매핑:
   - 해소 6건: 항목 2 (시그니처 4 vs 5) → 4장 / 항목 10 (Stats 카운트업) → 구현 / 항목 11 (History 톤) → 2016+placeholder / 추가 결정 (Image Lab 신설 / HOME 퀴즈 embed / Founder→CEO) — audit §10 에 명시되지 않은 코드 미스매치 3건
   - 시각 검수 영역에 남음 8건: 항목 1 (Hero placeholder 콘셉트) / 항목 3 (About 서브 메뉴 순서) / 항목 4 (PageHead 영문) / 항목 5 (LogoWall 시각) / 항목 6 (Image Lab 카드 3개 시각) / 항목 7 (Academy 가격 노출) / 항목 8 (Color Quiz Q1~Q5) / 항목 9 (Contact 3폼)
2. **audit §10 갱신 필요** — 해소된 6건을 audit 문서 §10 에서 "✓ v1.3.13 결정 완료" 로 마크하거나 별도 §10-결정완료 섹션으로 이동할지. 현재는 audit 본문 미반영 (핸드오프 v1.3.13 Changelog 에만 명문화).

### E. 시각 검수 영역 — 사용자 dev 서버 시각 검수 가이드 (시급도 ★)

dev 서버 3개 띄운 상태에서 사용자 시각 검수 항목 (audit §10 잔여 8건 + 회귀 검수 추가):

| 페이지 | 확인 항목 |
|---|---|
| `/` HOME | Hero placeholder 톤 / ColorQuiz Q1 즉시 노출 + 진단 5단계 정상 / Stats 카운트업 동작 / 6 메뉴 Header / 시그니처 카드 4장 |
| `/about/ceo` | "CEO" 라벨 3 위치 일관 / `<AboutPageHead active="ceo">` 활성 |
| `/about/history` | 1995/2005/2010/2016 4 마일스톤 + "2017 — present" placeholder 행 시각 구분 |
| `/image-lab` | 헤더 (lowercase italic "image lab") / 3 영역 카드 / "Articles coming soon" placeholder / 분야 nav 0건 시 숨김 |
| `/image-lab/<slug>` | (labArticle 0건이면 빌드 시 페이지 없음 — dev 모드 404 정상) |
| `/community` | 회귀 없음 (Header 6 메뉴 외 변화 없음) |
| Footer | 6 메뉴 Site Map / 컬럼 정렬 정상 |

### F. LOW / 사소 (시급도 ✩)

1. **`image.ts:2` sub-path import 경고** (§1.4) — v1.3.14 후보.
2. **`ColorQuizPlaceholder.astro` 미사용** — 검수 후 사용자 결정으로 삭제. 지금 유지.
3. **audit §10 갱신** (검수 D-2) — v1.3.14 후보. v1.3.13 검수 PASS 후 별도 작업.

---

## 3. 산출물 형식 요청

### PASS 시
- "PASS · v1.3.13 코드 변경 13건 + 핸드오프 패치 모두 통과. 사용자 시각 검수 후 Day 11 (Phase 6 배포 사전 준비) 진입 OK."
- (선택) 작은 메모 — 다음 사이클에서 신경 쓰면 좋을 사항

### 패치 권장 시
- "패치 권장 — v1.3.14 후보 N건"
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

- 클로드A 가 코드 작업 + 핸드오프 v1.3.13 패치 완료. 새 코드 정합성 `tsc --noEmit --skipLibCheck` exit 0 (image.ts:2 1건은 §1.4 사전 에러).
- 사용자가 dev 서버 3개 (worker 8787 / web 4321 / studio 3333) 띄울 예정 (§3.7.4 패턴):
  ```powershell
  # 각 앱 디렉토리에서 별도 PowerShell 창
  cd C:\Users\PC\Desktop\2026\홈페이지개발\CMK\apps\web; npx astro dev --port 4321
  cd C:\Users\PC\Desktop\2026\홈페이지개발\CMK\apps\studio; npx sanity dev
  cd C:\Users\PC\Desktop\2026\홈페이지개발\CMK\apps\worker; npx wrangler dev
  ```
  좀비 정리 (§3.7.6):
  ```powershell
  Get-NetTCPConnection -LocalPort 4321,3333,8787 -State Listen
  Stop-Process -Id <PID> -Force
  ```
- 클로드B 가 우선 점검할 파일:
  - `docs/CMK_홈페이지_핸드오프_v1.3.13.md` — Changelog + §13.5.6 + §7.1
  - 코드 13건 (위 §1.2 표 참조)
  - audit §10 잔여 8건 (이 검수 라운드 후 시각 검수 영역으로 사용자에게 전달)

---

**관련 메모**: [[project-phase5-dropped-handoff-v138]] [[feedback-collaboration-pattern]] [[feedback-design-tone]] [[feedback-secrets]]
