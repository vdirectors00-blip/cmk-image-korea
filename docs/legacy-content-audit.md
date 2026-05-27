# 기존 cmkimage.co.kr 콘텐츠 감사 + 새 사이트 매핑 — 2026-05-22 (rev v1.3.12-r2)

> 22 페이지 수집 데이터를 새 사이트 (Astro + Sanity) 스키마·구조에 맞춰 매핑.
> 매거진 톤 (Vogue/Marie Claire) + 핸드오프 v1.3.12 기준.
> v1.3.12 갱신: 클로드B 검수 9건 반영 (stat·clientLogo 매핑 §5-A 신설 / Service body 일관성 §3 도입부 / URL 리다이렉트 §12 신설 / §9 우선순위 재배열 + 라이선스·환불 추가 / §10 Color Quiz·Contact 분기·Stats 카운터 추가).
> r2 (v1.3.12 마이너 리비전): 클로드B 추가 관찰 3건 반영 — Service 4건·Academy 4건 권장 slug 명시 / §12 작성 일정에 §9-1 #4 연결 고리 추가.

---

## 0. 의사결정 확정 (4건)

| # | 항목 | 결정 | 비고 |
|---|---|---|---|
| 1 | **Face Type (얼굴 타입 진단)** | **미반영** — 클라이언트 컨펌 후 검토 | 기획안 v1·v2 모두 0건. 2025년 신간·일본자격과정은 NEWS 게시판에만 존재 |
| 2 | **개인이미지 별도 페이지** | **미추가** — 기존 구조 유지, 클라이언트 컨펌 후 검토 | 수집 콘텐츠는 corporate·executive 안에 흡수 |
| 3 | **Image Lab 1차 노출** | **노출** — 한 줄 카피 3개 | 메뉴 띄우고 퍼스널컬러·스타일·골격헤어 소개 |
| 4 | **History 9년 공백** | **2016 까지만 표시** + placeholder + 클라이언트 자료 요청 푸쉬 | 클라이언트 컨펌 패키지에 포함 |

**핵심 원칙**:
- 기획안 v1·v2 에 있는 것 = 디자인 영역, 우리가 결정
- 기획안에 없는 것 = 콘텐츠 영역, 클라이언트 컨펌 후

---

## 1. siteSettings (사이트 설정) 매핑

Sanity Studio → 사이트 설정 (싱글톤) 에 입력.

| 필드 | 값 | 출처 |
|---|---|---|
| `companyName` (ko) | **CMK 이미지코리아** | CMK 페이지 |
| `tagline` (ko) | **보이는 것이, 전해지는 것입니다** | 새 사이트 매거진 톤 핵심 메시지 (핸드오프 §0) |
| `phone` | **031-284-2566** | CMK 사무실 (메인 노출) |
| `email` | ⚠️ `cmkimage@hanmail.net` (또는 도메인 이메일로 교체) | CMK |
| `address` (ko) | 경기 용인시 기흥구 탑실로 116 탑실마을 대주 피오레 2단지 215동 303호 | CMK |
| `ceo` | **조미경** | CMK |
| `businessNo` | **107-91-45820** | CMK |
| `kakaoChannel` | (미확인) | 클라이언트 액션 |
| `instagram` | (미확인) | 클라이언트 액션 |
| `youtube` | (미확인) | 클라이언트 액션 |

### ⚠️ 회사 정보 클라이언트 확인 필요
- **메인 연락처**: 사무실 `031-284-2566` 노출, 모바일 `010-7269-8836` 별도 — 맞나?
- **이메일**: `@hanmail.net` 유지 vs `@cmkimage.co.kr` 도메인 이메일로 교체
- **주소 불일치**: 한글 `215동 303호` vs 영문 `206동 1902호` (CONTACT 영문 페이지) — 정확한 호수 확인 필요
- **SNS**: 페이스북(`facebook.com/cmkimage`) 존재. 인스타·유튜브·카카오 운영 여부 확인 필요

---

## 2. About 페이지 매핑

핸드오프 §6.2 — 5개 서브 (philosophy / ceo / history / people / all).

### 2-1. About / philosophy

**활용할 카피** (CMK 페이지 + SERVICE CONTENTS 3축):

핵심 메시지 (Hero/Top):
> CMK 이미지코리아는 20여 년간의 현장 컨설팅과 노하우를 바탕으로
> 이미지에 관련된 맞춤형 컨설팅 및 전문가 교육프로그램을 제공하는 컨설팅 기업입니다.

CMK 3C 정신 (Section):
- **Creative** — CMK는 고객의 Creative Partner가 되겠습니다
- **People** — 대한민국 최고의 이미지컨설턴트로 Creative Expert Group 의 자부심
- **Communication** — 지금껏 경험하지 못한 Creative Service로 고객과 소통

3축 방법론 (Section, SERVICE CONTENTS 페이지):
> 매력적인 외모(Appearance)는 사람의 마음을 사로잡아 **호감**을 느끼게 합니다.
> 매력적인 행동(Behavior)은 사람의 마음을 사로잡아 **오랫동안 기억**하게 합니다.
> 매력적인 커뮤니케이션(Communication)은 사람의 마음을 사로잡아 **감동**하게 합니다.

> 💡 운율 살아있음 (호감 → 기억 → 감동) — 매거진 톤에 좋음. 그대로 활용.

**제거할 것**: SERVICE CONTENTS 의 31개 영문 키워드 나열 (매거진 톤 어울리지 않음. 풀어서 쓰지 않고 시각 장식으로만)

