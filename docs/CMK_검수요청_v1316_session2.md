# 검수 요청 — v1.3.16 / 2026-05-26 세션 #2 (Day 10 콘텐츠 시드 + 라우팅 + LogoWall)

> 클로드B 검토자에게 — v1.3.14 발행 + 사용자 디자인 검수 OK 이후, Day 10 후반 콘텐츠 시드 + 카테고리 라우팅 + LogoWall 정규화 + 매거진 톤 강화 패치 묶음.
> 모든 변경은 `docs/CMK_홈페이지_핸드오프_v1.3.16.md` Changelog 에 명문화 (~17 항목 entry).
> 검수 결과: **PASS / FAIL / 패치 권장 (v1.3.17 후보 명시)** 으로 답해 주세요.

---

## 0. 세션 컨텍스트

- 직전 상태: v1.3.14 발행 + 사용자 시각 검수 18건 OK. 데이터는 임시 시드 (4 post + 10 clientLogo). community 는 1축, LogoWall 은 텍스트 10건
- 이번 세션의 흐름:
  1. **영상 시드** — 사용자가 mp4 65개 캡처해서 `apps/web/public/videos/` 업로드. 자동화 패턴 도입 — `media-data.json` 생성 + `seed.ts` 가 JSON 읽어 65 post (category=강의·미디어, videoUrl 포함) 시드
  2. **뉴스 OCR** — 9 페이지 스크린샷 OCR (`스크린샷/news/뉴스1-9.png`) → 89 항목 (별표 4 공지 + 번호 1-85) → `news-data.json` 89 항목 → `seed.ts` 시드
  3. **Community 라우팅 분리** — 154 post 시드 후 카테고리 분리 + 페이지네이션 필수. `/community` 전체 + `/community/media` + `/community/news` 3 축. `[category]/index.astro` + `[category]/page/[page].astro` nested dynamic
  4. **LogoWall 정규화** — 4 폴더 (`public-affairs / luxury-corporate / finance / school`) × 8 컬러 PNG = 32 박스. `CLIENT_LOGO_MAP` 정적 매핑. `aspect-[16/7] + border-line + bg-white + object-contain`. 하단 italic 통합 캡션
  5. **사용자 정정 — 감사원 제거** — audit §2-4 "양건·황찬현 감사원장" 자료 부정. `client-bai` → `client-moj` (법무부) 치환. `cleanup.ts` 신설로 잔재 5건 (client-bai + 기존 4 post) 삭제
  6. **Consulting [slug] HERO 제거** — 사용자 피드백 "사이즈 안 맞음". 인덱스 카드 image 는 유지
  7. **매거진 톤 강화** — PostCard thumbnail `grayscale + group-hover 컬러 복귀`. Vogue / Marie Claire 패턴. 뉴스 카드 제목 1/2 축소 (`clamp 13-20px + leading 1.25`)
  8. **삽질 패턴 6건 명문화** — `getStaticPaths` PAGE_SIZE / ES module `__dirname` / PowerShell UTF-8 BOM / pnpm 11 onlyBuiltDependencies / sanity CLI login 우회 / dev 서버 좀비
- 보안 — 본 세션 [[feedback-secrets]] 위반 0건. `$env:SANITY_AUTH_TOKEN` 일회성 SecureString 패턴 유지. 누적 위반 2건 유지

---

## 1. 작업 요약

### 1.1 v1.3.14 → v1.3.16 변경 표

