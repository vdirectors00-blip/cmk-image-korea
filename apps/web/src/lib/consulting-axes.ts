// Consulting 3 축 데이터 (v1.3.15)
// 카테고리별 데이터. `ConsultingAxes.tsx` 컴포넌트가 props 로 받음.
// public 은 corporate 와 동일 (audit §3-3) + 주요 사례 차별화는 페이지에서 별도 노출.
// executive 는 3 형식 패턴 (1:1 / 소수 그룹 / 이벤트) — 별도 결정 후 추가.

export interface AxisModule {
  name: string;
  description?: string;
}

export interface AxisFormat {
  name: string;
  duration: string;
  feature?: string;
  modules: AxisModule[];
}

export interface AxisCard {
  label: string;
  korean: string;
  copy: string;
  contents: string[];
  formats: AxisFormat[];
}

export interface CategoryAxes {
  axes: AxisCard[];
}

// 공통 형식 특징
const FEATURE_SPECIAL = "컨설턴트의 단독 강의식 — 기업 단체집합 세미나·워크샵·고객초청행사 등 이벤트에 적합.";
const FEATURE_GROUP = "강의식 + 1:1 코칭의 이상적 결합 형식 — 다수 정보와 개인 진단을 동시에.";

// ───────────────────────────────────────────────
// corporate (기업·금융)
// ───────────────────────────────────────────────
export const corporateAxes: CategoryAxes = {
  axes: [
    {
      label: "Appearance",
      korean: "호감",
      copy: "매력적인 외모는 사람의 마음을 사로잡아 호감을\n느끼게 합니다.",
      contents: [
        "Color 퍼스널 컬러 활용",
        "22type Taste Image Scale 이미지 타입 연구",
        "Wardrobe 의상 모듈화",
        "Personal Shopping 동행 쇼핑",
        "Fashion & Style 패션&스타일",
        "Makeup 메이크업/분장",
        "Hair 헤어 연출",
        "Aesthetics 위생 및 피부관리",
        "Nail 네일 연출",
        "Grooming 자기 관리",
        "Modeling 외모의 구축",
      ],
      formats: [
        {
          name: "특강식",
          duration: "1~2h · 단체 세미나·워크샵",
          feature: FEATURE_SPECIAL,
          modules: [
            {name: "Personal Identity Analysis", description: "인상학과 이미지메이킹 · 퍼스널 컬러의 활용과 이해"},
            {name: "Style Consulting", description: "체형 별 의상·정장·비즈니스 캐주얼·액세서리·향수"},
            {name: "TPO 별 헤어 이미지", description: "오픈 페이스 호감도 · 얼굴형 헤어스타일 · 헤어 제품"},
            {name: "Personal Image Make-up / Grooming", description: "m/u 연출 · 메이크업 제품 선별 · 남성 그루밍 전략"},
          ],
        },
        {
          name: "그룹 코칭식",
          duration: "3h+ · 강의식 + 1:1 코칭 결합",
          feature: FEATURE_GROUP,
          modules: [
            {name: "PI 추구 이미지 & 현재 이미지 분석", description: "Best & Worst Color · Open Face · TPO 연출 전략"},
            {name: "플러스 이미지 개발 & Visual 패션 스타일링", description: "바디 타입 · 골격 · 체형 보완 · 비즈니스 스타일 · 직업별 코디"},
            {name: "Personal Image Make-up / Grooming", description: "여성 m/u · 남성 그루밍"},
          ],
        },
      ],
    },
    {
      label: "Behavior",
      korean: "기억",
      copy: "매력적인 행동은 사람의 마음을 사로잡아 오랫동안\n기억하게 합니다.",
      contents: [
        "Etiquette 에티켓",
        "Manner 매너",
        "Protocol 의례",
        "Wellness 정신적 건강관리",
        "Nutrition & Fitness 육체적 건강관리",
        "Attitude 태도",
        "Life management 생활 관리",
        "Personality 인품&성격",
      ],
      formats: [
        {
          name: "특강식",
          duration: "1~2h",
          feature: FEATURE_SPECIAL,
          modules: [
            {name: "Attitude & Manners", description: "Business Manner 자가진단 · 악수·명함·소개법 · 자세 메시지 · 스마트 바디 랭귀지"},
            {name: "Gesture Skills", description: "제스처 기능·연출·연습 sheet · 파워제스처 (레이건·클린턴·오프라 윈프리·오바마) · 피해야 하는 제스처 · 호흡법"},
          ],
        },
        {
          name: "그룹 코칭식",
          duration: "3h+",
          feature: FEATURE_GROUP,
          modules: [
            {name: "Smart Body Language Skills", description: "몸의 언어 · 표정 언어 · 얼굴 근육훈련 · 시선 · 자세 관리"},
            {name: "Gesture Skills", description: "제스처 기능·연출·파워제스처"},
            {name: "Business Manner", description: "명함 교환 · 악수 연습 · 비즈니스 리더의 자리·성공 전략"},
          ],
        },
      ],
    },
    {
      label: "Communication",
      korean: "감동",
      copy: "매력적인 커뮤니케이션은 사람의 마음을 사로잡아\n감동하게 합니다.",
      contents: [
        "Linguistics 언어",
        "Speech communication 스피치 기술",
        "Body language 몸 언어",
        "Proxemics/Chronemics 공간/시간의미",
        "Listening 청취 & 경청",
        "Presentation skill 프리젠테이션",
        "Public speaking 발표",
        "Interpersonal 대인관계",
        "Human relations & Networks 인적 교류 & 네트워크",
      ],
      formats: [
        {
          name: "특강식",
          duration: "2~3h",
          feature: FEATURE_SPECIAL,
          modules: [
            {name: "Communication Skills", description: "Style Analysis · Skills 의 중요성과 Point · 상황에 따른 호감 Skills"},
            {name: "Speech 트레이닝", description: "음성·언어습관 진단 · 스피치 구조 · 호흡과 발성 · 인터뷰 & 패널 · 언어적·비언어적 경청 · Voice 강화"},
          ],
        },
        {
          name: "그룹 코칭식",
          duration: "3h+",
          feature: FEATURE_GROUP,
          modules: [
            {name: "Communication Skills", description: "Style Analysis · 호감 Skills"},
            {name: "Speech 트레이닝", description: "스피치 구조 (오프닝·바디·클로징·기승전결) · 호흡법·발성법·발음법 · 스피치 훈련 Sheet · 연설전 근육훈련"},
            {name: "Voice 트레이닝", description: "목소리 분석 · 강화 훈련 · 감정 발산 발성 · 리딩 발음 교정 · 품위 있는 목소리 호흡법"},
          ],
        },
      ],
    },
  ],
};