### 2-2. About / ceo

**그대로 활용 가능 — CEO 페이지 인사말 전체**:

> 사람들은 대개 이미지메이킹을 떠올리면 정치인이나 연예인 등 특별한 사람들만의 것이라고 생각하는 경우가 많습니다. 그러나 개인의 이미지(**Personal Identity**)는 현대인 모두에게 필요한 매커니즘으로서 개인의 삶의 질을 높여줍니다.
>
> 시대가 급변하고 경쟁이 치열해질수록, 경쟁력을 좌우하는 무기들은 점점 더 평준화됩니다. (...) **현 시대는 이미지 커뮤니케이션 시대입니다.** 자신의 부가가치를 높이고 싶다면 자기만의 고유한 이미지를 구축해야합니다.
>
> 저희 CMK이미지코리아가 당신의 이미지 비전을 높이는 데 함께 하겠습니다. 여기서 진정한 당신을 알고 당신만의 최상의 이미지를 찾으시길 바랍니다.
>
> **(주) CMK이미지코리아 대표 조미경**

**Sanity person 스키마 매핑** (isCeo=true):
- `name`: 조미경
- `nameEn`: (미확인 — 클라이언트 확인)
- `title`: 대표
- `role`: 대표
- `bio`: 위 인사말 PortableText
- `image`: 클라이언트 제공 필요
- `credentials`: HISTORY/NEWS 에서 추출 가능 (아래)

### 2-3. About / ceo — credentials (약력 추출)

HISTORY + NEWS 게시판에서 추출:
- 2008 — CMK 이미지코리아 설립 (사업자등록·copyright 기준)
- 2009 — 문화체육관광부 의뢰 <장·차관 미디어 트레이닝> 진행
- 2010 — 국무총리실 <국장급 미디어 트레이닝> 진행
- 2013 — YTN 뉴스 인터뷰
- 2014 — 대기업 임원진 PI 진단 (현대차 본사 96명 등)
- 2016 — 중국 북경 GIRL UP 진출
- 2024 — **국방부 국민소통 전문가단 8기 위촉** (1년)
- 2025 — **저서 『Face Type 얼굴 타입 진단』 출간** (단, 결정 1에 따라 노출 보류)
- 2025 — 일본 국제자격과정 개최 (단, 결정 1에 따라 노출 보류)

> ⚠️ **클라이언트 확인 필요**:
> - 학력 (대학·대학원·박사 등)
> - AICI 자격 (Association of Image Consultants International) — 있다면 명시 권장
> - 정확한 직함 (대표·박사·교수 등 복수 가능)

### 2-4. About / history (회사 연혁)

**활용**: HISTORY 페이지의 도입 카피 (다듬어서):

> 문화체육관광부 의뢰로 2009년 <장·차관 미디어 트레이닝> 진행을 시작으로, 국무총리실·대기업 임원진 PI 진단까지 — **IMAGE BUILDING PROGRAM** 으로 정평. 개인 → 조직 → 국가 이미지 향상에 기여해 왔습니다.

**연혁 데이터** (2008~2016 기존 + 2024 NEWS):

| 연도 | 마일스톤 |
|---|---|
| 2008 | (주) CMK 이미지코리아 설립 |
| 2009 | 문화체육관광부 장·차관 미디어 트레이닝 |
| 2010 | 국무총리실 국장급 미디어 트레이닝 / 정운찬 국무총리 |
| 2011 | 이화여대 김선욱 총장 PI 진단 |
| 2012 | 합동참모본부 / 문화체육관광부 각부처 국장 |
| 2013 | 삼성전자 류승규 상무 / SK 임원진 (~2014) |
| 2014 | 현대자동차 본사 임원진 96명 / 새누리당 김무성 대표 |
| 2015 | 현대자동차 제네시스 매니저 / 문화체육관광부 국장급 |
| 2016 | 동아일보 채널A 임원진 24차수 / 중국 북경 GIRL UP 진출 |
| 2017–2023 | **(클라이언트 자료 요청)** |
| 2024 | 국방부 국민소통 전문가단 8기 위촉 |

> 매거진 톤 처리: 한 줄 핵심만 노출. 전체 클라이언트 명단은 풀어쓰지 않음 (지면 낭비·매거진 톤 아님).
> 9년 공백 placeholder: "Updated as of 2024" 또는 "Recent activities to be added" 노트.

### 2-5. About / people (강사진)

기존 사이트는 **사진+이름만 58명** 으로 정리. 매거진 톤에 안 맞음 → 재구성 필요.

**새 사이트 구성** (Sanity person 스키마):
- 대표(조미경) 1명 = `isCeo=true`, About/ceo 단독
- 핵심 강사 5~10명 = `isCeo=false`, About/people 그리드

> ⚠️ **클라이언트 확인 필요**:
> - 노출 동의 받은 핵심 강사 5~10명 선정
> - 각 강사의 사진·직함·약력·자격증 제공

---

## 3. Consulting 4 카테고리 매핑

핸드오프 §6.3 — corporate / executive / public / media 4개.

### 매핑 원칙
1. **기존 사이트 5 카테고리** → **새 사이트 4 카테고리** 흡수
2. APPEARANCE/BEHAVIOR/COMMUNICATION 3축 콘텐츠를 각 카테고리 페이지 안에 섹션으로
3. 매거진 톤 — 11/8/9개 항목 나열 대신 **핵심 5~6개 정수**만 + 영문 시각 장식