| # | 영역 | 위치 | 변경 |
|---|---|---|---|
| 1 | 영상 65 시드 | `apps/web/public/videos/media-001..065.mp4` + `apps/studio/scripts/media-data.json` + `seed.ts` | 65 post (category=media, videoUrl 포함) 자동 시드 |
| 2 | 뉴스 89 OCR + 시드 | `apps/studio/scripts/news-data.json` + `seed.ts` | 89 post (category=news, isPinned 4건) 시드 |
| 3 | Community 카테고리 라우팅 | `apps/web/src/pages/community/[category]/index.astro` + `[category]/page/[page].astro` 신설 | 3 축 라우팅. nested dynamic route |
| 4 | `postsByCategoryQuery` 신설 | `apps/web/src/lib/queries.ts` | `postsByCategoryQuery` + `postsByCategoryCountQuery`. isPinned desc, publishedAt desc 정렬 |
| 5 | LogoWall 32 박스 | `apps/web/src/components/home/LogoWall.astro` + `apps/web/public/images/clients/{4폴더}/8PNG` | `CLIENT_LOGO_MAP` 정적 매핑 32 + `EXCLUDE_NAMES` Sanity 잔재 차단 fallback |
| 6 | PostCard 매거진 톤 | `apps/web/src/components/community/PostCard.astro` | grayscale brightness-90 → group-hover:grayscale-0 group-hover:brightness-100 + scale-[1.02] |
| 7 | 뉴스 카드 제목 축소 | `PostCard.astro` h3 | `clamp(26-40)` → `clamp(13-20) + leading-[1.25]` |
| 8 | 감사원 제거 | `apps/studio/scripts/seed.ts` clientLogos + `consulting/[slug].astro` | `client-bai` → `client-moj`. "주요 사례" 카피 정리 |
| 9 | cleanup.ts 신설 | `apps/studio/scripts/cleanup.ts` | createClient + client.delete 패턴. 5 도큐먼트 삭제 (client-bai + 4 post) |
| 10 | Consulting [slug] HERO 제거 | `apps/web/src/pages/consulting/[slug].astro` 상단 image 영역 | 사용자 결정. 인덱스 카드 image 는 유지 |
| 11 | `service-hero-fallback.ts` personal 추가 | `apps/web/src/lib/service-hero-fallback.ts` | 사용자 제공 `개인이미지.png` 매핑 |
| 12 | post 스키마 videoUrl | `apps/studio/schemas/documents/post.ts` | field 추가 (string, optional) |
| 13 | Post type videoUrl | `apps/web/src/types/sanity.ts` | Post interface 갱신 |
| 14 | queries.ts videoUrl projection | `apps/web/src/lib/queries.ts` | postsAllQuery / postBySlugQuery / postsByCategoryQuery 3 쿼리 모두 |
| 15 | community/[slug] 영상 embed | `apps/web/src/pages/community/[slug].astro` | `<video controls preload="metadata" playsinline>` aspect-video. videoUrl 우선 → coverImage → 텍스트 |
| 16 | seed.ts BOM strip | `apps/studio/scripts/seed.ts` | `stripBom = (s) => s.replace(/^﻿/, "")` |
| 17 | seed.ts `__dirname` ESM 패턴 | `apps/studio/scripts/seed.ts` + `cleanup.ts` | `fileURLToPath(import.meta.url)` 패턴 |

