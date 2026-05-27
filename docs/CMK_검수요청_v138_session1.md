# 검수 요청 — v1.3.8 / 2026-05-22 세션 #1

> 클로드B 검토자에게 — 이번 세션에 클로드A 가 수행한 5개 작업의 누적 회귀·디자인·문서 정확성을 검토해 주세요.
> 모든 변경은 핸드오프 v1.3.8 (`docs/CMK_홈페이지_핸드오프_v1.3.8.md`) 에 명문화됨.
> 검수 결과: **PASS / FAIL / 패치 권장 (v1.3.9 후보 명시)** 으로 답해 주세요.

---

## 0. 세션 컨텍스트

- 직전 상태: v1.3.7 발행 + Phase 4 PASS. Phase 5 (i18n) 대기 + 토큰 회전 3건 시급 (이전 세션 노출).
- 이번 세션 결정: **Phase 5 i18n 폐기** (사용자 명시 — "확정 아닌 상태로 인프라 미리 짓는 것은 시간 낭비") + **기획안 v2 결정 신뢰도 의문 표명** ("v2에서 생성된 것은 클라이언트 의도가 반영 안되어있을 확률이 높다").
- 결과물: 핸드오프 v1.3.8, 코드 정리 5건, 메모 4건, 푸터 본격 구현.

---

## 1. 작업 요약 (5건)

### 1.1 토큰 회전 검증 (Phase 4 후속)
- Sanity Editor Token / Resend API Key / Cloudflare Turnstile Secret 3개 회전 (방법 A — Turnstile site key 유지).
- 검증 통과: `/contact` 폼 → Worker 200 OK + Sanity inquiry `2KB7PmPZrihzQa1edp7jEW` 생성 + Studio 가시 확인.
- Resend 403 `validation_error` 는 도메인 미인증 dev 제약 (vdirectors00@gmail.com 외 발송 불가) — Phase 6 도메인 인증 시 해소. ctx.waitUntil 격리로 폼 응답 200 에는 영향 없음 (v1.3.6 §9.2 패치 검증됨).

### 1.2 RESEND_API_KEY 추가 노출 → 재회전 (사고 1건)
- 사고 경위: 클로드A 가 zh 잔재 정리 후 `apps` 전체에 `zh` 패턴 grep → `apps/worker/.dev.vars` 가 검색 경로에 포함되어 RESEND_API_KEY 값 일부 (`...zh...` 부분 문자열) 가 채팅 transcript 에 출력.
- 즉시 조치: 사용자에게 즉시 보고 → Resend Dashboard 에서 Delete + Create → `.dev.vars` 교체 → Worker 재시작 → 폼 1회 재제출 검증.
- 재발 방지: 핸드오프 v1.3.8 **§13.5.5 신설** + `feedback_secrets` 메모 **Grep 안전 규칙 강화**. 클로드A·B 모두 적용 의무.

### 1.3 zh 잔재 정리 — γ 절충안 (Phase 5 폐기 결정 반영)

**전제**: `localeString` 객체 구조는 유지 (`{ko}` 단일 키), zh 키만 제거. 추후 EN 확장 시 fields 에 `{ name: "en" }` 1줄 추가로 끝 (~0.5일).

**변경 파일 5건**:

| 경로 | 변경 |
|---|---|
| `apps/studio/schemas/objects/localeString.ts` | `zh` field 제거. 주석에 EN 확장 1줄 예시 추가 |
| `apps/studio/schemas/objects/localeText.ts` | 동일 |
| `apps/studio/schemas/objects/localeBlockContent.ts` | 동일 |
| `apps/web/src/layouts/BaseLayout.astro` | `lang?: "ko" \| "zh"` prop 제거. `<html lang="ko">` 하드코딩 |
| `apps/web/src/types/sanity.ts` | `LocaleString` / `LocaleText` / `LocaleBlockContent` 의 `zh?` 제거. `Lang` 타입 제거. `pickLocale(field, lang)` → `pickLocale(field)` 시그니처 단순화 (`field?.ko ?? ""` 반환) |

**호출처 영향**: `pickLocale` 호출처는 13개 .astro 파일 (pages 8 + components 2 + 기타). 모두 `pickLocale(field)` 형태로 lang 파라미터 미사용 → 시그니처 변경에 의한 깨짐 없을 것으로 추정. 클로드B 가 한 번 더 grep 으로 확인 권장.

**검증 완료 grep**: `apps/web/src` + `apps/studio/schemas` 한정 검색 (worker 제외 — `.dev.vars` 영구 분리), `\bzh\b|中文|/zh/|lang.*zh` 패턴 → **No matches**.

### 1.4 핸드오프 v1.3.8 패치