### body 골격 — 카테고리별 톤 차이 의도 (v1.3.12)
4 카테고리의 body H2 골격이 일부러 다르다 — 각 영역의 본질이 달라서 강제 통일하면 콘텐츠 손실·매거진 톤 부자연.
- **corporate / public** — APPEARANCE / BEHAVIOR / COMMUNICATION 3 H2 (3축 풍부)
- **executive** — 개인 코칭(1:1) / 그룹 코칭(4인) / 이벤트 3 H2 (형식별 분류 — VVIP 특성)
- **media** — A/B/C 통합 단일 흐름 (순차 프로그램 — 미디어 특성)

매거진 자체가 각 섹션이 다른 흐름을 가져도 일관성이 깨지지 않는 매체다. 다만 **PageHead·하단 cta·시각 패턴**(여백·타이포·이미지 비율) 은 4 카테고리 동일하게 유지해 통일감 확보. [[feedback-design-tone]] §1·§3 준수.

### 3-1. corporate (기업·금융)

**매핑 출처**: 기존 사이트 `기업/금융이미지` (3개 서브)

**Sanity service 스키마**:
- `title.ko`: 기업·금융 이미지
- `slug.current`: **`corporate`** ← 수동 설정 (Sanity slug 생성기는 한글→영문 자동 변환 미보장)
- `category`: corporate
- `isFeatured`: true (HOME 4카드 후보)
- `subtitle.ko`: 매력적인 외모는 호감을, 행동은 기억을, 커뮤니케이션은 감동을
- `summary.ko`: 다수를 위한 특강 + 소수를 위한 그룹 코칭. **IMAGE BUILDING PROGRAM** 으로 기업 임원진 PI 진단까지.

**body** (PortableText 본문, 3 H2 섹션):
1. **APPEARANCE** — 외모 (호감) — 핵심 5~6개만: Color, Wardrobe, Style, Makeup, Hair, Grooming
2. **BEHAVIOR** — 행동 (기억) — Etiquette, Manner, Attitude, Personality
3. **COMMUNICATION** — 커뮤니케이션 (감동) — Speech, Body language, Presentation, Listening

**highlights** (LocaleString[]):
- "특강식 1~2h · 다수 워크샵"
- "그룹 코칭식 3h+ · 1:1 코칭 결합"
- "Personal Identity Analysis"
- "TPO 헤어 이미지"
- "Voice 강화 훈련"

### 3-2. executive (임원·VVIP)

**매핑 출처**: 기존 사이트 `VVIP 이미지컨설팅` (3개 서브) + 학교 카테고리 일부 흡수

**Sanity service 스키마**:
- `title.ko`: VVIP 이미지 컨설팅
- `slug.current`: **`executive`** ← 수동 설정
- `category`: executive
- `isFeatured`: true
- `subtitle.ko`: **TASTE PROGRAM** — 맞춤형 1:1 코칭부터 그룹·이벤트까지
- `summary.ko`: VVIP 고객 특별 행사·혜택 제공·고객 유치 프로모션. 1:1 Man-to-Man / 4인 그룹 / 이벤트 3 형식

**body** (3 형식별 섹션):
1. **개인을 위한 코칭식 (1:1 Man to Man)** — 맞춤형 TASTE PROGRAM, 3h+, A/B/C 자유 선별
2. **소수의 그룹코칭** — 4인 구성, 2h, 비용 부담 ↓
3. **이벤트 / 초청행사** — 1~2h, 단독 강의·워크샵

**highlights** (시그니처 모듈):
- "맞춤형 TASTE PROGRAM"
- "22 Type Image Scale" (CMK 핵심)
- "Personal Color System (Best & Worst)"
- "**명품 브랜드 연구 및 선택법**" ← VVIP 차별
- "Open Face — 호감도 전략"
- "Global Manner & Body Language"

### 3-3. public (공공·관공서·기관)

**매핑 출처**: 기존 사이트 `기관이미지`. 콘텐츠는 기업/금융과 100% 동일했으므로 차별화 필요.

**Sanity service 스키마**:
- `title.ko`: 공공·관공서 이미지
- `slug.current`: **`public`** ← 수동 설정
- `category`: public
- `summary.ko`: **장·차관 미디어 트레이닝** 부터 국방부 국민소통 전문가단까지 — 공공 리더를 위한 IMAGE BUILDING PROGRAM
- 콘텐츠 골격은 corporate 와 유사하지만 **클라이언트 사례·톤** 으로 차별화

**차별화 포인트** (history 인용):
- 문화체육관광부 (2009·2012·2015) / 국무총리실 (2010) / 합동참모본부 (2012) / 국방부 (2024)

> 콘텐츠 동일 = 매거진 톤 어색. **사례 중심으로 차별화** 가 핵심.

### 3-4. media (미디어·방송)

**매핑 출처**: 기존 사이트 `미디어이미지`

**Sanity service 스키마**:
- `title.ko`: 미디어 이미지 전략
- `slug.current`: **`media`** ← 수동 설정
- `category`: media
- `subtitle.ko`: **"표정과 제스츄어는 거짓말하지 않는다"**
- `summary.ko`: 언론·미디어 환경 변화에 대한 이해와 효과적 홍보기법 습득. **A/B/C 순차적 프로그램** 으로 구성. 3h+, 그룹코칭식.