### 1.2 시드 결과 (사용자 확인됨)

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
Done.
```

cleanup.ts 실행 후 `client-bai + post-mnd-2024 + post-mk-2013 + post-ytn-2013 + post-channela-2016` 5건 삭제 완료.

### 1.3 핸드오프 v1.3.16 패치

| 위치 | 변경 |
|---|---|
| `docs/CMK_홈페이지_핸드오프_v1.3.16.md` (신설) | v1.3.14 의 거대 §0-§15 구조 미복사. **변경 사항만 간결하게** §0-§8 구조 + Changelog. ~600 라인 |
| §1 ~ §5 | 영상·뉴스 시드 / Community 라우팅 / LogoWall / 매거진 톤 패치 본문 |
| §6 | 삽질 패턴 6건 (§3.7.7 ~ §3.7.12 신설) |
| §7 | 시드 명령어 (sanity login 우회 패턴) |
| §8 | 다음 단계 (Claude B 검수 → Day 11) |

---

## 2. 검수 포커스

### A. 시드 정합성 (시급도 ★★★)

1. **154 post slug 충돌 여부** — `post-media-001` ~ `post-media-065` + `post-news-001` ~ `post-news-089` 패턴. Sanity 내 다른 도큐먼트 (`service`, `academyCourse`, `person`) 의 slug 와 충돌 가능성. Studio 에서 slug 유니크 제약 확인. v1.3.14 까지의 임시 4 post (`post-mnd-2024` 등) 가 cleanup.ts 로 삭제되었으나 잔재 없는지 GROQ `*[_type == "post" && !defined(category)]` 확인 권장
2. **49 clientLogo 와 LogoWall 32 매핑** — `CLIENT_LOGO_MAP` 32 키와 `seed.ts` clientLogos array 의 name 100% 매핑. 5건 (32 - 27?) 차이 가능 → 한쪽이 누락되면 LogoWall 빈 박스 또는 미노출. **이 검증을 가장 우선**. `apps/studio/scripts/seed.ts` 의 clientLogos 와 `LogoWall.astro` 의 CLIENT_LOGO_MAP 1:1 표 작성 권장
3. **isPinned 4건의 publishedAt** — postsByCategoryQuery 가 `isPinned desc, publishedAt desc` 정렬. isPinned 4건이 모두 적절한 publishedAt (가장 최근) 으로 시드되었는지. 만약 isPinned=true 인데 publishedAt 이 2008 이면 grid 상단에 오래된 카드 노출 → 시각 부조화
4. **시드 idempotent 재실행** — `createOrReplace` 패턴 의도. 사용자가 후속 데이터 변경 후 재실행 시 안전한지. `seed.ts` 가 동일 ID 의 도큐먼트만 덮어쓰는지, 의도치 않은 cascade 삭제 없는지

### B. 빌드 정적 path 정확성 (시급도 ★★★)

1. **`getStaticPaths` PAGE_SIZE 함수 안 패턴** — `[category]/page/[page].astro` 와 `community/page/[page].astro` 두 파일 모두 PAGE_SIZE 를 함수 안에 선언했는지. module-scope 잔재 있으면 빌드 실패 (§3.7.7). v1.3.16 빌드 1회차 실패 사례
2. **nested dynamic 충돌** — `[category]/index.astro` + `[category]/page/[page].astro` + `[slug].astro` 가 동일 디렉토리. Astro 의 priority 룰:
   - `/community/media` → `[category]/index.astro` ?
   - `/community/page-2` → `[slug].astro` (slug=page-2) ? 또는 `page/[page].astro`?
   - 충돌 시 빌드 warning 또는 잘못된 라우트 매칭. 슬러그 prefix 충돌 (예: 누가 slug=media 또는 slug=news 인 post 시드하면?). `cleanup.ts` 이후 잔재 post 없음 보장 필수
3. **전체 정적 path 수** — `/community/[slug]` 154 + `/community/media/page/[page]` 5 (페이지 2-6) + `/community/news/page/[page]` 7 (페이지 2-8) + `/community/page/[page]` 12 (페이지 2-13) = 178 정적 페이지. SSG 빌드 시간 + 용량 검증
4. **`/community/news/page/1` 같은 잘못된 URL** — 사용자가 직접 입력 시 404. `[category]/page/[page].astro` 의 `page` param 이 "1" 이면 redirect 또는 404 정책. 권장 = `page=1` 진입 시 `[category]/index.astro` 로 301 (Astro middleware 또는 빌드 시 미생성)

### C. 영상 정적 호스팅 영향 (시급도 ★★★)

1. **빌드 산출물 크기** — `apps/web/public/videos/` 572MB 가 `dist/videos/` 로 copy. 빌드 시간 + GH Actions runner disk 영향. GH Actions ubuntu-latest 의 free runner = 14GB free space → 여유 있음. 단 빌드 시간 1~2분 증가 추정
2. **Cafe24 FTP 배포 영향** — FTP 업로드 65 mp4 × 평균 8.8MB = 572MB. FTP-Deploy-Action 의 incremental 업로드 (변경된 파일만) 동작 확인 필수. 첫 배포 = 572MB 풀 업로드 (분 단위), 이후는 변경분만. `.git-ftp-include/exclude` 또는 action 의 dry-run 검증 권장
3. **Cafe24 호스팅 정적 트래픽 한도** — 무료 티어 일 5GB. 1 영상 평균 8.8MB × 일 100 재생 = 880MB. 여유. 단 SNS 공유 후 폭발 가능성 → Cloudflare R2 + signed URL 이관 fallback 명시 (v1.3.17+ 후보)
4. **mp4 Content-Type / Range 헤더** — Cafe24 정적 서빙이 `video/mp4` MIME + `Accept-Ranges: bytes` 응답하는지. Range 미지원 = Safari seek 불가. Cafe24 기본 mime.types 확인 필요. 미지원 시 `.htaccess` 에 `AddType video/mp4 .mp4` 추가
5. **GitHub 저장소 크기** — 572MB. GitHub 권장 1GB 안. 향후 영상 추가 시 LFS 검토 (단 LFS 는 Cafe24 FTP 배포와 incompatible — LFS pointer 만 업로드되고 본 파일 미배포). 권장 = LFS 미사용 + R2 이관 시점까지 GitHub 그대로

### D. 영상 브라우저 호환성 (시급도 ★★)

1. **PostCard 의 video tag 첫 프레임 thumbnail** — `<video src="..." muted preload="metadata">` 가 첫 프레임을 자동 노출하는지. **Safari 동작 확인 필수** — Safari 는 `preload="metadata"` 만으로 첫 프레임 미렌더 가능성. fallback = `poster` 속성 (단 thumbnail JPG 65개 생성 필요 → 빌드 단계 ffmpeg). 미지원 시 placeholder 흰 박스 → grid 흐름 안 깨지지만 시각 무미
2. **iOS Safari `playsinline` 누락** — `community/[slug].astro` 의 video tag 에 `playsinline` 있어야 iOS 에서 풀스크린 안 잡힘. 핸드오프 §1.4 에 명시. 코드 실 적용 확인 권장
3. **`controls` UI 매거진 톤 충돌** — 기본 controls UI 가 모바일에서 큰 영역 차지. `controls` 유지 + 매거진 톤은 video 위 overlay 헤더로 보존. 또는 커스텀 컨트롤 (v1.3.17+ 후보)

### E. Magazine 톤 일관성 (시급도 ★★)

1. **grayscale filter 적용 범위** — PostCard 한정. 다른 카드 컴포넌트 (ServiceCards / LogoWall / PeopleGrid) 는 적용 X 의도. grep 으로 `grayscale` 클래스 잔재 검증 권장 — 다른 페이지에 우연 적용된 곳 없는지
2. **PeopleGrid placeholder 와 톤 일관** — PeopleGrid 는 v1.3.14 에서 placeholder 12 카드 + 이름만. PostCard 의 grayscale 톤과 매거진 일관성 비교. PeopleGrid 사진 시드 후 grayscale 적용 여부 결정 보류 (v1.3.17+)
3. **LogoWall 의 박스 디자인 일관성** — `aspect-[16/7] + border-line + bg-white + object-contain`. 다른 페이지의 카드 (PostCard `aspect-[4/5]`, ServiceCards `aspect-square`) 와 비율 분리 의도 — 로고는 가로형 매거진 박스 패턴. 다른 곳에 `aspect-[16/7]` 잔재 없는지 검증

### F. 코드 안전성 (시급도 ★★)

1. **BOM strip 정규식 안전성** — `s.replace(/^﻿/, "")` 가 UTF-8 BOM (`U+FEFF` = `﻿`) 만 제거하는지. PowerShell 5.1 / 7+ / VSCode / 다른 OS 의 모든 BOM 케이스에 안전한지. 더 안전한 패턴 = `s.replace(/^﻿/, "")` 명시 권장
2. **cleanup.ts 의 `createClient + client.delete` 패턴 안전성** — 일회성 스크립트. 운영 환경에서 실수로 재실행되면 잔재 없는데도 무해 (도큐먼트 미존재 시 sanity-3.99 의 `client.delete` 가 404 throw 또는 silent fail?). 권장 = `try/catch` 로 wrap + idempotent 보장. 또는 실행 전 환경변수 확인 (production dataset 에서만 동작 차단)
3. **`createClient` 환경변수 미설정 시** — `process.env.SANITY_AUTH_TOKEN!` non-null assertion 사용. 미설정 시 `undefined` 토큰으로 401 호출 → 사용자 혼란. 권장 = 스크립트 진입 부 `if (!process.env.SANITY_AUTH_TOKEN) { throw new Error(...) }` 가드
4. **`media-data.json` / `news-data.json` 의 JSON 파싱 에러 핸들링** — 사용자가 손편집 후 trailing comma 또는 unquoted key 같은 실수 가능성. `JSON.parse` 실패 시 line/col 명시 에러 메시지 권장

### G. v1.3.16 문서 정확성 (시급도 ★★)

1. **Changelog ~17 항목 ↔ §1.1 변경 표 1:1 매칭** — 빠진 변경 0건. 표기 패턴 (`**...**` 강조 + 파일 경로 + v1.3.14/16 인용) 이전 entry 와 일관
2. **§3.7.7 ~ §3.7.12 신설 6건의 §3.7.x 번호** — v1.3.14 까지의 §3.7 자리표시 (`§3.7.6 dev 서버 좀비` 가 이미 있음). 6 신설이 모두 §3.7.7 부터 정확히 번호 배정되었는지. 핸드오프 본문 §3 의 정본 (v1.3.14) 에는 §3.7.x 자리만 표시되어야 — v1.3.16 핸드오프는 변경분만이므로 v1.3.14 정본 갱신 필요 여부 결정
3. **시드 결과 표 정확성** — 291 도큐먼트 = 1 + 73 + 3 + 5 + 4 + 154 + 49 + 2 = 291. 검산 OK. cleanup.ts 후 285 (291 - 5 - 1 잔재) 인지 사용자 cleanup 시점 확인 필요
4. **v1.3.16 vs v1.3.15 누락** — v1.3.15 핸드오프 파일 없음. v1.3.14 → v1.3.16 직접 점프. 의도 — 강사진 73 axes 작업이 v1.3.15+ 보류였고 이번 세션은 보류 작업 미진행 + 별도 콘텐츠 시드 흐름. 보존 원칙상 v1.3.15 skip 의도 명시 권장 (v1.3.14 Changelog 의 "v1.3.15+ 후속 작업 명문화" 와 분리)

### H. audit 정합성 (시급도 ★★)

1. **audit §2-4 history 의 "감사원" 인용 제거** — 사용자 정정 = 2011·2013 감사원 마일스톤 부정. `docs/legacy-content-audit.md` §2-4 history 본문 갱신 필요. HistoryTimeline.astro 의 9 마일스톤 중 2011·2013 항목 제거 또는 다른 항목 (법무부?) 으로 치환 필요. **검수 후 사용자 컨펌 받아야 audit 본문 패치 진행**
2. **audit §10 진행 상태 박스 갱신** — v1.3.14 진행 상태 박스 (해소 4 / 부분 3 / 미해소 4) 의 분류가 v1.3.16 시드 + 라우팅 후 변경되는지. "Image Lab 카드 시각 ◐" 가 어떻게 진행? community 카테고리 라우팅이 audit §10 항목 어디에 해당하는지 매핑
3. **audit §11 (Sanity Studio 입력 순서) 시드 자동화 명문화** — v1.3.14 Changelog 에서 명시한 "§11 본문에 시드 자동화 명시 가치 (v1.3.15 후보)" 의 본 세션 진행 여부. media-data.json / news-data.json 자동 패턴이 audit §11 에 반영되어야

### I. 보안 / [[feedback-secrets]] (시급도 ★★)

1. **본 세션 위반 0건 — 검증** — 사용자 PowerShell SecureString 패턴 유지. `Read-Host -AsSecureString` + BSTR 해독 + 사용 후 ZeroFreeBSTR. transcript 에 토큰 노출 없음. 누적 위반 2건 유지
2. **cleanup.ts 실행 후 토큰 정리** — `Remove-Item Env:SANITY_AUTH_TOKEN` 가 cleanup 직후 실행되었는지 사용자 확인 권장. seed.ts 후 정리 + cleanup.ts 위해 재주입 + cleanup 후 정리 = 2 라운드 필요
3. **`media-data.json` / `news-data.json` 의 PII 검토** — 89 뉴스 제목 + 65 영상 title 안에 개인 이름·연락처·내부 자료 노출 없는지. 사용자 OCR 단계에서 검토했으나 자동 패턴 의무화 권장 (시드 전 grep `\d{3}-\d{4}-\d{4}` 같은 전화번호 패턴, 이메일 패턴)

### J. LOW / 사소 (시급도 ✩)

1. **post 스키마 videoUrl 의 타입** — `string` 으로 신설. 향후 Sanity Asset 이관 시 `reference` 또는 `file` 타입 변경 → 마이그레이션 필요. 현재 정적 호스팅 결정이라 string 으로 충분, 결정 명문화 필요
2. **isPinned 필드의 Studio UI** — boolean field 가 Studio 에서 명확히 보이는지. 별표 아이콘 또는 별도 그룹 (`fieldset: "metadata"`) 추가 권장 (v1.3.17 후보)
3. **community/page/13 의 마지막 페이지 카드 수** — 154 mod 12 = 10. 마지막 페이지 카드 10개 (col-3 grid 의 불완전 행). 시각 OK 인지 확인. 부족분 placeholder 또는 카피 추가는 사용자 결정
4. **영상 mp4 의 GitHub LFS 미사용 회고** — 향후 영상 100+ 추가 시 LFS 도입 검토. 단 LFS + Cafe24 FTP 비호환 명시 (위 §C-5). 결정 = R2 이관 우선
5. **OCR 정확도 검증** — 89 뉴스 title 의 OCR 결과를 1회 사용자 시각 확인 필요. 한글 OCR 오류 (예: ㅇ/0, ㄴ/L) 가능성. v1.3.17 시각 검수 시 확인

---

## 3. 산출물 형식 요청

### PASS 시
- "PASS · v1.3.16 코드 변경 17건 + 시드 154 post + cleanup 5 도큐먼트 + 핸드오프 v1.3.16 모두 통과. Day 11 (Phase 6 사전 준비) 진입 OK."
- (선택) 작은 메모

### 패치 권장 시
- "패치 권장 — v1.3.17 후보 N건"
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

- 클로드A 가 코드 변경 17건 + 시드 + cleanup + 핸드오프 v1.3.16 완료
- 새 코드 정합성 — Astro 빌드 exit 0 기대 (`[category]/page/[page].astro` PAGE_SIZE 함수 안 패턴 검증). `tsc --noEmit --skipLibCheck` exit 0 (post.videoUrl 타입 추가)
- 사용자 dev 서버 — community 3 축 + LogoWall 32 + PostCard grayscale 시각 검수 대기

- 클로드B 가 우선 점검할 파일:
  - `docs/CMK_홈페이지_핸드오프_v1.3.16.md` — Changelog + §1 ~ §8
  - `apps/studio/scripts/seed.ts` (media-data.json / news-data.json 자동 패턴)
  - `apps/studio/scripts/cleanup.ts` (createClient + client.delete 패턴)
  - `apps/studio/scripts/media-data.json` + `news-data.json` (PII / OCR 정확도)
  - `apps/web/src/pages/community/[category]/index.astro` + `[category]/page/[page].astro` (nested dynamic 충돌)
  - `apps/web/src/components/home/LogoWall.astro` (CLIENT_LOGO_MAP 32 ↔ seed clientLogos 매핑)
  - `apps/web/src/components/community/PostCard.astro` (grayscale + hover, 영상 thumbnail)
  - `apps/web/src/lib/queries.ts` (postsByCategoryQuery 정렬·projection)

---

**관련 메모**: [[project-phase5-dropped-handoff-v138]] [[feedback-collaboration-pattern]] [[feedback-design-tone]] [[feedback-secrets]]