| 위치 | 변경 |
|---|---|
| §0 (한눈에 보기) | 다국어 행 → "한국어 only (1차 오픈). 추후 영어 확장은 별도 마일스톤" |
| §3.7.4 (신설) | pnpm `--filter` 가 `.npmrc` 의 `verify-deps-before-run=false` 를 무시. 우회: 각 앱 디렉토리에서 `npx astro dev` / `npx sanity dev` / `npx wrangler dev` 직접 실행 |
| §3.7.5 (신설) | wrangler dev 의 `.dev.vars` hot-reload 한계. secret 회전 후 토큰 거부 시 Worker 재시작 필수 |
| §3.7.6 (신설) | dev 서버 좀비 프로세스 정리 (`Get-NetTCPConnection` + `Stop-Process`) |
| §4.2 | 다국어 헬퍼 KO only 명시 + EN 확장 1줄 패치 주석 |
| §5 | zh 라우트 표 제거 + §5.2 신설 (EN 확장 마일스톤 — 작업 약 2일 + 콘텐츠) |
| §12 | Phase 5 폐기. Day 8 = 푸터, Day 9 = 약관 입수 푸쉬 + Phase 6 사전 준비, Day 10 = 디자인 검수 라운드, Phase 6 → Day 11, Phase 7 → Day 12 |
| §13.5.4 | Worker 재시작 명시 + Resend 403 dev 제약 안내 |
| §13.5.5 (신설) | Grep / Bash 사용 시 secret 파일 노출 방지 규칙 |
| 마지막 줄 | v1.3.7 → v1.3.8 |
| Changelog | v1.3.8 entry 추가 |

### 1.5 메모 갱신 (`C:\Users\PC\.claude\projects\C--Users-PC-Desktop-2026--------CMK\memory\`)

| 파일 | 처리 |
|---|---|
| `MEMORY.md` | 인덱스 갱신 |
| `project_phase4_complete_phase5_pending.md` | 삭제 (rm) |
| `project_phase5_dropped_handoff_v138.md` | 신설 — 현 상태 / Phase 5 폐기 사유 / 일정 재구성 / dev 환경 함정 / 다음 세션 시작점 |
| `feedback_planning_v2_reverify.md` | 신설 — 기획안 v2 결정은 클라이언트 의향 미반영 가능성, 강한 dependency 만들기 전 재확인 패턴 |
| `feedback_secrets.md` | 강화 — Grep 안전 규칙 추가 (`apps/` 전체 검색 시 `--glob "!**/.dev.vars"` 의무) |

### 1.6 푸터 본격 구현 (Day 8)

**경로**: `apps/web/src/components/layout/Footer.astro` (기존 placeholder 통째 교체).

**핵심 결정** (사용자 시각 검수 1차 통과):
- SNS 텍스트 라벨만 (아이콘 X) — 매거진 톤 (Vogue/W 풍)
- 컬럼 1 = 로고 + serif italic 영문 카피 "What is seen is what is communicated." + `<address>` 회사정보
- 컬럼 2 = "Site Map" eyebrow + 메뉴 5개 (Header navItems 와 동일)
- 컬럼 3 = "Connect" eyebrow + tel/mailto + SNS (Instagram / YouTube / KakaoTalk)
- 하단 약관 = `aria-disabled` + `cursor-not-allowed` + "(준비 중)" 시각 표시 (콘텐츠 미입수)
- 다크 배경 (`bg-dark` / `text-on-dark`) + alpha 색 (`text-on-dark/50` 등 v4 jit 정상 동작)
- `mt-0` (직전 콘텐츠가 자체 여백 책임)
- 데이터: Sanity `siteSettings` 싱글톤에서 `siteSettingsQuery` fetch + `pickLocale` 적용 + `companyName` 만 fallback

---

## 2. 검수 포커스

### A. 회귀 리스크 (시급도 ★★★)

1. **`pickLocale` 시그니처 변경** — 호출처 13개 파일에서 lang 파라미터 사용 안 하는지 grep 재확인 (`apps/web/src` 한정 — `apps/worker` 제외 의무).
   ```
   Grep path: apps/web/src, pattern: "pickLocale\([^)]*,"
   ```
   매치 0건이어야 안전. 1건이라도 있으면 lang 파라미터 사용처 → 시그니처 충돌.

2. **TypeScript 컴파일** — `LocaleString` 의 `zh?` 제거로 타입 좁아짐. 빌드 검증 권장:
   ```powershell
   cd apps\web
   npx astro check
   ```
   에러 0건 기대. 있으면 패치 후보.

3. **Sanity 스키마의 zh 필드 제거 → 기존 데이터** — 이번 dev 단계에선 KO 만 채워진 상태라 무손실로 예상. 만약 누가 어느 다국어 필드의 zh 키에 값을 넣었다면 (현재 없을 것으로 추정) Studio 에서 그 값이 안 보임. **Studio 띄워서 다국어 필드 1개 (예: 첫 service 의 title) 정상 입력/표시 동작 확인 권장**.