**body** (3 모듈):
1. **이미지 트레이닝 (APPEARANCE)** — 인상학·체형·헤어·메이크업·그루밍
2. **Gesture & Smart Body Language (BEHAVIOR)** — 사진 촬영 시 리더의 자리·인터뷰 자세 ← **미디어 차별 포인트**
3. **Speech Consulting (COMMUNICATION)** — 발성·호흡·발음·리딩·인터뷰·브리핑·즉흥·표현력

**highlights**:
- "사진 촬영 시 리더의 자리"
- "인터뷰 사진 촬영 자세"
- "방송 리딩·브리핑 스피치"
- "동아일보 채널A 24차수 진행"

### 3-5. 흡수/제외

| 기존 카테고리 | 처리 |
|---|---|
| **개인이미지** | 미추가 → 일부 콘텐츠(VOICE/Smart Body Language/얼굴근육훈련) 는 executive 1:1 또는 corporate BEHAVIOR 에 흡수 |
| **학교** (HISTORY 카테고리) | executive 또는 public 안에 사례로 흡수 (이화여대 김선욱 총장 = public) |

---

## 4. Image Lab 매핑 (결정 3: 한 줄 카피 1차 노출)

핸드오프 §6.5 (v1.3.12 갱신) — 인덱스 페이지는 항상 노출, labArticle 비어있으면 카드 그리드만 placeholder.
labArticle 스키마는 이미 존재.

### 4-1. Image Lab 인덱스 페이지

3개 영역 카드로 노출 (기존 사이트의 한 줄 카피 그대로):

| 영역 | 카피 | labArticle.field |
|---|---|---|
| **퍼스널 컬러** | 자연적인 색채조화로 사람에게 어울리는 색을 진단하는 프로그램 | 퍼스널컬러 |
| **스타일** | 바디 타입 진단을 통해 자신만의 어울리는 소재, 실루엣, 패턴을 알 수 있는 시스템 | 스타일 |
| **골격과 헤어** | 얼굴형과 골격에 따라 헤어 스타일과 헤어 웨어를 연출하는 프로그램 | 골격 / 헤어 |

### 4-2. 본문 (콘텐츠 들어오면 채움)
- 첫 등록은 placeholder ("Articles coming soon") 가능
- 클라이언트가 자료 (연구 결과·아티클·이미지) 제공 시 labArticle 문서 신설

---

## 5. Academy 4 강좌 매핑

핸드오프 §6.4. academyCourse 스키마 활용.

### 5-1. Taste Image Scale

| 필드 | 값 |
|---|---|
| `title.ko` | Taste Image Scale |
| `slug.current` | **`taste-image-scale`** ← 수동 설정 |
| `level` | 강사양성 |
| `summary.ko` | **1997 일본·2000 미국 특허 '감성 이미지 통계학'** 기반. 색채학자 사토 쿠니오·히라사와 토오루. **22 Type Image Scale** 활용 컨설팅 전문가 양성 |
| `duration` | (미정) |
| `schedule` | 일정 추후 통보 |
| `capacity` | 5 |
| `certificate.ko` | CMK Certification + 퍼스널컬러 3급 자격시험 |
| `isOpen` | false (일정 미정) |

**curriculum** PortableText:
- 테이스트 이미지 스케일 개요·정의
- 색채 스케일 분석
- 패션 테이스트 (소재·무늬·실루엣)
- 이미지 (기질) 분석
- 얼굴형 인물 스케일
- **감성 카테고리 22 Type 분석** (시그니처)
- 이미지별 꼴라쥬 작업
- 22 Type 메이크업 활용·컬러 구별·메이크업 스킬

### 5-2. 이미지 컨설턴트 전략 과정

| 필드 | 값 |
|---|---|
| `title.ko` | 이미지 컨설턴트 전략 과정 |
| `slug.current` | **`image-consultant`** ← 수동 설정 |
| `level` | 강사양성 |
| `summary.ko` | 파트너 컨설턴트 네트워크 구축 · CMK PI 코칭 스킬 트레이닝. **연 2회 (상반기/하반기)** · 5일 과정 |
| `duration` | 5일 |
| `schedule` | 연 2회 (세부 일정 추후) |
| `capacity` | 10 |
| `tuitionNote.ko` | **조미경 대표 직접 현장실습 10회 + 이미지 진단천 38만원 상당 제공** |
| `certificate.ko` | CMK 수료증 + 민간 자격증 |

**curriculum** PortableText (5일 모듈 H2):
1. **1일** — IMAGE CONSULTING (PI·인상학·오방색) + OPEN FACE / 바디타입 진단
2. **2일** — Personal Color 1·2 (사계절·Yellow/Blue base·드레이핑·Image Map)
3. **3일** — 12톤별 메이크업 + BODY LANGUAGE & BUSINESS ATTITUDE
4. **4일** — 바디프레임 스타일 남성 3타입 (Straight/Wave/Natural) + 여성 골격 진단
5. **5일** — STYLE THE MAN + Train-the-Trainers (GROW 코칭 모델)

### 5-3. 메이크업 과정

| 필드 | 값 |
|---|---|
| `title.ko` | 퍼스널 메이크업 |
| `slug.current` | **`makeup`** ← 수동 설정 |
| `level` | 실기 |
| `summary.ko` | 퍼스널 이미지 메이크업 바탕 · 강의식 + 1:1 코칭식 · 5~10명 |
| `capacity` | 10 |
| `certificate.ko` | CMK Certification + 퍼스널컬러 3급 자격시험 |

