// 5초 퍼스널컬러 퀴즈 로직 — §8.2 / §8.3
// 5문항 → 4계절 5타입 결과 산출

export type Tone = "warm" | "cool";
export type Clarity = "bright" | "deep" | "soft" | "vivid";
export type SeasonType = "spring" | "summer" | "summer-bright" | "autumn" | "winter";

export interface QuizQuestion {
  id: string;
  text: string;
  options: Array<{ label: string; value: Tone | Clarity }>;
}

export const questions: QuizQuestion[] = [
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

export function calculateType(answers: Record<string, string>): SeasonType {
  const tones = [answers.q1, answers.q2, answers.q3, answers.q4];
  const warmCount = tones.filter((t) => t === "warm").length;
  const tone: Tone =
    warmCount >= 3 ? "warm" : warmCount === 2 ? (answers.q1 as Tone) : "cool";

  const clarity = answers.q5 as Clarity;

  if (tone === "warm" && (clarity === "bright" || clarity === "vivid")) return "spring";
  if (tone === "warm" && (clarity === "soft" || clarity === "deep")) return "autumn";
  if (tone === "cool" && clarity === "soft") return "summer";
  if (tone === "cool" && clarity === "bright") return "summer-bright";
  if (tone === "cool" && (clarity === "deep" || clarity === "vivid")) return "winter";

  return "summer";
}

// 5개 시즌의 메타데이터 — 결과 페이지 placeholder
export interface SeasonMeta {
  type: SeasonType;
  english: string;
  korean: string;
  poetic: string;
  palette: Array<{ name: string; hex: string }>;
}

export const seasons: Record<SeasonType, SeasonMeta> = {
  spring: {
    type: "spring",
    english: "Spring Bright",
    korean: "봄, 화사한 빛",
    poetic: "햇살의 결을 입은 사람.",
    palette: [
      { name: "Coral", hex: "#FF6F61" },
      { name: "Peach", hex: "#FFB7A0" },
      { name: "Ivory", hex: "#FFF6E5" },
      { name: "Light Camel", hex: "#D4A574" },
      { name: "Apple", hex: "#A8C66C" },
      { name: "Aqua", hex: "#7FDBDA" },
    ],
  },
  summer: {
    type: "summer",
    english: "Summer Soft",
    korean: "여름, 부드러운 톤",
    poetic: "잔잔한 빛의 결을 가진 사람.",
    palette: [
      { name: "Rose", hex: "#D9A6B0" },
      { name: "Lavender", hex: "#C1B6D6" },
      { name: "Powder Blue", hex: "#B5D0E0" },
      { name: "Soft Gray", hex: "#C7C5C0" },
      { name: "Mauve", hex: "#A78B9A" },
      { name: "Sage", hex: "#A9B89C" },
    ],
  },
  "summer-bright": {
    type: "summer-bright",
    english: "Summer Bright",
    korean: "여름, 맑은 톤",
    poetic: "투명한 빛을 머금은 사람.",
    palette: [
      { name: "Icy Blue", hex: "#A6D0E4" },
      { name: "Magenta", hex: "#E04B8A" },
      { name: "Mint", hex: "#9FE7C9" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Cherry", hex: "#D72660" },
      { name: "Periwinkle", hex: "#8BAEDB" },
    ],
  },
  autumn: {
    type: "autumn",
    english: "Autumn Deep",
    korean: "가을, 깊은 톤",
    poetic: "단정한 빛의 결을 가진 사람.",
    palette: [
      { name: "Terracotta", hex: "#C26A4C" },
      { name: "Mustard", hex: "#C9A227" },
      { name: "Olive", hex: "#7A7B3F" },
      { name: "Chocolate", hex: "#5C3D27" },
      { name: "Rust", hex: "#A04E2F" },
      { name: "Sage Deep", hex: "#6E7755" },
    ],
  },
  winter: {
    type: "winter",
    english: "Winter Deep",
    korean: "겨울, 진한 톤",
    poetic: "선명한 윤곽을 가진 사람.",
    palette: [
      { name: "True Red", hex: "#C8102E" },
      { name: "Royal Blue", hex: "#0033A0" },
      { name: "Black", hex: "#000000" },
      { name: "Pure White", hex: "#FFFFFF" },
      { name: "Fuchsia", hex: "#C71585" },
      { name: "Emerald", hex: "#046A38" },
    ],
  },
};