4. **BaseLayout lang prop 제거** — `<BaseLayout lang="zh" ...>` 또는 `lang="ko"` 명시한 호출처 grep:
   ```
   Grep path: apps/web/src, pattern: "lang=\\\""
   ```

### B. v1.3.8 문서 정확성 (시급도 ★★)

1. **§5.2 EN 확장 작업량 추정** — "약 2일 + 콘텐츠" 가 8단계 작업 범위 (스키마/쿼리/types/BaseLayout/LangToggle/hreflang/미러 17개/카피) 에 비춰 합리적인지. 패치 권장 시 추정치 보정.

2. **§3.7.4/5/6 새 함정 3건의 재현 + 우회 명령** — PowerShell 환경 (Windows 11) 에서 명시된 명령이 그대로 동작하는지. 특히 §3.7.4 의 `cd apps\web; npx astro dev --port 4321` 패턴, §3.7.5 의 Worker 재시작 절차.

3. **§13.5.5 Grep 안전 규칙** — 클로드A·B 모두에게 명확히 강제되는 표현인지. 이번 세션 노출 사고 (RESEND_API_KEY) 재발 방지 목적. 추가 보완할 표현 있으면 v1.3.9 후보.

4. **Phase 5 폐기 사유 (§5.2)** — 클라이언트가 추후 zh 필요로 결정할 가능성은 0이 아님. 그 시점 마이그레이션 비용도 §5.2 에 명시할지 검토.

### C. 푸터 디자인 일관성 (시급도 ★★)

1. **§7.2 명세 부합** — 3컬럼 / 다크 / 회사정보·SITE MAP·CONNECT / © + 약관 모두 반영. 누락 있으면 지적.
2. **§3 디자인 시스템 토큰** — `bg-dark` / `text-on-dark` / `font-serif` / eyebrow `11px / 0.18em / uppercase` / `var(--container-max)` 사용. v3 패턴 (`text-gray-500` 같은 raw Tailwind) 사용 0건이어야.
3. **매거진 톤** — 영문 italic 카피, SNS 텍스트 라벨이 Vogue/W/Marie Claire 톤과 일치하는지. 사용자 시각 검수 1차 통과지만 클로드B 의 디자인 검수도 별도 가치.
4. **alpha 색 작동** — `text-on-dark/50` `border-on-dark/10` 등이 Tailwind v4 jit 에서 정상 생성되는지. 안 잡히면 §3.7.1 inline style fallback 필요.
5. **접근성** — `<address>` `<nav aria-label>` `aria-disabled` `mailto:` / `tel:` 정확성. 약관 (준비 중) 의 cursor-not-allowed 가 키보드 접근성에도 안전한지 (focus 가능 여부 등).
6. **회귀** — 다른 페이지 (about, contact, consulting, academy, community, 색상 퀴즈) 에서 푸터 렌더링 일관성. 특히 ContactCta 없는 페이지에서 마지막 섹션 ↔ 푸터 시각 간격.
7. **HOME 의 ContactCta 누락 의심** — 스크린샷에서 푸터 직전이 CEO Intro 섹션 끝 + 빈 공간. 핸드오프 §6.1 "섹션 7 — Contact CTA (메인 푸터 직전)" 가 누락됐는지 `apps/web/src/pages/index.astro` 확인.

### D. 메모 일관성 (시급도 ★)

1. `MEMORY.md` 인덱스 항목 ↔ 본문 메모 파일 1:1 매칭 OK 한지.
2. 메모 간 cross-link (`[[user-role]]` / `[[feedback-secrets]]` / `[[project-phase5-dropped-handoff-v138]]` / `[[feedback-planning-v2-reverify]]`) 모두 유효한지.
3. `feedback_planning_v2_reverify` 의 "적용 예외" (기술 결정 / 디자인 시스템 / v2 이후 패치) 가 너무 좁거나 넓지 않은지. 클라이언트 의향 확인이 정말 필요한 항목까지 예외에 들어가지 않았는지.

---

## 3. 산출물 형식 요청

### PASS 시
- "PASS · 이번 세션 누적 변경 모두 통과. Day 9 진입 OK."
- (선택) 작은 메모 — 다음 사이클에서 신경 쓰면 좋을 사항

### 패치 권장 시
- "패치 권장 — v1.3.9 후보 N건"
- 발견 항목 numbered list:
  - 위치 (파일:line 또는 §)
  - 현 상태
  - 수정 방향 제안
- 우선순위 (시급 / 일반 / 사소)

### FAIL 시
- "FAIL — 차단 항목 N건"
- 차단 사유 + 수정 후 재검수 요청 항목

---

**검수 시작 시점**: 클로드A 가 dev 서버 3개 (worker 8787 / web 4321 / studio 3333) 모두 띄운 상태. 사용자가 푸터 1차 시각 검수 통과 (스크린샷 첨부됨, `스크린샷/푸터.jpg`).