**curriculum** 모듈:
- Make up & Grooming · 퍼스널 컬러 메이크업 · 메이크업 실습 (**MAKE-UP SMART STEP** · Warm-Soft/Hard · Cool-Soft/Hard 4 패턴 · **3D 메이크업**) · 테마별 실습 · 미디어 여성/남성 메이크업

### 5-4. 퍼스널컬러 진단 과정

| 필드 | 값 |
|---|---|
| `title.ko` | 퍼스널 컬러 진단 과정 |
| `slug.current` | **`personal-color`** ← 수동 설정 |
| `level` | 실기 |
| `summary.ko` | 강의식 + 1:1 코칭식 · **3~5일** · 5~10명 |
| `duration` | 3~5일 |
| `capacity` | 10 |
| `certificate.ko` | CMK Certification + 퍼스널컬러 3급 자격시험 |

**curriculum** 모듈:
- 퍼스널 컬러 개요·역사 · 색의 기초이론 · **PCCS 톤 시스템** (일본 표준) · 웜/쿨·사계절 배색 · 피부색 조색 · 드레이핑 스킬 · 코디네이션 · 진단 테스트·포트폴리오 발표

---

## 5-A. stat · clientLogo 매핑 (v1.3.12 신설 — 발견 2)

HOME §6.1 섹션 5 노출용. 입력 단계(§11)에서 빠뜨리면 HOME 의 누적 수치·로고월 섹션이 빈 카드로 나옴.

### 5-A-1. stat (누적 수치)

Sanity Studio → "stat" 문서로 등록. HOME `Stats` 컴포넌트가 `order` 정렬로 자동 노출.

| `label.ko` | `value` | `suffix` | `order` | 출처 |
|---|---|---|---|---|
| 누적 교육 임직원 | (확인 필요, 추정 12,000+) | 명 | 1 | HISTORY 합산 (현대차 96명 + ING 200명 + …) |
| 출강 기업·기관 | (확인 필요, 추정 50+) | 곳 | 2 | HISTORY 거래 기업 명단 |
| 헤리티지 | 18 | 년 | 3 | Since 2008 → 2026 기준 |

⚠️ 정확 수치는 §9-2 #8 클라이언트 컨펌 필요. 일단 추정치로 입력 후 컨펌 받으면 교체.

### 5-A-2. clientLogo (거래 기업 로고)

Sanity Studio → "clientLogo" 문서로 등록. `consentGiven == true` 인 문서만 사이트 노출 ([[feedback-secrets]] 와 별개 — 노출 동의 차원).

| `name` | `industry` | `logo` | `consentGiven` |
|---|---|---|---|
| (예) 현대자동차 | 대기업 | 클라이언트 제공 PNG | true (동의 받았을 때만) |
| (예) SK | 대기업 | … | true/false |
| (예) 동아일보·채널A | 대기업 | … | true/false |

⚠️ HISTORY 의 40+ 명단 중 **동의 받은 곳만** 등록. 정치인·정부기관은 게재 동의 어려움 → 통상 미노출.
§9-2 #7 클라이언트 컨펌으로 동의 명단 확보 후 일괄 등록.

> Sanity `clientLogosQuery` 가 `consentGiven == true` 만 가져옴 (`apps/web/src/lib/queries.ts`).

---

## 6. Community 매핑

핸드오프 §6.6. post 스키마 활용.

### 6-1. CMK NEWS 게시판
- 기존 게시판 데이터 (총 85건) 전부 마이그레이션 불필요
- **2024~2025 핵심 8~10건만 선별** 마이그레이션
- 카테고리: `공지` / `행사` / `수상·인증` / `강의·미디어` / `인터뷰·기고`

**우선 마이그레이션 후보 (Face Type 보류 시)**:
- 2024-09-10: 국방부 국민소통 전문가단 8기 위촉 → `수상·인증`
- 2025-10-30: 일본국제자격과정 개최 안내 → `행사` (단, Face Type 보류면 카피 다듬어서)
- 2013-05-07: [매일경제] 조미경 대표 — 현대차 카마스터 이미지 변신 → `인터뷰·기고`
- 2013-12-18: YTN 뉴스 조미경 대표 인터뷰 → `강의·미디어`

### 6-2. CMK 강의 (영상)
- 기존 6 페이지 영상 게시판
- 새 사이트는 YouTube 임베드 활용 → post 스키마의 `externalUrl` 필드 사용
- 우선 12개 영상 제목만 텍스트 마이그레이션, 실제 영상 URL은 클라이언트 확인 후

---

## 7. 매거진 톤 시그니처 정수 (영문 키워드)

곳곳에 시각 장식으로 사용. 본문 풀어쓰기 X, 헤더·구분선·푸터 영문 카피 등.

**A 축 (Appearance)**: Color · Style · Wardrobe · Makeup · Hair · Grooming

**B 축 (Behavior)**: Etiquette · Manner · Attitude · Wellness

**C 축 (Communication)**: Linguistics · Speech · Listening · Presentation

**CMK 시그니처 메소드**:
- **PI** (Personal Identity)
- **22 Type Taste Image Scale** ← 핵심
- **Open Face** (열린 얼굴)
- **Best/Worst Color**
- **Bodyframe Style 3 Type** (Straight · Wave · Natural)
- **M·H·Y 라인** (남성 골격)
- **TASTE PROGRAM** (VVIP)
- **MAKE-UP SMART STEP**
- **PCCS 톤**
- **GROW 코칭 모델** (Goal>Reality>Option>Will)

**3C 정신**:
- Creative · People · Communication