// ───────────────────────────────────────────────
// public (공공·관공서) — audit §3-3: corporate 와 콘텐츠 동일, 사례·톤으로 차별화 (사례는 페이지에서 별도 노출)
// ───────────────────────────────────────────────
export const publicAxes: CategoryAxes = corporateAxes;

// ───────────────────────────────────────────────
// media (미디어) — 그룹 코칭식 단일 형식, 각 축 1 모듈
// ───────────────────────────────────────────────
export const mediaAxes: CategoryAxes = {
  axes: [
    {
      label: "Appearance",
      korean: "호감",
      copy: "매력적인 외모는 사람의 마음을 사로잡아 호감을\n느끼게 합니다.",
      contents: [
        "인상학과 이미지메이킹",
        "이미지메이킹의 필요성",
        "체형 별 의상 연출법/정장 착장법/비즈니스 캐주얼의 활용법",
        "액세서리 연출법과 향수 선택법",
        "상황별, 직업별, 자신에게 맞는 연출",
        "오픈 페이스 찾기 - 호감도 전략",
        "얼굴형에 어울리는 헤어스타일 진단",
        "헤어 제품사용법과 연출 요령",
        "Personal Image Make up (여성) / Grooming (남성)",
      ],
      formats: [
        {
          name: "그룹 코칭식",
          duration: "3h+ · 강의식 + 1:1 코칭",
          feature: "강의식 + 1:1 코칭의 이상적 결합 — 미디어 환경의 카메라 톤·인상·언어를 종합적으로 다듬는 단일 통합 프로그램.",
          modules: [
            {name: "이미지 트레이닝", description: "인상학·체형·헤어·메이크업·그루밍을 통한 카메라에 담기는 인상의 결 정리."},
          ],
        },
      ],
    },
    {
      label: "Behavior",
      korean: "기억",
      copy: "매력적인 행동은 사람의 마음을 사로잡아 오랫동안\n기억하게 합니다.",
      contents: [
        "표정과 제스츄어는 거짓말하지 않는다",
        "사진 촬영 시 리더의 자리",
        "손과 눈과 표정을 통한 커뮤니케이션 전략",
        "인터뷰 시 사진 촬영자세",
      ],
      formats: [
        {
          name: "그룹 코칭식",
          duration: "3h+ · 강의식 + 1:1 코칭",
          feature: "미디어 노출 시 사진·인터뷰 자세와 표정·제스츄어를 다듬는 CMK 미디어 차별 모듈.",
          modules: [
            {name: "Gesture & Smart Body Language Skills", description: "사진 촬영 시 리더의 자리 · 손·눈·표정을 통한 커뮤니케이션 전략 · 인터뷰 시 사진 촬영자세."},
          ],
        },
      ],
    },
    {
      label: "Communication",
      korean: "감동",
      copy: "매력적인 커뮤니케이션은 사람의 마음을 사로잡아\n감동하게 합니다.",
      contents: [
        "스피치 분석 및 발성/호흡/발음훈련",
        "리딩/인터뷰/브리핑 스피치 훈련",
        "즉흥 스피치 훈련",
        "표현력 훈련 (자신의 생각 정리해서 표현하기)",
      ],
      formats: [
        {
          name: "그룹 코칭식",
          duration: "3h+ · 강의식 + 1:1 코칭",
          feature: "방송 현장의 모든 스피치 변수에 대응하는 발성·발음·표현력 훈련.",
          modules: [
            {name: "Speech Consulting", description: "스피치 분석·발성·호흡·발음 훈련 · 리딩·인터뷰·브리핑 · 즉흥 스피치 · 표현력 훈련."},
          ],
        },
      ],
    },
  ],
};