**키 카피**:
- "표정과 제스츄어는 거짓말하지 않는다"
- "현 시대는 이미지 커뮤니케이션 시대입니다"
- "보이는 것을 함께 쌓는 일." (ContactCta — 기존 핸드오프 §1.1)
- "보이는 것이, 전해지는 것입니다." (Hero — 기존 핸드오프 §0)

---

## 8. 매거진 톤 제거 대상 (활용 안 함)

| 제거 대상 | 사유 |
|---|---|
| 모든 카테고리 페이지의 11/8/9개 영문 항목 풀 나열 | 매거진 톤 아님. 정수 5~6개로 압축 |
| "본 컨텐츠는 다수를 위한 특강식과..." 반복 카피 | 정형화된 안내문, 매거진 톤 아님 |
| 강의 모듈 표 (Module/Contents) 그대로 옮기기 | 표 자체가 매거진 톤 아님. PortableText body 안에 본문화 |
| 58명 강사진 명단 전체 | 매거진 톤은 핵심 5~10명만 |
| 거래기업 명단 전체 (40+ 개) | 동의 받은 것만 + 로고 (텍스트 아님) |
| "강의 시간 / 전문 컨설턴트" 같은 행정 정보 | service body 에서 제거, summary 에 압축 |
| 모바일 사이트 m.cmkimage.co.kr · T-store 앱 | 옛 자산, 새 사이트는 반응형 |
| 중국어 메뉴 (Chinese) | KO only 1차 오픈 결정 ([[feedback-design-tone]] §1) |

---

## 9. 클라이언트 컨펌 패키지 (전달용 묶음, v1.3.12 재배열)

다음 항목을 **한 번에 묶어서** 클라이언트에 전달 → 법무 검토와 함께 진행.
우선순위: lead time 긴 것 = 일찍 푸쉬 (발견 6).

### 🚨 9-1. 긴급 — Phase 6 배포 자료 (lead time 최장, 못 받으면 배포 불가)
1. **Cafe24 FTP** 호스트·계정·비번·경로
2. **DNS 권한** — 도메인 등록기관 (Cafe24 자체 vs 외부)
3. **Resend 도메인 인증** — DKIM·SPF·DMARC TXT 등록 권한 (propagation 수 분~수 시간)
4. **기존 URL 구조 확인** — 301 리다이렉트 매핑(§12) 작업용 (기존 사이트 페이지 트리)

### 9-2. 콘텐츠·구조 결정 요청 (기획안 v1·v2 미반영 항목)
5. **Face Type 메소드 노출 여부** — 2025년 신간·일본자격과정 푸쉬. 새 사이트 핵심 메시지로 격상할지
6. **개인이미지 페이지 유지 여부** — 새 사이트는 B2B 4 카테고리만. 별도 페이지 추가할지
7. **기존 게시판 85건 마이그레이션 범위** (v1.3.12 신설 — 발견 10) — 새 사이트 마이그레이션 8~10건만 권장. 나머지 75건+ 폐기 OK?

### 9-3. 자료 요청 (콘텐츠 입수 lead time)
8. **History 2017~2024 주요 활동** 자료 — 회사 연혁 9년 공백
9. **조미경 대표 약력** — 학력·자격(AICI 등)·직함·저서·정확한 영문명
10. **조미경 대표 프로필 이미지** — 고품질, 가로/세로 각 1
11. **핵심 강사 5~10명** — 노출 동의 + 사진·직함·약력·자격증 + **role 구분** (v1.3.12 — 발견 8): `수석 강사` / `강사` / `파트너 컨설턴트` 중 어느 분류
12. **거래 기업 로고 게재 동의** — 40+ 명단 중 동의 받은 곳만. consentGiven=true 처리
13. **누적 수치** — 임직원 컨설팅 누적 인원·기업 수·연수 (HISTORY 기반 추정 가능하지만 컨펌 권장)

### 9-4. 저작권·라이선스·환불 (v1.3.12 신설 — 발견 5, 법적 리스크)
14. **22 Type Taste Image Scale 라이선스** — 1997 일본·2000 미국 특허 (사토 쿠니오·히라사와 토오루 외부 저작권자). CMK 사이트 노출 시 라이선스 표기·계약 상태 확인 필요
15. **기존 사이트 인물 사진 58명 활용 권한** — 기존 사진 그대로 사용 가능 vs 신규 촬영 필요. 신규면 lead time + 비용 발생
16. **Academy 환불·취소 정책** — `academyCourse.tuition` 으로 수강료 게시 시 환불 정책 필수 (전자상거래법·콘텐츠산업 진흥법). 약관 초안 §8-2 에 placeholder 있음 → 정식 정책 확정 필요

### 9-5. 운영 정보 확인
17. **회사 주소** — 한글 `215동 303호` vs 영문 `206동 1902호` — 정확한 호수
18. **메인 연락처** — `031-284-2566` 사무실 vs `010-7269-8836` 모바일 — 노출 우선순위
19. **이메일** — `@hanmail.net` 유지 vs `@cmkimage.co.kr` 도메인 이메일 전환
20. **SNS 운영 여부** — 페이스북(`facebook.com/cmkimage`) 외 인스타·유튜브·카카오 채널

### 9-6. 약관 (별도 진행 — `docs/legal/` 참조)
21. **개인정보처리방침** 법무 검토 (`docs/legal/개인정보처리방침_초안.md`)
22. **이용약관** 법무 검토 (`docs/legal/이용약관_초안.md`)
23. 약관 시행일·DPO 정보 등 `[클라이언트 확인 필요]` 항목 (`docs/legal/Studio_약관등록_가이드.md`)

---

## 10. 미결 / 디자인 결정 필요 항목 (사용자 검토 영역)

기획안 v1·v2 에 있어서 사용자 (V-Directors) 가 결정 가능한 영역:

**v1.3.14 진행 상태**: 해소 ✓ 4건 / 부분 해소 ◐ 3건 / 미해소 ☐ 4건.
v1.3.13~14 에서 audit §10 외 추가로 발견·결정된 항목 11건 (Image Lab 신설 / HOME ColorQuiz embed / About Founder→CEO / CEO 사진 fallback / Philosophy 3C+3축 zigzag / PeopleGrid 사진 절반 + 이름만 / HistoryTimeline 2008-2016 zigzag / CEO Credentials 임시 숨김 / consulting PortableText body 활성화 / 시드 스크립트 신설 / clientLogo 임시 시드) 은 핸드오프 v1.3.13·v1.3.14 Changelog 에 명문화.

**v1.3.16 추가 진행 (Day 10+)**: ✓ LogoWall 4 섹션 × 8 박스 = **32 컬러 로고 정규화** (CLIENT_LOGO_MAP 정적 매핑, audit §2-4 임시 텍스트 10건 → 정식 PNG) / ✓ Community 카테고리 라우팅 **3축** (`/community` + `/community/media` + `/community/news`) + 페이지네이션 / ✓ post 시드 **154건** (65 강의·미디어 + 89 뉴스, news-data·media-data JSON 자동 시드 패턴 확립) / ✓ 강사진 73명 사진·약력 자동 시드 (스크린샷/강사진 → public/images/people) / ✓ 영상 65 mp4 정적 호스팅 (572.8MB, Cafe24 FTP 배포 포함) / ✓ 뉴스 본문 HTML 자동 정제 (cmk-specific selector + _files 폴더 처리) / ✓ 약관 자동 시드 (docs/legal/ → page-privacy·terms body PortableText) / ✓ 감사원 잔재 정정 (HistoryTimeline + audit §2-4 동기화). consulting axes 카드 컴포넌트 (v1.3.15) + service-personal 추가 + ConsultingPageHead 5 카테고리 nav 도 v1.3.15 산출물.