// ───────────────────────────────────────────────
// personal (개인 이미지) — 그룹 코칭식 단일 형식, 각 축 3 모듈
// ───────────────────────────────────────────────
export const personalAxes: CategoryAxes = {
  axes: [
    {
      label: "Appearance",
      korean: "호감",
      copy: "매력적인 외모는 사람의 마음을 사로잡아 호감을\n느끼게 합니다.",
      contents: [
        "자신의 가치를 올리는 이미지의 중요성",
        "Personal color system - Best & Worst color",
        "Open Face(열린 얼굴)에 따른 헤어 연출법",
        "TPO에 맞는 이미지 연출 전략",
        "바디 타입 분석 - 골격·텍스쳐·얼굴형",
        "Fashion & Image & Communication",
        "체형 보완의 비결 · 성공 비즈니스 스타일전략",
        "전문가의 스타일 완성 · 액세서리 활용법",
        "직업별 & 상황별 패션 코디",
      ],
      formats: [
        {
          name: "강의식 + 1:1 코칭식",
          duration: "2h+ · 강의식 + 1:1 코칭",
          feature: FEATURE_GROUP,
          modules: [
            {name: "PI 추구 이미지 & 현재 이미지 분석", description: "Best & Worst Color · Open Face · TPO 연출 전략"},
            {name: "플러스 이미지 개발 & Visual 패션 스타일링", description: "바디 타입 · 체형 보완 · 비즈니스 스타일 · 직업별 코디"},
            {name: "Personal Image Make-up / Grooming", description: "여성 m/u · 남성 그루밍 전략"},
          ],
        },
      ],
    },
    {
      label: "Behavior",
      korean: "기억",
      copy: "매력적인 행동은 사람의 마음을 사로잡아 오랫동안\n기억하게 합니다.",
      contents: [
        "스마트한 바디 랭귀지",
        "설득과 행동 연관성",
        "몸의 언어 · 표정 언어",
        "얼굴 근육훈련",
        "시선관리 · 자세관리 (앉은자세·선자세)",
        "제스처 기능·연출·연습 sheet",
        "파워제스처 - 레이건·클린턴·오프라 윈프리·오바마",
        "피해야 하는 제스처 · 호흡법",
        "명함 교환·악수 연습 · 비즈니스 매너",
      ],
      formats: [
        {
          name: "강의식 + 1:1 코칭식",
          duration: "2h+ · 강의식 + 1:1 코칭",
          feature: FEATURE_GROUP,
          modules: [
            {name: "Smart Body Language Skills", description: "몸의 언어 · 표정 언어 · 얼굴 근육훈련 · 시선 · 자세 관리"},
            {name: "Gesture Skills", description: "제스처 기능·연출·파워제스처 · 피해야 하는 제스처 · 호흡법"},
            {name: "Business Manner", description: "명함 교환 · 악수 연습 · 비즈니스 리더의 자리·성공 전략"},
          ],
        },
      ],
    },
    {
      label: "Communication",
      korean: "감동",
      copy: "매력적인 커뮤니케이션은 사람의 마음을 사로잡아\n감동하게 합니다.",
      contents: [
        "Communication Style Analysis",
        "Communication Skills의 중요성과 Point",
        "상황에 따른 호감 주는 Communication Skills",
        "스피치 구조 (오프닝·바디·클로징·기승전결)",
        "호흡법 · 발성법 · 발음법",
        "스피치 훈련 Sheet · 연설전 근육훈련",
        "VOICE - 자신의 목소리 분석·강화 훈련",
        "감정 발산 발성훈련 · 리딩 발음교정",
        "품위 있는 목소리 호흡법",
      ],
      formats: [
        {
          name: "강의식 + 1:1 코칭식",
          duration: "2h+ · 강의식 + 1:1 코칭",
          feature: FEATURE_GROUP,
          modules: [
            {name: "Communication Skills", description: "Style Analysis · 중요성과 Point · 상황에 따른 호감 Skills"},
            {name: "Speech 트레이닝", description: "스피치 구조 · 호흡법·발성법·발음법 · 스피치 훈련 Sheet · 연설전 근육훈련"},
            {name: "Voice 트레이닝", description: "목소리 분석·강화 · 감정 발산 발성 · 리딩 발음 교정 · 품위 있는 목소리 호흡법"},
          ],
        },
      ],
    },
  ],
};