- ☐ HOME Hero 영상/이미지 콘셉트 (현재 placeholder) — Hero 사이즈만 조정 (v1.3.14 — `h-[calc(100svh-89px)]` 헤더 포함 화면 꽉 차게). 영상·이미지 콘텐츠 자체는 미결
- ✓ HOME 시그니처 4카드 — v1.3.13 결정 #5 **4장 유지** + Image Lab 별도 진입 (Header 6번째 메뉴). ServiceCards 코드 `slice(0, 4)` 유지
- ☐ About 5 서브 메뉴 (philosophy/ceo/history/people/all) 순서 확정
- ☐ PageHead lowercase 제목 영문 (corporate? business? — 카테고리별 영문 정렬)
- ✓ 클라이언트 명단 → 로고 슬라이드 시각 — v1.3.14 임시 시드 (10건, 텍스트만) → **v1.3.16 32 컬러 로고 정규화** (4 섹션 × 8 박스 + CLIENT_LOGO_MAP 정적 매핑 + 하단 italic 캡션 "외 100여 클라이언트"). 정식 동의 명단은 §9-2 #7 컨펌 후 추가 보강
- ◐ Image Lab 카드 3개 시각 — v1.3.13 `LabAreaCards.astro` 신설로 3 영역 카드 (글자만 + 한 줄 카피, audit §4 결정 3 따름). 사진·일러스트 추가 여부는 미결
- ☐ Academy 카드 4개 시각 디자인 (가격 노출 여부)
- ◐ **Color Quiz 5단계** — v1.3.13 HOME `ColorQuizSection.astro` 신설 + 실제 ColorQuiz embed (사용자 결정 #2 v1.3.13). React island 활성화 + 결과 페이지 동작. Q1~Q5 카피 콘텐츠 검수는 미결
- ✓ **Contact 3폼 분기** — v1.3.14 사용자 결정 **별표 ★ 제거** (`Corporate ★` → `Corporate`) + 세 버튼 동일폭 grid + 화살표 제거. 시각 동등화 완료 (HOME ContactCta + Contact PageHead + Contact 폼 본문 + Consulting 카테고리 라벨까지)
- ✓ **HOME 누적 수치 카운트업** — v1.3.13 사용자 결정 #4 **구현** (`StatsCounter.tsx` IntersectionObserver + ease-out cubic 1.6s + `prefers-reduced-motion` 대응). v1.3.14 12-col 재구성 (좌 7 — eyebrow `Heritage` + 큰 세리프 `수치로 본 CMK.` + 카피 + 카운트업 3건. 우 5 — `aspect-[4/5]` 사진 placeholder)
- ✓ **History 9년 공백** — v1.3.13 사용자 결정 #6 → v1.3.14 사용자 재정정 **2008-2016 만 표시**. audit §2-4 9 마일스톤 (문체부·국무총리실·합참·삼성·SK·현대차·동아일보·중국 GIRL UP 등). 2017 이후는 클라이언트 자료 확정 후 추가. zigzag 매거진 패턴 (가운데 vertical line + 큰 italic 연도). **v1.3.16** — 감사원 자료 사용자 정정 (HistoryTimeline + audit §2-4 동기화) + 2008 "사업자등록 기준" note 제거

---

## 11. 다음 단계 — 옵션 B (Sanity Studio 입력) 가이드

본 문서 검수 완료 후 → Sanity Studio 직접 입력.

### 입력 순서 권장 (v1.3.12 보강 — 9 스키마 전체)
1. **siteSettings** (싱글톤) — 회사 기본 정보 + SNS — **§1 참조**
2. **person** (조미경 대표 단독, `isCeo=true`) — **§2-2 참조**
3. **person** (핵심 강사 5~10명, `isCeo=false`) — **§2-5 + §9-3 #11 (role 구분 필수)**
4. **stat** (누적 수치 3건) — **§5-A-1 참조** (v1.3.12 신설 — 발견 2)
5. **clientLogo** (consentGiven=true 만) — **§5-A-2 참조** (v1.3.12 신설 — 발견 2)
6. **service 4건** (corporate/executive/public/media) — **§3 참조**
7. **academyCourse 4건** — **§5 참조**
8. **post 4~5건** (NEWS 핵심만) — **§6-1 참조**
9. **labArticle** — 본문 미정, Image Lab 인덱스의 3 카드만 항상 노출 — **§4 참조**
10. **page** (privacy/terms) — `docs/legal/` 콘텐츠 + 약관 등록 가이드 (`docs/legal/Studio_약관등록_가이드.md`) — 법무 검토 후

### 입력 후 검수
- 각 페이지 `localhost:4321` 에서 즉시 확인
- 매거진 톤 흐트러지면 본 문서 §7·§8 기준으로 조정
- 클로드B 디자인 검수 진입 (Day 10)

---

## 12. 기존 URL → 새 URL 301 리다이렉트 매핑 (v1.3.12 신설 — 발견 3)

기존 cmkimage.co.kr 의 22 페이지 + 게시판 85건 ≈ 100+ 인덱싱된 URL.
IA 재편 결과 거의 모든 URL 변경 → **301 리다이렉트 없이 배포 시 SEO 누적치 손실 + 외부 인용 링크 끊김**.

### 구현 방식 (Cafe24 정적 호스팅)
- **`.htaccess`** (Apache) 패턴 또는
- **`_redirects`** (Cloudflare Pages 호환) — Cafe24 미지원 시 `.htaccess` 만 사용
- 빌드 후 `apps/web/dist/.htaccess` 로 함께 배포 (GitHub Actions FTP-Deploy 에 포함)

### 매핑표 (작성 시작)

| 기존 URL | 새 URL | 코드 | 비고 |
|---|---|---|---|
| `/cmk` 또는 `/about_cmk` | `/about/philosophy` | 301 | About 3C 정신 페이지 |
| `/ceo` | `/about/ceo` | 301 | 대표 인사말 |
| `/cmk_history` | `/about/history` | 301 | 연혁 |
| `/service_contents` | `/about/philosophy` (또는 새 page) | 301 | 3축 방법론은 philosophy 안 |
| `/cmk_people` | `/about/people` | 301 | 강사진 |
| `/contact_us` | `/contact` | 301 | 문의 |
| `/personal_color` (이미지연구소) | `/image-lab` | 301 | 한 줄 카피로 통합 |
| `/style_research` | `/image-lab` | 301 | |
| `/skeleton_hair` | `/image-lab` | 301 | |
| `/corporate_finance/*` | `/consulting/corporate` | 301 | 3 서브 모두 |
| `/institution/*` | `/consulting/public` | 301 | 3 서브 모두 (기관→public) |
| `/vvip/*` | `/consulting/executive` | 301 | 3 서브 모두 |
| `/media_image` | `/consulting/media` | 301 | |
| `/personal/*` | `/contact?form=personal` | 301 | 별도 페이지 없음 — 폼 탭으로 |
| `/academy/taste_image_scale` | `/academy/taste-image-scale` | 301 | slug 표준화 |
| `/academy/image_consultant` | `/academy/image-consultant` | 301 | |
| `/academy/makeup` | `/academy/makeup` | 301 | (그대로) |
| `/academy/personal_color` | `/academy/personal-color` | 301 | |
| `/community/news` | `/community` | 301 | (NEWS 인덱스) |
| `/community/news/{id}` | `/community/{slug}` | 301 | 게시글 마이그레이션 시 매핑 |
| `/community/lecture` | `/community` (강의 카테고리 필터) | 301 | |

⚠️ **클라이언트 액션 (§9-1 #4)** — 기존 사이트의 정확한 URL 패턴 확인 필요. 위 매핑은 메뉴명 기반 추정. **Cafe24 관리자 페이지에서 실제 URL 구조** 확인 후 매핑표 확정.

### 작성 일정
- **Day 9~10 진행 중** 매핑표 작성 (lead time)
- **§9-1 #4 클라이언트 답신 받은 직후** 매핑표 확정 — 위 21개 항목은 "메뉴명 기반 추정" 이라 클라이언트가 보내는 실제 URL 패턴(Cafe24 관리자 페이지 기준) 으로 한 번 더 검증 필요
- **Day 11 (Phase 6 배포)** 직전 `.htaccess` 빌드 산출물에 포함
- 배포 후 Search Console / Google Analytics 에서 404 모니터링 → 누락 매핑 추가

---

**문서 끝 — Day 9 마무리. Day 10 (전체 디자인 검수 라운드) 진입 전 사용자 검수 필요.**