// ───────────────────────────────────────────────
// executive (VVIP) — 3 형식 패턴 (1:1 / 소수 그룹 / 이벤트). axes 구조에 형식 매핑.
// ───────────────────────────────────────────────
export const executiveAxes: CategoryAxes = {
  axes: [
    {
      label: "1:1 Man to Man",
      korean: "맞춤형 TASTE PROGRAM",
      copy: "고객이 A/B/C 영역에서 자유롭게 컨텐츠를 선별, 본인의 니즈에 맞춰 주체적으로 계획.",
      contents: [
        "IMAGE ANALYSIS (이미지 분석)",
        "PERSONAL COLOR SYSTEM (Best & Worst)",
        "ASSESSING THE BODY (바디타입 진단)",
        "22 TYPE IMAGE SCALE (패션 유형 분석)",
        "MAKE-UP & GROOMING CONSULTING",
        "WARDROBE (옷장 관리)",
        "명품 브랜드 연구 및 선택법",
        "PERSONAL SHOPPER (동행 쇼핑·감각훈련)",
        "GLOBAL MANNER & BODY LANGUAGE",
        "VOICE & SPEECH CONSULTING",
      ],
      formats: [
        {
          name: "맞춤형 TASTE PROGRAM",
          duration: "3h+ · 고객 계획 시간에 맞춤",
          feature: "고객이 APPEARANCE / BEHAVIOR / COMMUNICATION 3 축에서 자유롭게 컨텐츠를 선별하여 주체적으로 계획. 3시간 이상의 1:1 코칭으로 진행, 강의 시간은 고객 계획에 맞춤.",
          modules: [
            {name: "APPEARANCE — 8 모듈", description: "IMAGE ANALYSIS · PERSONAL COLOR SYSTEM · ASSESSING THE BODY · 22 TYPE IMAGE SCALE · MAKE-UP & GROOMING CONSULTING · WARDROBE · 명품 브랜드 연구 및 선택법 · PERSONAL SHOPPER"},
            {name: "BEHAVIOR", description: "GLOBAL MANNER & BODY LANGUAGE — 호감을 높이는 바디 커뮤니케이션"},
            {name: "COMMUNICATION", description: "VOICE & SPEECH CONSULTING — 매력적인 목소리와 화법"},
          ],
        },
      ],
    },
    {
      label: "Group Coaching",
      korean: "소수의 그룹 코칭",
      copy: "4인 구성의 그룹형 컨설팅. 비용 부담 최소화, 그룹 구성 시 성별 구분 없음.",
      contents: [
        "PI 추구 이미지 & 현재 이미지 분석",
        "Personal color system - Best & Worst",
        "Open Face · TPO 연출 전략",
        "플러스 이미지 개발 & Visual 패션 스타일링",
        "바디 타입 · 골격 · 체형 보완 · 직업별 코디",
        "Personal Image Make-up / Grooming",
        "Gesture & Smart Body Language Skills",
        "비즈니스 시 자리 · 성공 전략법 · 비즈니스 매너",
      ],
      formats: [
        {
          name: "그룹 코칭식",
          duration: "2h · 4인 그룹",
          feature: "비용 부담을 최소화한 4인 그룹형 컨설팅. 성별 구분 없이 구성. 1:1 코칭의 깊이를 그룹에서 공유.",
          modules: [
            {name: "PI 추구 이미지 & 현재 이미지 분석", description: "자신의 가치를 올리는 이미지 · Best & Worst Color · Open Face · TPO 연출 전략"},
            {name: "플러스 이미지 개발 & Visual 패션 스타일링", description: "바디 타입 · 골격 · 체형 보완 · 비즈니스 스타일 · 직업별 코디"},
            {name: "Personal Image Make-up / Grooming", description: "여성 m/u · 남성 그루밍"},
            {name: "Gesture & Smart Body Language Skills", description: "표정·제스츄어 활용 · 비즈니스 시 자리 · 커뮤니케이션 전략 · 비즈니스 매너"},
          ],
        },
      ],
    },
    {
      label: "Event",
      korean: "이벤트 / 초청행사",
      copy: "다수를 위한 강의식 EVENT — 컨설턴트의 단독 강의식·워크샵·고객 초청행사.",
      contents: [
        "Personal Identity Analysis",
        "인상학과 이미지메이킹",
        "Style Consulting",
        "체형·정장·비즈니스 캐주얼·액세서리",
        "TPO 별 헤어 이미지",
        "Personal Image Make-up / Grooming",
        "Gesture & Smart Body Language Skills",
      ],
      formats: [
        {
          name: "다수를 위한 강의식 EVENT",
          duration: "1~2h · 단독 강의식·워크샵",
          feature: "컨설턴트의 단독 강의식 — 고객 초청행사·워크샵 등 이벤트에 적합.",
          modules: [
            {name: "Personal Identity Analysis", description: "인상학과 이미지메이킹 · 퍼스널 컬러의 활용과 이해"},
            {name: "Style Consulting", description: "체형 별 의상·정장·비즈니스 캐주얼·액세서리·향수"},
            {name: "TPO 별 헤어 이미지", description: "오픈 페이스 호감도 · 얼굴형 헤어스타일 · 헤어 제품"},
            {name: "Personal Image Make-up / Grooming", description: "여성 m/u · 남성 그루밍"},
            {name: "Gesture & Smart Body Language Skills", description: "표정·제스츄어 · 비즈니스 자리 · 커뮤니케이션 전략 · 비즈니스 매너"},
          ],
        },
      ],
    },
  ],
};

// 카테고리별 export (재사용용)
export const consultingAxesByCategory: Record<string, CategoryAxes | undefined> = {
  corporate: corporateAxes,
  public: publicAxes,
  media: mediaAxes,
  personal: personalAxes,
  executive: executiveAxes,
};
