/**
 * Sanity 시드 스크립트 — audit (`docs/legacy-content-audit.md`) 정리분 일괄 입력.
 *
 * 실행 (PowerShell, apps/studio 디렉토리에서):
 *   $env:SANITY_AUTH_TOKEN = [System.Net.NetworkCredential]::new("", (Read-Host -AsSecureString "TOKEN")).Password
 *   npx sanity exec scripts/seed.ts
 *   $env:SANITY_AUTH_TOKEN = $null
 *
 * sanity login 우회 — seed.ts 내부에서 `process.env.SANITY_AUTH_TOKEN` 직접 읽음.
 * `--with-user-token` flag 불필요. CLI 로컬 login 세션 없어도 동작.
 *
 * idempotent — createOrReplace 사용. 재실행 안전. 데이터 수정 시 이 파일 패치 후 재실행.
 * media-data.json / news-data.json 도 같이 갱신될 때만 자동 반영.
 *
 * 잔재 도큐먼트 삭제 (시드 후 별도) — `npx sanity exec scripts/cleanup.ts` 사용.
 */

import {createClient} from "@sanity/client";
import * as fs from "node:fs";
import * as path from "node:path";
import {fileURLToPath} from "node:url";

// ES module 호환 __dirname (Node 24 + sanity 3.99 = ESM).
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// UTF-8 BOM strip — PowerShell Out-File 의 BOM 대응. function 선언으로 hoisting 보장.
function stripBom(s: string): string {
  return s.replace(/^﻿/, "");
}

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !dataset) {
  throw new Error("SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET 가 .env 에 없습니다.");
}
if (!token) {
  throw new Error("SANITY_AUTH_TOKEN 환경변수가 비어있습니다. PowerShell 에서 $env:SANITY_AUTH_TOKEN 설정 후 재실행.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

// ───────────────────────── PortableText helpers ─────────────────────────
let _k = 0;
const k = () => `k${++_k}`;

const block = (style: string, text: string, marks: string[] = []) => ({
  _type: "block",
  _key: k(),
  style,
  markDefs: [],
  children: [{_type: "span", _key: k(), text, marks}],
});

const blocks = (rows: Array<{style: string; text: string}>) =>
  rows.map((r) => block(r.style, r.text));

// ───────────────────────── 1. siteSettings ─────────────────────────
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  companyName: {ko: "CMK 이미지코리아"},
  tagline: {ko: "보이는 것이, 전해지는 것입니다"},
  phone: "031-284-2566",
  email: "cmkimage@hanmail.net",
  address: {
    ko: "경기 용인시 기흥구 탑실로 116 탑실마을 대주 피오레 2단지 215동 303호",
  },
  ceo: "조미경",
  businessNo: "107-91-45820",
  // SNS (v1.3.15 사용자 제공)
  instagram: "https://www.instagram.com/cmkimagekorea/",
  youtube: "https://www.youtube.com/channel/UCSl1lcjrHqWx8_QezQO5BTg",
  facebook: "https://www.facebook.com/cmk.cho",
  naverBlog: "https://blog.naver.com/cmkimage",
};

// ───────────────────────── 2. person — CEO 조미경 ─────────────────────────
const ceoBio = blocks([
  {style: "normal", text: "사람들은 대개 이미지메이킹을 떠올리면 정치인이나 연예인 등 특별한 사람들만의 것이라고 생각하는 경우가 많습니다. 그러나 개인의 이미지(Personal Identity)는 현대인 모두에게 필요한 매커니즘으로서 개인의 삶의 질을 높여줍니다."},
  {style: "normal", text: "시대가 급변하고 경쟁이 치열해질수록, 경쟁력을 좌우하는 무기들은 점점 더 평준화됩니다. 현 시대는 이미지 커뮤니케이션 시대입니다. 자신의 부가가치를 높이고 싶다면 자기만의 고유한 이미지를 구축해야 합니다."},
  {style: "normal", text: "저희 CMK이미지코리아가 당신의 이미지 비전을 높이는 데 함께 하겠습니다."},
  {style: "normal", text: "여기서 진정한 당신을 알고"},
  {style: "normal", text: "당신만의 최상의 이미지를 찾으시길 바랍니다."},
  {style: "normal", text: "(주) CMK이미지코리아 대표 조미경"},
]);

const ceoPerson = {
  _id: "person-ceo-jomikyung",
  _type: "person",
  name: {ko: "조미경"},
  title: {ko: "대표"},
  role: "대표",
  isCeo: true,
  axes: ["appearance"], // v1.3.15 — Appearance 축 겸직 (audit Appearance 강사 명단에 포함)
  order: 0,
  bio: {ko: ceoBio},
  credentials: [
    {ko: "2008 — (주) CMK 이미지코리아 설립"},
    {ko: "2009 — 문화체육관광부 장·차관 미디어 트레이닝 진행"},
    {ko: "2010 — 국무총리실 국장급 미디어 트레이닝 진행"},
    {ko: "2013 — YTN 뉴스 인터뷰"},
    {ko: "2014 — 현대자동차 본사 임원진 96명 PI 진단"},
    {ko: "2016 — 중국 북경 GIRL UP 진출"},
    {ko: "2024 — 국방부 국민소통 전문가단 8기 위촉"},
  ],
};

// ───────────────────────── 2-A. teachers 72명 — 3 축 분기 (v1.3.15 + v1.3.16 사진 매핑) ─────────────────────────
// 사용자 OCR 명단 (스크린샷 7장). 이지연 동명이인 2명 (-a / -b), 조미경은 CEO 동일인이라 위 ceoPerson 의 axes 갱신으로 처리 (강사 시드에서 제외).
// v1.3.16 — 사용자가 스크린샷/강사진/<axis>/<이름>.png 폴더 채우면 자동 복사 + imagePath 매핑.

// 강사진 사진 자동 복사 (스크린샷/강사진 → apps/web/public/images/people)
const teacherSrcRoot = path.join(__dirname, "..", "..", "..", "스크린샷", "강사진");
const teacherDstRoot = path.join(__dirname, "..", "..", "web", "public", "images", "people");
const teacherImageMap: Record<string, string> = {};

function copyAndMapTeacherImages(axis: string) {
  const srcDir = path.join(teacherSrcRoot, axis);
  const dstDir = path.join(teacherDstRoot, axis);
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(dstDir, { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    if (!/\.(png|jpg|jpeg|webp)$/i.test(f)) continue;
    fs.copyFileSync(path.join(srcDir, f), path.join(dstDir, f));
    // 파일명에서 확장자 제거 → 이름 매칭 key
    const name = f.replace(/\.[^.]+$/, "");
    teacherImageMap[`${axis}/${name}`] = `/images/people/${axis}/${encodeURI(f)}`;
  }
}
copyAndMapTeacherImages("appearance");
copyAndMapTeacherImages("behavior");
copyAndMapTeacherImages("communication");

function lookupTeacherImage(axis: string, name: string): string | undefined {
  return teacherImageMap[`${axis}/${name}`];
}

// 강사진 약력 자동 파싱 — 스크린샷/강사진/<axis>/<name>.txt
// 형식: 1째 줄 = 이름 (skip). 나머지 = 자유 형식 본문. 빈 줄 = paragraph 구분.
// 약력 없으면 (1째 줄만 있거나 .txt 없음) undefined 반환 → bio 미시드.
function parseTeacherBio(axis: string, name: string): any[] | undefined {
  const txtPath = path.join(teacherSrcRoot, axis, `${name}.txt`);
  if (!fs.existsSync(txtPath)) return undefined;
  const raw = stripBom(fs.readFileSync(txtPath, "utf-8"));
  const lines = raw.split(/\r?\n/);
  // 1째 줄 = 이름 (skip)
  const bodyLines = lines.slice(1);
  // 모든 line 이 empty 또는 whitespace 면 약력 없음
  if (bodyLines.every((l) => !l.trim())) return undefined;
  // 각 line = paragraph (빈 줄 포함 — spacing 보존 위해)
  return bodyLines.map((line, i) => ({
    _type: "block",
    _key: `t-${axis}-${name}-${i}`,
    style: "normal",
    children: [{ _type: "span", _key: `t-${axis}-${name}-${i}-s`, text: line.trim() || " " }],
  }));
}

type TeacherEntry = string | { name: string; fileKey: string };

const TEACHERS_APPEARANCE: TeacherEntry[] = [
  "고현정", "김경미", "김경희", "김다인", "김두리", "김랑희", "김민정", "김선아",
  "김영미", "김영아", "김유주", "김진아", "김혜진", "류지은", "문윤정", "박서연",
  "박서현", "박주해", "박찬혜", "박혜선", "서혜경", "신남진", "신정미", "안채윤",
  "오정주", "은광희", "이기성", "이다진", "이명진", "이민혜", "이선미", "이성은",
  "이승주", "이아름", "이정민",
  { name: "이지연", fileKey: "이지연1" },
  { name: "이지연", fileKey: "이지연2" },
  "이지원", "임우경", "장서진",
  "장윤지", "정다윤", "정수경", "정수빈", "정여아", "조아영", "조주영", "조혜나",
  "조혜진", "최민령", "최승은", "탁이", "한정훈", "홍서원", "홍진희",
];

const TEACHERS_BEHAVIOR: TeacherEntry[] = [
  "김주희", "류병진", "신수진", "여운걸", "유소희", "이선영", "전효정",
];

const TEACHERS_COMMUNICATION: TeacherEntry[] = [
  "권도경", "권인아", "문시정", "벤라체", "손희정", "양용훈", "우지은", "이지윤",
  "한창훈", "홍종윤",
];

function buildTeacher(entry: TeacherEntry, axis: "appearance" | "behavior" | "communication", id: string, order: number) {
  const displayName = typeof entry === "string" ? entry : entry.name;
  const fileKey = typeof entry === "string" ? entry : entry.fileKey;
  const imagePath = lookupTeacherImage(axis, fileKey);
  const bioBlocks = parseTeacherBio(axis, fileKey);
  return {
    _id: id,
    _type: "person",
    name: {ko: displayName},
    isCeo: false,
    axes: [axis],
    order,
    ...(imagePath ? { imagePath } : {}),
    ...(bioBlocks ? { bio: {ko: bioBlocks} } : {}),
  };
}

const teachers = [
  ...TEACHERS_APPEARANCE.map((entry, i) =>
    buildTeacher(entry, "appearance", `person-app-${String(i + 1).padStart(2, "0")}`, 100 + i),
  ),
  ...TEACHERS_BEHAVIOR.map((entry, i) =>
    buildTeacher(entry, "behavior", `person-beh-${String(i + 1).padStart(2, "0")}`, 200 + i),
  ),
  ...TEACHERS_COMMUNICATION.map((entry, i) =>
    buildTeacher(entry, "communication", `person-com-${String(i + 1).padStart(2, "0")}`, 300 + i),
  ),
];

// ───────────────────────── 3. stat 3건 ─────────────────────────
const stats = [
  {
    _id: "stat-trainees",
    _type: "stat",
    label: {ko: "누적 교육 임직원"},
    value: 12000,
    suffix: "명",
    order: 1,
  },
  {
    _id: "stat-clients",
    _type: "stat",
    label: {ko: "출강 기업·기관"},
    value: 50,
    suffix: "곳",
    order: 2,
  },
  {
    _id: "stat-heritage",
    _type: "stat",
    label: {ko: "헤리티지"},
    value: 18,
    suffix: "년",
    order: 3,
  },
];

// ───────────────────────── 4. service 4건 ─────────────────────────
const services = [
  {
    _id: "service-corporate",
    _type: "service",
    title: {ko: "기업·금융 이미지"},
    slug: {_type: "slug", current: "corporate"},
    subtitle: {ko: "매력적인 외모는 호감을, 행동은 기억을, 커뮤니케이션은 감동을"},
    category: "corporate",
    isFeatured: true,
    order: 1,
    summary: {ko: "다수를 위한 특강 + 소수를 위한 그룹 코칭. IMAGE BUILDING PROGRAM 으로 기업 임원진 PI 진단까지."},
    body: {
      ko: blocks([
        // APPEARANCE
        {style: "h2", text: "APPEARANCE"},
        {style: "normal", text: "매력적인 외모는 사람의 마음을 사로잡아 호감을 느끼게 합니다."},
        {style: "normal", text: "Color · 22 Type Image Scale · Wardrobe · Personal Shopping · Fashion & Style · Makeup · Hair · Aesthetics · Nail · Grooming · Modeling."},
        {style: "h3", text: "특강식 — 1~2h · 단체 세미나·워크샵"},
        {style: "normal", text: "Personal Identity Analysis (인상학·이미지메이킹·퍼스널 컬러), Style Consulting (체형 별 의상·정장·비즈니스 캐주얼·액세서리), TPO 별 헤어 이미지 (오픈 페이스·얼굴형 헤어스타일), Personal Image Make-up · Grooming."},
        {style: "h3", text: "그룹 코칭식 — 3h+ · 강의식 + 1:1 코칭 결합"},
        {style: "normal", text: "PI 추구 이미지 & 현재 이미지 분석 (Best & Worst Color System · Open Face · TPO 연출 전략), 플러스 이미지 개발 & Visual 패션 스타일링 (바디 타입·골격·텍스쳐·성공 비즈니스 스타일·직업별 코디), Personal Image Make-up · Grooming."},

        // BEHAVIOR
        {style: "h2", text: "BEHAVIOR"},
        {style: "normal", text: "매력적인 행동은 사람의 마음을 사로잡아 오랫동안 기억하게 합니다."},
        {style: "normal", text: "Etiquette · Manner · Protocol · Wellness · Nutrition & Fitness · Attitude · Life Management · Personality."},
        {style: "h3", text: "특강식 — 1~2h"},
        {style: "normal", text: "Attitude & Manners (Business Manner 자가진단·악수·명함·소개법·자세 메시지·스마트 바디 랭귀지), Gesture Skills (제스처 기능·연출·파워제스처 — 레이건·클린턴·오프라 윈프리·오바마·피해야 하는 제스처·호흡법)."},
        {style: "h3", text: "그룹 코칭식 — 3h+"},
        {style: "normal", text: "Smart Body Language Skills (몸의 언어·표정 언어·얼굴 근육훈련·시선·자세 관리), Gesture Skills, Business Manner (명함 교환·악수 연습·비즈니스 리더의 자리·성공 전략)."},

        // COMMUNICATION
        {style: "h2", text: "COMMUNICATION"},
        {style: "normal", text: "매력적인 커뮤니케이션은 사람의 마음을 사로잡아 감동하게 합니다."},
        {style: "normal", text: "Linguistics · Speech Communication · Body Language · Proxemics/Chronemics · Listening · Presentation · Public Speaking · Interpersonal · Human Relations & Networks."},
        {style: "h3", text: "특강식 — 2~3h"},
        {style: "normal", text: "Communication Skills (Style Analysis·중요성과 Point·상황에 따른 호감 Skills), Speech 트레이닝 (음성·언어습관 진단·스피치 구조·호흡과 발성·인터뷰 & 패널·언어적·비언어적 경청·Voice 강화)."},
        {style: "h3", text: "그룹 코칭식 — 3h+"},
        {style: "normal", text: "Communication Skills, Speech 트레이닝 (스피치 구조 — 오프닝·바디·클로징·기승전결·호흡법·발성법·발음법·연설전 근육훈련), Voice 트레이닝 (목소리 분석·강화·감정 발산 발성·리딩 발음 교정·품위 있는 목소리 호흡법)."},
      ]),
    },
    highlights: [
      {ko: "특강식 1~2h · 단체 세미나·워크샵"},
      {ko: "그룹 코칭식 3h+ · 1:1 코칭 결합"},
      {ko: "Personal Identity Analysis"},
      {ko: "Smart Body Language · Gesture Skills"},
      {ko: "Voice & Speech 트레이닝"},
    ],
    ctaText: {ko: "기업 출강 문의"},
  },
  {
    _id: "service-executive",
    _type: "service",
    title: {ko: "VVIP 이미지 컨설팅"},
    slug: {_type: "slug", current: "executive"},
    subtitle: {ko: "TASTE PROGRAM — 맞춤형 1:1 코칭부터 그룹·이벤트까지"},
    category: "executive",
    isFeatured: true,
    order: 2,
    summary: {ko: "VVIP 고객 특별 행사·혜택 제공·고객 유치 프로모션. 1:1 Man-to-Man / 4인 그룹 / 이벤트 3 형식."},
    body: {
      ko: blocks([
        // 1:1 Man to Man — 맞춤형 TASTE PROGRAM
        {style: "h2", text: "개인을 위한 코칭식 (1:1 Man to Man) — 맞춤형 TASTE PROGRAM"},
        {style: "normal", text: "고객이 A/B/C 영역에서 자유롭게 컨텐츠를 선별하여 주체적으로 계획. 3h+ (고객 계획 시간에 맞춤)."},
        {style: "h3", text: "APPEARANCE — 8 모듈"},
        {style: "normal", text: "IMAGE ANALYSIS (현재 이미지 진단·개선점 설계) · PERSONAL COLOR SYSTEM (Best & Worst Color 분석) · ASSESSING THE BODY (체형 보완·디자인 분석) · 22 TYPE IMAGE SCALE (패션 유형 분석) · MAKE-UP & GROOMING CONSULTING · WARDROBE (옷장 관리법) · 명품 브랜드 연구 및 선택법 · PERSONAL SHOPPER (동행 쇼핑·감각훈련)."},
        {style: "h3", text: "BEHAVIOR"},
        {style: "normal", text: "GLOBAL MANNER & BODY LANGUAGE — 호감을 높이는 바디 커뮤니케이션."},
        {style: "h3", text: "COMMUNICATION"},
        {style: "normal", text: "VOICE & SPEECH CONSULTING — 매력적인 목소리와 화법."},

        // 소수 그룹코칭
        {style: "h2", text: "소수의 그룹 코칭 — VVIP IMAGE GROUP COACHING"},
        {style: "normal", text: "4인 구성. 비용 부담 최소화. 그룹 구성 시 성별 구분 없음. 2h."},
        {style: "h3", text: "4 모듈"},
        {style: "normal", text: "PI 추구 이미지 & 현재 이미지 분석 (Best & Worst Color · Open Face · TPO 연출 전략), 플러스 이미지 개발 & Visual 패션 스타일링 (바디 타입·골격·텍스쳐·체형 보완·성공 비즈니스 스타일·직업별 코디), Personal Image Make-up · Grooming, Gesture & Smart Body Language Skills (표정·제스츄어·비즈니스 자리·커뮤니케이션 전략·비즈니스 매너)."},

        // 이벤트 / 초청행사
        {style: "h2", text: "이벤트 / 초청행사 — 다수를 위한 강의식 EVENT"},
        {style: "normal", text: "단독 강의식·워크샵·고객 초청행사. 1~2h."},
        {style: "h3", text: "5 모듈"},
        {style: "normal", text: "Personal Identity Analysis (인상학·이미지메이킹·퍼스널 컬러), Style Consulting (체형 별 의상·정장·비즈니스 캐주얼·액세서리·향수), TPO 별 헤어 이미지 (오픈 페이스·얼굴형 헤어·그루밍 전략), Personal Image Make-up / Grooming, Gesture & Smart Body Language Skills."},
      ]),
    },
    highlights: [
      {ko: "맞춤형 TASTE PROGRAM"},
      {ko: "22 Type Image Scale (CMK 핵심)"},
      {ko: "Personal Color System (Best & Worst)"},
      {ko: "명품 브랜드 연구 및 선택법"},
      {ko: "Open Face — 호감도 전략"},
      {ko: "Global Manner & Body Language"},
    ],
    ctaText: {ko: "VVIP 컨설팅 문의"},
  },
  {
    _id: "service-public",
    _type: "service",
    title: {ko: "공공·관공서 이미지"},
    slug: {_type: "slug", current: "public"},
    subtitle: {ko: "공공 리더의 IMAGE BUILDING PROGRAM"},
    category: "public",
    isFeatured: true,
    order: 3,
    summary: {ko: "장·차관 미디어 트레이닝부터 국방부 국민소통 전문가단까지 — 공공 리더를 위한 IMAGE BUILDING PROGRAM."},
    body: {
      ko: blocks([
        // APPEARANCE (corporate 와 동일 콘텐츠)
        {style: "h2", text: "APPEARANCE"},
        {style: "normal", text: "매력적인 외모는 사람의 마음을 사로잡아 호감을 느끼게 합니다."},
        {style: "normal", text: "Color · 22 Type Image Scale · Wardrobe · Personal Shopping · Fashion & Style · Makeup · Hair · Aesthetics · Nail · Grooming · Modeling."},
        {style: "h3", text: "특강식 — 1~2h · 단체 세미나·워크샵"},
        {style: "normal", text: "Personal Identity Analysis (인상학·이미지메이킹·퍼스널 컬러), Style Consulting (체형 별 의상·정장·비즈니스 캐주얼·액세서리), TPO 별 헤어 이미지 (오픈 페이스·얼굴형 헤어스타일), Personal Image Make-up · Grooming."},
        {style: "h3", text: "그룹 코칭식 — 3h+ · 강의식 + 1:1 코칭 결합"},
        {style: "normal", text: "PI 추구 이미지 & 현재 이미지 분석 (Best & Worst Color System · Open Face · TPO 연출 전략), 플러스 이미지 개발 & Visual 패션 스타일링 (바디 타입·골격·텍스쳐·성공 비즈니스 스타일·직업별 코디), Personal Image Make-up · Grooming."},

        // BEHAVIOR
        {style: "h2", text: "BEHAVIOR"},
        {style: "normal", text: "매력적인 행동은 사람의 마음을 사로잡아 오랫동안 기억하게 합니다."},
        {style: "normal", text: "Etiquette · Manner · Protocol · Wellness · Nutrition & Fitness · Attitude · Life Management · Personality."},
        {style: "h3", text: "특강식 — 1~2h"},
        {style: "normal", text: "Attitude & Manners (Business Manner 자가진단·악수·명함·소개법·자세 메시지·스마트 바디 랭귀지), Gesture Skills (제스처 기능·연출·파워제스처 — 레이건·클린턴·오프라 윈프리·오바마·피해야 하는 제스처·호흡법)."},
        {style: "h3", text: "그룹 코칭식 — 3h+"},
        {style: "normal", text: "Smart Body Language Skills (몸의 언어·표정 언어·얼굴 근육훈련·시선·자세 관리), Gesture Skills, Business Manner (명함 교환·악수 연습·비즈니스 리더의 자리·성공 전략)."},

        // COMMUNICATION
        {style: "h2", text: "COMMUNICATION"},
        {style: "normal", text: "매력적인 커뮤니케이션은 사람의 마음을 사로잡아 감동하게 합니다."},
        {style: "normal", text: "Linguistics · Speech Communication · Body Language · Proxemics/Chronemics · Listening · Presentation · Public Speaking · Interpersonal · Human Relations & Networks."},
        {style: "h3", text: "특강식 — 2~3h"},
        {style: "normal", text: "Communication Skills (Style Analysis·중요성과 Point·상황에 따른 호감 Skills), Speech 트레이닝 (음성·언어습관 진단·스피치 구조·호흡과 발성·인터뷰 & 패널·언어적·비언어적 경청·Voice 강화)."},
        {style: "h3", text: "그룹 코칭식 — 3h+"},
        {style: "normal", text: "Communication Skills, Speech 트레이닝 (스피치 구조 — 오프닝·바디·클로징·기승전결·호흡법·발성법·발음법·연설전 근육훈련), Voice 트레이닝 (목소리 분석·강화·감정 발산 발성·리딩 발음 교정·품위 있는 목소리 호흡법)."},

        // 차별화 — 주요 사례 (public 만)
        {style: "h2", text: "주요 사례"},
        {style: "normal", text: "문화체육관광부 (2009·2012·2015) · 국무총리실 (2010) · 합동참모본부 (2012) · 국방부 국민소통 전문가단 (2024)."},
      ]),
    },
    highlights: [
      {ko: "장·차관 미디어 트레이닝 · 국방부 국민소통 전문가단"},
      {ko: "공공 행사·외빈 응대 매너"},
      {ko: "행정·외교 커뮤니케이션"},
      {ko: "Speech · Voice 트레이닝"},
    ],
    ctaText: {ko: "공공·관공서 출강 문의"},
  },
  {
    _id: "service-personal",
    _type: "service",
    title: {ko: "개인 이미지"},
    slug: {_type: "slug", current: "personal"},
    subtitle: {ko: "한 사람의 결을 다듬는 그룹 코칭식 진단"},
    category: "personal",
    isFeatured: false,
    order: 5,
    summary: {ko: "강의식 + 1:1 코칭 결합. 2h+. APPEARANCE · BEHAVIOR · COMMUNICATION 3축 통합 — 개인 단위 정밀 진단·코칭."},
    body: {
      ko: blocks([
        {style: "h2", text: "그룹 코칭식 — 2h+ · 강의식 + 1:1 코칭"},
        {style: "normal", text: "강의식 + 1:1 코칭식의 이상적 강의 형식. 클라이언트 요청에 따라 시간 조절."},

        {style: "h3", text: "APPEARANCE — 매력적인 외모는 호감을 느끼게 합니다"},
        {style: "normal", text: "PI 추구 이미지 & 현재 이미지 분석 (자신의 가치·Best & Worst Color · Open Face · TPO 연출 전략), 플러스 이미지 개발 & Visual 패션 스타일링 (바디 타입·골격·텍스쳐·체형 보완·비즈니스 스타일·직업별 코디), Personal Image Make-up / Grooming (m/u 연출·메이크업 제품·남성 그루밍 전략)."},

        {style: "h3", text: "BEHAVIOR — 매력적인 행동은 기억하게 합니다"},
        {style: "normal", text: "Smart Body Language Skills (몸의 언어·표정 언어·얼굴 근육훈련·시선·자세 관리), Gesture Skills (제스처 기능·연출·파워제스처 — 레이건·클린턴·오프라 윈프리·오바마·피해야 하는 제스처·호흡법), Business Manner (명함 교환·악수 연습·비즈니스 리더의 자리·성공 전략)."},

        {style: "h3", text: "COMMUNICATION — 매력적인 커뮤니케이션은 감동하게 합니다"},
        {style: "normal", text: "Communication Skills (Style Analysis·중요성과 Point·상황에 따른 호감 Skills), Speech 트레이닝 (스피치 구조 — 오프닝·바디·클로징·기승전결·호흡법·발성법·발음법·연설전 근육훈련), Voice 트레이닝 (목소리 분석·강화·감정 발산 발성·리딩 발음 교정·품위 있는 목소리 호흡법)."},
      ]),
    },
    highlights: [
      {ko: "그룹 코칭식 · 2h+ · 강의식 + 1:1 코칭"},
      {ko: "Personal Color System (Best & Worst)"},
      {ko: "22 Type Image Scale"},
      {ko: "Smart Body Language · Gesture Skills"},
      {ko: "Voice & Speech 트레이닝"},
    ],
    ctaText: {ko: "개인 컨설팅 문의"},
  },
  {
    _id: "service-media",
    _type: "service",
    title: {ko: "미디어 이미지 전략"},
    slug: {_type: "slug", current: "media"},
    subtitle: {ko: "표정과 제스츄어는 거짓말하지 않는다"},
    category: "media",
    isFeatured: true,
    order: 4,
    summary: {ko: "언론·미디어 환경 변화에 대한 이해와 효과적 홍보기법. A/B/C 순차적 프로그램. 3h+. 그룹코칭식."},
    body: {
      ko: blocks([
        {style: "h2", text: "그룹 코칭식 — 3h+ · 강의식 + 1:1 코칭"},
        {style: "normal", text: "강의식 + 1:1 코칭식의 이상적 강의 형식. 클라이언트 요청에 따라 시간 조절."},

        {style: "h3", text: "APPEARANCE — 이미지 트레이닝"},
        {style: "normal", text: "인상학과 이미지메이킹 · 이미지메이킹의 필요성 · 체형 별 의상 연출법 (정장 착장·비즈니스 캐주얼) · 액세서리·향수 선택 · 상황·직업별 맞춤 연출 · 오픈 페이스 호감도 전략 · 얼굴형 맞춤 헤어스타일 · 헤어 제품 사용법 · Personal Image Make-up / Grooming."},

        {style: "h3", text: "BEHAVIOR — Gesture & Smart Body Language Skills"},
        {style: "normal", text: "표정과 제스츄어는 거짓말하지 않는다. 사진 촬영 시 리더의 자리 · 손·눈·표정을 통한 커뮤니케이션 전략 · 인터뷰 시 사진 촬영자세."},

        {style: "h3", text: "COMMUNICATION — Speech Consulting"},
        {style: "normal", text: "스피치 분석 및 발성·호흡·발음 훈련 · 리딩·인터뷰·브리핑 스피치 훈련 · 즉흥 스피치 훈련 · 표현력 훈련 (생각 정리해서 표현하기)."},
      ]),
    },
    highlights: [
      {ko: "사진 촬영 시 리더의 자리"},
      {ko: "인터뷰 사진 촬영 자세"},
      {ko: "방송 리딩·브리핑 스피치"},
      {ko: "동아일보 채널A 24차수 진행"},
    ],
    ctaText: {ko: "미디어 트레이닝 문의"},
  },
];

// ───────────────────────── 5. academyCourse 4건 ─────────────────────────
const academyCourses = [
  {
    _id: "academy-taste-image-scale",
    _type: "academyCourse",
    title: {ko: "Taste Image Scale"},
    slug: {_type: "slug", current: "taste-image-scale"},
    level: "강사양성",
    summary: {ko: "1997 일본·2000 미국 특허 '감성 이미지 통계학' 기반. 색채학자 사토 쿠니오·히라사와 토오루. 22 Type Image Scale 활용 컨설팅 전문가 양성."},
    schedule: "일정 추후 통보",
    capacity: 5,
    certificate: {ko: "CMK Certification + 퍼스널컬러 3급 자격시험"},
    isOpen: false,
    order: 1,
    curriculum: {
      ko: blocks([
        {style: "h2", text: "테이스트 이미지 스케일 프로그램"},
        {style: "normal", text: "1997 일본 · 2000 미국 특허 「감성 이미지 통계학」 (색채학자 사토 쿠니오 · 히라사와 토오루 박사) 기반. 한국 패션 마케팅·디자인·컨설팅 영역에 도입한 CMK의 시그니처 프로그램."},
        {style: "h3", text: "교육 특전"},
        {style: "normal", text: "CMK IMAGE KOREA Certification 증서 · 퍼스널컬러 3급 자격시험 기회 · 교안·교재 제공 · 이미지 스케일 진단 프로그램 제공 · 수료 후 기업 임원진·기관 관리자급 동행실습 2회 (수료생에 한함) · 우수 수료자 CMK 파트너 컨설턴트 위촉."},
        {style: "h3", text: "강의 내용 (12 모듈)"},
        {style: "normal", text: "테이스트 이미지 스케일 개요 · 정의 · 색채 스케일 분석 · 패션 테이스트 (소재·무늬·실루엣) 선별법 · 이미지(기질) 분석 · 얼굴형 인물 스케일 분석 · 감성 카테고리 22 Type 분석 (시그니처) · 22 Type 스타일 구별 · 이미지별 꼴라쥬 작업 · 22 Type 메이크업 활용법 · 스케일에 따른 메이크업 컬러 구별법 · 각 이미지에 따른 메이크업 스킬."},
      ]),
    },
  },
  {
    _id: "academy-image-consultant",
    _type: "academyCourse",
    title: {ko: "이미지 컨설턴트 전략 과정"},
    slug: {_type: "slug", current: "image-consultant"},
    level: "강사양성",
    summary: {ko: "파트너 컨설턴트 네트워크 구축 · CMK PI 코칭 스킬 트레이닝. 연 2회 (상반기/하반기) · 5일 과정."},
    duration: "5일",
    schedule: "연 2회 (세부 일정 추후 안내)",
    capacity: 10,
    tuitionNote: {ko: "조미경 대표 직접 현장실습 10회 + 이미지 진단천 38만원 상당 제공"},
    certificate: {ko: "CMK 수료증 + 민간 자격증"},
    isOpen: false,
    order: 2,
    curriculum: {
      ko: blocks([
        {style: "h2", text: "이미지 컨설턴트 전략 과정"},
        {style: "normal", text: "이미지 컨설턴트로서의 전략 기반 CMK 아카데미 이미지 컨설턴트 트레이닝 과정. 강의식 + 1:1 코칭식의 이상적 강의 형식. 5일 과정으로 CMK의 비전과 노하우가 담겨있습니다."},
        {style: "h3", text: "교육 특전"},
        {style: "normal", text: "CMK 이미지코리아 수료증 + 민간 자격증 · 조미경 대표 직접 현장실습 10회 · 이미지 진단천 38만원 상당 제공."},

        {style: "h2", text: "1일 차 — IMAGE CONSULTING"},
        {style: "h3", text: "IMAGE CONSULTING"},
        {style: "normal", text: "Personal Identity의 개념과 중요성 · 이미지 컨설턴트의 역할과 비전 · 성공 단계 확립 · 대상에 따른 이미지메이킹 방향 설정법 · 개인별 이미지 객관적 분석 요령 · 인상학의 정의와 개념 이해 · 한국의 전통색 오방색이 얼굴에 있다 · IDENTITY 형성과 이미지의 관계 · 스타일과 이미지."},
        {style: "h3", text: "OPEN FACE / 바디 타입 진단"},
        {style: "normal", text: "새로 개발된 웹을 이용하여 진행 · 오픈 페이스의 발견 · 가르마 연출법 · 얼굴형 헤어 스타일 완성 · 헤어 제품 활용법 · 바디타입 체크시트 진단 노하우 · 페이스 골격 유형과 아이템 스타일링 · 바디 골격 유형 분석과 코디네이션 · 체형커버 프로포션 어드바이스."},

        {style: "h2", text: "2일 차 — Personal Color"},
        {style: "h3", text: "Personal Color 1"},
        {style: "normal", text: "퍼스널 컬러의 개념이해 · 사계절 컬러 이론 · Yellow base & Blue base 구분 · 색의 분류와 사계절 구분 · 사계절 색채 스타일 컬러 분석 · 퍼스널컬러 진단 분석 실습 · 컬러 드레이핑 방법 & 분석 · 4계절 개인별 실습 및 데모 · 액세서리 소품 분석."},
        {style: "h3", text: "Personal Color 2"},
        {style: "normal", text: "작성 / 피부색의 대비현상 · 퍼스널 컬러칩 구분을 통한 컬러 팔레트 완성 · Personal Color Image Map 제작 · Flow Chart / Fashion Type Board."},

        {style: "h2", text: "3일 차 — Make-up & Body Language"},
        {style: "h3", text: "Personal Color 기반의 콘티 작성 — 12톤별 메이크업"},
        {style: "normal", text: "웜톤 / 쿨톤 메이크업 · 사계절 메이크업 · 톤별 메이크업 컬러 안내 · 무결점 피부 표현 테크닉 · Best full cover foundation · 아이브로우·아이·립·치크 메이크업 · Personal Color Make-up Image Map · 남성 메이크업."},
        {style: "h3", text: "BODY LANGUAGE IMAGE & BUSINESS ATTITUDE TRAINING"},
        {style: "normal", text: "SECRETS OF BODY LANGUAGE · GUIDE TO READING · USING BODY LANGUAGE · INSTRUCTOR'S BODY LANGUAGE · DEVELOPING THE RIGHT BUSINESS ATTITUDE · ATTITUDE IN BUSINESS · BUSINESS ATTITUDE ETIQUETTE · TRAINING."},

        {style: "h2", text: "4일 차 — Body Frame Style"},
        {style: "h3", text: "남성 편 — 3 타입 (Straight · Wave · Natural)"},
        {style: "normal", text: "골격구조 이론 및 특징·분석 포인트 · 골격스타일별 어울리는 소재·원단 · 맨즈 캐주얼·비즈니스 수트 스타일링 · 유행 아이템 골격스타일별 어드바이스 · 진단 및 분석 트레이닝 · M·H·Y 라인의 특징과 아이템 선정 노하우 · 남성 바디프레임 의상·액세서리 꼴라쥬."},
        {style: "h3", text: "여성 편"},
        {style: "normal", text: "패션 코디네이트의 3대 요소 · 골격 진단과 골격스타일 · 여성 골격 진단 및 분석 · 골격스타일별 체형의 특징 · 타입별 어울리는 아이템·소재 스터디 · 어울리지 않는 아이템 프레젠테이션 · 골격 분석 체크시트 진단 노하우 · 여성 바디 골격 유형 분석과 코디네이션."},

        {style: "h2", text: "5일 차 — STYLE THE MAN / Train-the-Trainers"},
        {style: "h3", text: "STYLE THE MAN — 남성 이미지 전략"},
        {style: "normal", text: "The Natural Nature of Man (남성 스타일 특징) · The definition of Attraction (남성 매력 연구) · Style the Man (남성 스타일링) — 프로포션과 이상적 체형 실습 · 남성 스타일 유형 분석 · 비즈니스 & 캐주얼 웨어 · 남성 스타일 포트폴리오."},
        {style: "h3", text: "Train-the-Trainers — How to Teach & Coach"},
        {style: "normal", text: "성공적인 교육·코칭의 정의와 목표 수립 · How to Teach (교안 구조화·작성 방법·교육 진행 말하기·질문·답변·동기부여·강조 기법·피드백) · How to Coach (코칭의 정의·이해 · 1:1 코칭 구조 GROW 모델 — Goal > Reality > Option > Will · BI 피드백 기법 — Behaviors, Impact · 코칭과 피드백 실습)."},
      ]),
    },
  },
  {
    _id: "academy-makeup",
    _type: "academyCourse",
    title: {ko: "퍼스널 메이크업"},
    slug: {_type: "slug", current: "makeup"},
    level: "실기",
    summary: {ko: "퍼스널 이미지 메이크업 바탕. 강의식 + 1:1 코칭식. 5~10명."},
    capacity: 10,
    certificate: {ko: "CMK Certification + 퍼스널컬러 3급 자격시험"},
    isOpen: false,
    order: 3,
    curriculum: {
      ko: blocks([
        {style: "h2", text: "퍼스널 메이크업"},
        {style: "normal", text: "퍼스널 이미지 메이크업 바탕. 개인 이미지를 효과적으로 연출하는 방법을 제시하는 전문가 양성 과정."},
        {style: "h3", text: "교육 특전"},
        {style: "normal", text: "CMK IMAGE KOREA Certification 증서 · 퍼스널컬러 3급 자격시험 기회 · 교안·교재 모두 제공."},

        {style: "h2", text: "강의 내용 — 5 모듈"},
        {style: "h3", text: "Make-up & Grooming"},
        {style: "normal", text: "이상적인 얼굴이란 — 프로포션의 이해 · 색조화장의 기본 이해 · 얼굴별 메이크업 전략 · 남성 그루밍 전략 (눈썹 손질 및 표현법)."},
        {style: "h3", text: "퍼스널 컬러 메이크업"},
        {style: "normal", text: "퍼스널 컬러 진단 · 메이크업 제품의 WARM / COOL 구분 · 4계절 피부표현 및 포인트 메이크업 콘티 작성."},
        {style: "h3", text: "메이크업 실습 및 꼴라쥬 — MAKE-UP SMART STEP"},
        {style: "normal", text: "WARM MAKE UP (Warm soft pattern / Warm hard pattern) · COOL MAKE UP (Cool soft pattern / Cool hard pattern) · 2D 가 아닌 3D 메이크업의 테크닉과 노하우."},
        {style: "h3", text: "테마별 메이크업 실습"},
        {style: "normal", text: "테마별 실습."},
        {style: "h3", text: "미디어 여성·남성 메이크업 연출"},
        {style: "normal", text: "미디어 노출 시 여성·남성 메이크업 콘티와 실습을 통한 분석."},
      ]),
    },
  },
  {
    _id: "academy-personal-color",
    _type: "academyCourse",
    title: {ko: "퍼스널 컬러 진단 과정"},
    slug: {_type: "slug", current: "personal-color"},
    level: "실기",
    summary: {ko: "강의식 + 1:1 코칭식. 3~5일. 5~10명."},
    duration: "3~5일",
    capacity: 10,
    certificate: {ko: "CMK Certification + 퍼스널컬러 3급 자격시험"},
    isOpen: false,
    order: 4,
    curriculum: {
      ko: blocks([
        {style: "h2", text: "퍼스널 컬러 진단 과정"},
        {style: "normal", text: "개인의 이미지를 효과적으로 연출하기 위한 색조 진단 등 자기 진단을 종합하는 전문가 양성 과정."},
        {style: "h3", text: "교육 특전"},
        {style: "normal", text: "CMK IMAGE KOREA Certification 증서 · 퍼스널컬러 3급 자격시험 기회 · 교안·교재 모두 제공."},

        {style: "h2", text: "강의 내용 (13 모듈)"},
        {style: "normal", text: "퍼스널 컬러 개요 · 퍼스널 컬러의 역사 및 장단점 · 색의 기초이론 · PCCS 톤의 이해 및 실습 · 웜/쿨 컬러의 이해 및 구별방법 · 웜/쿨 컬러를 활용한 배색 실습 및 이미지 맵 작업 · 사계절 컬러의 이해 및 구별방법 · 사계절 컬러를 활용한 배색 실습 및 이미지 맵 작업 · 피부색 조색 실습 · 퍼스널 컬러 진단 및 드레이핑 스킬 훈련 · 퍼스널 컬러 코디네이션 · 퍼스널 이미지 메이크업 및 헤어 · 퍼스널 컬러 진단 테스트 및 포트폴리오 발표."},
      ]),
    },
  },
];

// ───────────────────────── 6. post — media-data.json + news-data.json 자동 시드 (v1.3.16) ─────────────────────────
// 기존 mnd-2024 / mk-2013 / ytn-2013 / channela-2016 = news-data.json 으로 통합 (중복 제거 위해).
const postExcerpt = (text: string) => ({ko: text});

const posts: any[] = [];

// ───────────────────────── 6-Media. 65 강의·미디어 = media-data.json 자동 시드 (v1.3.16) ─────────────────────────
// 영상 파일 호스팅 = apps/web/public/videos/ (정적 host). PostCard 클릭 → /community/[slug] → <video controls> embed.
// 사용자 결정: 65 mp4 (572MB) GitHub 포함 → Cafe24 FTP 정적 배포 시 함께 업로드.
const mediaDataPath = path.join(__dirname, "media-data.json");
const mediaData = JSON.parse(stripBom(fs.readFileSync(mediaDataPath, "utf-8"))) as Array<{
  slug: string;
  publishedAt: string;
  title: string;
  videoUrl: string;
}>;
const mediaPosts = mediaData.map((m) => ({
  _id: `post-${m.slug}`,
  _type: "post",
  title: {ko: m.title},
  slug: {_type: "slug", current: m.slug},
  category: "강의·미디어",
  publishedAt: m.publishedAt ? `${m.publishedAt}T00:00:00Z` : undefined,
  videoUrl: m.videoUrl,
  isPinned: false,
}));
posts.push(...mediaPosts);

// ───────────────────────── 6-News. 89 뉴스 = news-data.json 자동 시드 (v1.3.16) ─────────────────────────
// 사용자 캡처 9 페이지 OCR. category = "뉴스". 본문·발췌·외부 URL 은 추후 Studio 에서 보강.
const newsDataPath = path.join(__dirname, "news-data.json");
const newsData = JSON.parse(stripBom(fs.readFileSync(newsDataPath, "utf-8"))) as Array<{
  slug: string;
  publishedAt: string;
  title: string;
}>;
// 뉴스 본문 이미지 자동 매핑 — apps/web/public/images/news/<slug>-<n>.png 패턴 스캔.
const newsImagesDir = path.join(__dirname, "..", "..", "web", "public", "images", "news");
const newsImagesFromDisk: Record<string, string[]> = {};
if (fs.existsSync(newsImagesDir)) {
  for (const f of fs.readdirSync(newsImagesDir)) {
    const m = f.match(/^(news-\d{3})-(\d+)\.(png|jpg|jpeg|webp)$/i);
    if (m) {
      const slug = m[1];
      const idx = parseInt(m[2], 10);
      (newsImagesFromDisk[slug] ??= [])[idx - 1] = `/images/news/${f}`;
    }
  }
  for (const slug of Object.keys(newsImagesFromDisk)) {
    newsImagesFromDisk[slug] = newsImagesFromDisk[slug].filter(Boolean);
  }
}

// 뉴스 HTML 본문 자동 매핑 — apps/studio/scripts/news-html/<slug>.html 스캔.
// 전체 페이지 (Ctrl+S 저장) 도 OK — 자동으로 head/nav/header/footer/script/style 제거.
const newsHtmlDir = path.join(__dirname, "news-html");
const newsHtmlFromDisk: Record<string, string> = {};

function extractArticleBody(raw: string): string {
  let html = raw;

  // 1. cmk-specific: board_view 의 본문 td (no_left_bo colspan=2) 우선.
  //    이게 cmk 의 실제 본문 영역. 메타·이전다음글·목록버튼 다 제외됨.
  //    종료 패턴 = board_view 의 닫는 </tbody></table> 까지 (본문 내부 중첩 </td></tr> 회피).
  const cmkBodyMatch = raw.match(/<td[^>]*class="[^"]*no_left_bo[^"]*"[^>]*colspan=["']?2["']?[^>]*>([\s\S]*?)<\/td>\s*<\/tr>\s*<\/tbody>\s*<\/table>/i);
  if (cmkBodyMatch) {
    html = cmkBodyMatch[1];
  } else {
    // 2. generic fallback: <body> → <article> → 본문 컨테이너
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) html = bodyMatch[1];
    const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
    if (articleMatch) {
      html = articleMatch[0];
    } else {
      const idMatch = html.match(/<div[^>]*id=["'](?:content|board_content|article_content|bbsContent)["'][\s\S]*?<\/div>/i);
      if (idMatch) html = idMatch[0];
    }
  }

  // 3. chrome 제거 (script·style·nav·header·footer·link·meta)
  //    iframe 은 영상 embed (YouTube/Vimeo/네이버TV/카카오) 만 보존 — 그 외 (광고·내비) 제거.
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<iframe([^>]*)>[\s\S]*?<\/iframe>/gi, (_match, attrs) => {
      const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
      if (srcMatch && /youtube\.com|youtu\.be|vimeo\.com|naver\.com|navertv|kakaocdn|kakaotv|dailymotion|player/i.test(srcMatch[1])) {
        return `<iframe${attrs}></iframe>`;
      }
      return "";
    })
    .replace(/<link[^>]*>/gi, "")
    .replace(/<meta[^>]*>/gi, "");

  // 4. 빈 spacing table 제거 (cmk 의 td height=0 / height=5 같은 더미 행)
  html = html
    .replace(/<table[^>]*>\s*<tbody[^>]*>\s*<tr[^>]*>\s*<td[^>]*height=["']?\d+["']?[^>]*>\s*<\/td>\s*<\/tr>\s*<\/tbody>\s*<\/table>/gi, "")
    .replace(/<td[^>]*height=["']?\d+["']?[^>]*>\s*<\/td>/gi, "");

  // 5. <font> → 일반 텍스트 (font tag 자체 제거, 내용 보존)
  html = html
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "");

  // 6. 모든 inline HTML 속성 제거 — Tailwind 와 충돌 회피 + 매거진 톤 정리
  //    src·href·alt 는 보존 (이미지·링크 핵심).
  html = html.replace(
    /\s(class|style|onclick|onerror|onload|onmouseover|onmouseout|onfocus|onblur|width|height|cellpadding|cellspacing|border|bgcolor|align|valign|id|name|target|title|colspan|rowspan)=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
    "",
  );

  // 7. DCM 주석 + 빈 span 제거 (cmk 의 SEO 강조 잔재)
  html = html
    .replace(/<!--DCM_[^>]*-->/gi, "")
    .replace(/<!--\/DCM_[^>]*-->/gi, "")
    .replace(/<span>\s*<\/span>/gi, "")
    // 연속 br 정리 (3개+ → 2개)
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
    .trim();

  return html;
}

// _files 폴더 자동 복사 + img src 재작성.
// 사용자 워크플로: Ctrl+S "웹페이지, 완료" → news-001.html + news-001_files/ 폴더 함께 둠.
// seed.ts: _files 폴더 → apps/web/public/news-files/<slug>/ 복사 + HTML 의 src 자동 치환.
function copyDirRecursive(src: string, dst: string): void {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(newsHtmlDir)) {
  for (const f of fs.readdirSync(newsHtmlDir)) {
    // news-001.html / news-001-01.html / news-001-1.html 모두 허용 (suffix optional)
    const m = f.match(/^(news-\d{3})(?:-\d+)?\.html?$/i);
    if (m) {
      const slug = m[1];
      const raw = stripBom(fs.readFileSync(path.join(newsHtmlDir, f), "utf-8"));

      // _files 폴더가 있으면 정적 host 로 복사 (4 가지 변형 모두 인식)
      const baseNoExt = f.replace(/\.html?$/i, "");
      const candidates = [
        path.join(newsHtmlDir, `${slug}_files`),
        path.join(newsHtmlDir, `${slug}.html_files`),
        path.join(newsHtmlDir, `${f}_files`),
        path.join(newsHtmlDir, `${baseNoExt}_files`),
      ];
      const filesDir = candidates.find(fs.existsSync);
      if (filesDir) {
        const dstDir = path.join(__dirname, "..", "..", "web", "public", "news-files", slug);
        copyDirRecursive(filesDir, dstDir);
      }

      // 본문 추출 + img/링크 경로 재작성
      let html = extractArticleBody(raw);
      const folderName = filesDir ? path.basename(filesDir) : `${slug}_files`;
      // src="<anything>/folderName/foo.jpg" 또는 src="folderName/foo.jpg" → /news-files/<slug>/foo.jpg
      const escapedFolder = folderName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const srcPattern = new RegExp(`(src|href)="[^"]*?${escapedFolder}\\/([^"]+)"`, "g");
      html = html.replace(srcPattern, `$1="/news-files/${slug}/$2"`);

      newsHtmlFromDisk[slug] = html;
    }
  }
}

// 별표 4 공지 (news-086 ~ 089) = isPinned: true. 기존 cmk 홈페이지의 '+' 식 상단 고정.
const PINNED_SLUGS = new Set(["news-086", "news-087", "news-088", "news-089"]);

const newsPosts = newsData.map((n) => ({
  _id: `post-${n.slug}`,
  _type: "post",
  title: {ko: n.title},
  slug: {_type: "slug", current: n.slug},
  category: "뉴스",
  publishedAt: n.publishedAt ? `${n.publishedAt}T00:00:00Z` : undefined,
  isPinned: PINNED_SLUGS.has(n.slug),
  ...(newsImagesFromDisk[n.slug]?.length ? { bodyImages: newsImagesFromDisk[n.slug] } : {}),
  ...(newsHtmlFromDisk[n.slug] ? { htmlBody: newsHtmlFromDisk[n.slug] } : {}),
}));
posts.push(...newsPosts);

// ───────────────────────── 6-A. clientLogo (audit §2-4 + 스크린샷 클라이언트1~5 정리, v1.3.15) ─────────────────────────
// 사용자 결정: 카테고리별 12개 = 총 48건. 4 카테고리 (공공·관공서 / 럭셔리·대기업 / 금융 / 학교).
// LogoWall.astro 4 섹션 분기 그루핑. logo 없이 텍스트만 (정식 로고는 §9-2 #7 컨펌 후 교체).
// v1.3.14 의 client-donga 는 consentGiven=false 로 LogoWall 미노출 (데이터는 보존).
const clientLogos = [
  // 공공·관공서 (12)
  { _id: "client-mctd",        _type: "clientLogo", name: "문화체육관광부",       industry: "공공·관공서", consentGiven: true, order: 101 },
  { _id: "client-mnd",         _type: "clientLogo", name: "국방부",               industry: "공공·관공서", consentGiven: true, order: 102 },
  { _id: "client-pmo",         _type: "clientLogo", name: "국무총리실",           industry: "공공·관공서", consentGiven: true, order: 103 },
  { _id: "client-moj",         _type: "clientLogo", name: "법무부",               industry: "공공·관공서", consentGiven: true, order: 104 },
  { _id: "client-jcs",         _type: "clientLogo", name: "합동참모본부",         industry: "공공·관공서", consentGiven: true, order: 105 },
  { _id: "client-kp",          _type: "clientLogo", name: "경찰청",               industry: "공공·관공서", consentGiven: true, order: 106 },
  { _id: "client-nis",         _type: "clientLogo", name: "국가정보원",           industry: "공공·관공서", consentGiven: true, order: 107 },
  { _id: "client-prosecution", _type: "clientLogo", name: "검찰청",               industry: "공공·관공서", consentGiven: true, order: 108 },
  { _id: "client-motie",       _type: "clientLogo", name: "산업통상자원부",       industry: "공공·관공서", consentGiven: true, order: 109 },
  { _id: "client-kostat",      _type: "clientLogo", name: "통계청",               industry: "공공·관공서", consentGiven: true, order: 110 },
  { _id: "client-mogef",       _type: "clientLogo", name: "여성가족부",           industry: "공공·관공서", consentGiven: true, order: 111 },
  { _id: "client-kwdi",        _type: "clientLogo", name: "한국여성정책연구원",   industry: "공공·관공서", consentGiven: true, order: 112 },

  // 럭셔리·대기업 (12) — 럭셔리 6 (글로벌) + 대기업 6
  { _id: "client-lv",          _type: "clientLogo", name: "Louis Vuitton",       industry: "글로벌", consentGiven: true, order: 201 },
  { _id: "client-lvmh",        _type: "clientLogo", name: "LVMH",                industry: "글로벌", consentGiven: true, order: 202 },
  { _id: "client-dior",        _type: "clientLogo", name: "Christian Dior",      industry: "글로벌", consentGiven: true, order: 203 },
  { _id: "client-gucci",       _type: "clientLogo", name: "Gucci",               industry: "글로벌", consentGiven: true, order: 204 },
  { _id: "client-guerlain",    _type: "clientLogo", name: "Guerlain",            industry: "글로벌", consentGiven: true, order: 205 },
  { _id: "client-marc",        _type: "clientLogo", name: "Marc Jacobs",         industry: "글로벌", consentGiven: true, order: 206 },
  { _id: "client-samsung",     _type: "clientLogo", name: "삼성전자",             industry: "대기업", consentGiven: true, order: 207 },
  { _id: "client-hyundai",     _type: "clientLogo", name: "현대자동차",           industry: "대기업", consentGiven: true, order: 208 },
  { _id: "client-sk",          _type: "clientLogo", name: "SK",                   industry: "대기업", consentGiven: true, order: 209 },
  { _id: "client-kt",          _type: "clientLogo", name: "KT",                   industry: "대기업", consentGiven: true, order: 210 },
  { _id: "client-lotte",       _type: "clientLogo", name: "롯데",                 industry: "대기업", consentGiven: true, order: 211 },
  { _id: "client-amorepacific",_type: "clientLogo", name: "아모레퍼시픽",         industry: "대기업", consentGiven: true, order: 212 },

  // 금융 (12)
  { _id: "client-samsung-life",_type: "clientLogo", name: "삼성생명",             industry: "금융", consentGiven: true, order: 301 },
  { _id: "client-shinhan-life",_type: "clientLogo", name: "신한생명",             industry: "금융", consentGiven: true, order: 302 },
  { _id: "client-hana",        _type: "clientLogo", name: "하나은행",             industry: "금융", consentGiven: true, order: 303 },
  { _id: "client-keb",         _type: "clientLogo", name: "KEB외환은행",          industry: "금융", consentGiven: true, order: 304 },
  { _id: "client-nh",          _type: "clientLogo", name: "NH농협",               industry: "금융", consentGiven: true, order: 305 },
  { _id: "client-miraeasset",  _type: "clientLogo", name: "미래에셋",             industry: "금융", consentGiven: true, order: 306 },
  { _id: "client-kdb",         _type: "clientLogo", name: "KDB생명",              industry: "금융", consentGiven: true, order: 307 },
  { _id: "client-ibk",         _type: "clientLogo", name: "IBK기업은행",          industry: "금융", consentGiven: true, order: 308 },
  { _id: "client-prudential",  _type: "clientLogo", name: "Prudential",          industry: "금융", consentGiven: true, order: 309 },
  { _id: "client-meritz",      _type: "clientLogo", name: "MERITZ화재",           industry: "금융", consentGiven: true, order: 310 },
  { _id: "client-tongyang",    _type: "clientLogo", name: "동양생명",             industry: "금융", consentGiven: true, order: 311 },
  { _id: "client-lig",         _type: "clientLogo", name: "LIG손해보험",          industry: "금융", consentGiven: true, order: 312 },

  // 학교 (12)
  { _id: "client-korea-u",     _type: "clientLogo", name: "고려대학교",           industry: "학교", consentGiven: true, order: 401 },
  { _id: "client-yonsei-u",    _type: "clientLogo", name: "연세대학교",           industry: "학교", consentGiven: true, order: 402 },
  { _id: "client-ewha",        _type: "clientLogo", name: "이화여자대학교",       industry: "학교", consentGiven: true, order: 403 },
  { _id: "client-skku",        _type: "clientLogo", name: "성균관대학교",         industry: "학교", consentGiven: true, order: 404 },
  { _id: "client-cau",         _type: "clientLogo", name: "중앙대학교",           industry: "학교", consentGiven: true, order: 405 },
  { _id: "client-hanyang",     _type: "clientLogo", name: "한양대학교",           industry: "학교", consentGiven: true, order: 406 },
  { _id: "client-hufs",        _type: "clientLogo", name: "한국외국어대학교",     industry: "학교", consentGiven: true, order: 407 },
  { _id: "client-sookmyung",   _type: "clientLogo", name: "숙명여자대학교",       industry: "학교", consentGiven: true, order: 408 },
  { _id: "client-kookmin",     _type: "clientLogo", name: "국민대학교",           industry: "학교", consentGiven: true, order: 409 },
  { _id: "client-dongguk",     _type: "clientLogo", name: "동국대학교",           industry: "학교", consentGiven: true, order: 410 },
  { _id: "client-kwangwoon",   _type: "clientLogo", name: "광운대학교",           industry: "학교", consentGiven: true, order: 411 },
  { _id: "client-myongji",     _type: "clientLogo", name: "명지대학교",           industry: "학교", consentGiven: true, order: 412 },

  // v1.3.14 잔재 — 데이터 보존하되 LogoWall 미노출 (consentGiven=false)
  { _id: "client-donga",       _type: "clientLogo", name: "동아일보·채널A",       industry: "대기업", consentGiven: false, order: 999 },
];

// ───────────────────────── 7. page — 약관 2건 (v1.3.16 docs/legal/ 초안 자동 시드) ─────────────────────────
// docs/legal/개인정보처리방침_초안.md + 이용약관_초안.md → PortableText 변환 시드.
// 초안 안내 라인 ("Claude AI 작성") 자동 제거. 법무 검토 후 Studio 에서 수정 가능.
function markdownToPortableText(md: string): any[] {
  const blocks: any[] = [];
  const lines = stripBom(md).split(/\r?\n/);
  let blockIdx = 0;
  const mkSpan = (text: string) => ({ _type: "span", _key: `s-${blockIdx++}`, text });
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    // 초안 안내 (인용·메타) 제거
    if (/^>\s*\*\*초안 안내/.test(rawLine) || /^>\s*`\[클라이언트 확인/.test(rawLine) || /^>\s*확정 본문은/.test(rawLine)) continue;
    if (/^>\s*$/.test(rawLine)) continue;
    // 구분선
    if (/^---+$/.test(line)) continue;
    // h1 = 페이지 제목 (별도 필드라 skip)
    if (/^#\s/.test(line)) continue;
    // h2 (## 제목)
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      blocks.push({ _type: "block", _key: `b-${blockIdx++}`, style: "h2", children: [mkSpan(h2[1])] });
      continue;
    }
    // h3 (### 제목)
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      blocks.push({ _type: "block", _key: `b-${blockIdx++}`, style: "h3", children: [mkSpan(h3[1])] });
      continue;
    }
    // 순서 list (1. / 2.)
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      blocks.push({ _type: "block", _key: `b-${blockIdx++}`, style: "normal", listItem: "number", level: 1, children: [mkSpan(ol[1].replace(/\*\*/g, ""))] });
      continue;
    }
    // 무순서 list (- 항목)
    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      blocks.push({ _type: "block", _key: `b-${blockIdx++}`, style: "normal", listItem: "bullet", level: 1, children: [mkSpan(ul[1].replace(/\*\*/g, ""))] });
      continue;
    }
    // 일반 paragraph (**bold** 마크다운 제거)
    blocks.push({ _type: "block", _key: `b-${blockIdx++}`, style: "normal", children: [mkSpan(line.replace(/\*\*/g, ""))] });
  }
  return blocks;
}

function legalBodyFromMd(filename: string): any[] {
  const p = path.join(__dirname, "..", "..", "..", "docs", "legal", filename);
  if (!fs.existsSync(p)) {
    return blocks([{ style: "normal", text: "(준비 중) 법무 검토 후 본문 등록 예정." }]);
  }
  return markdownToPortableText(fs.readFileSync(p, "utf-8"));
}

const pages = [
  {
    _id: "page-privacy",
    _type: "page",
    title: {ko: "개인정보처리방침"},
    slug: {_type: "slug", current: "privacy"},
    effectiveDate: "2026-06-01",
    version: "1.0",
    body: {ko: legalBodyFromMd("개인정보처리방침_초안.md")},
  },
  {
    _id: "page-terms",
    _type: "page",
    title: {ko: "이용약관"},
    slug: {_type: "slug", current: "terms"},
    effectiveDate: "2026-06-01",
    version: "1.0",
    body: {ko: legalBodyFromMd("이용약관_초안.md")},
  },
];

// ───────────────────────── 실행 ─────────────────────────
async function run() {
  const allDocs: Array<{_id: string; _type: string; [k: string]: unknown}> = [
    siteSettings,
    ceoPerson,
    ...teachers,
    ...stats,
    ...services,
    ...academyCourses,
    ...posts,
    ...clientLogos,
    ...pages,
  ];

  console.log(`Seeding ${allDocs.length} documents to Sanity…`);

  for (const doc of allDocs) {
    try {
      const res = await client.createOrReplace(doc);
      console.log(`  ✓ ${doc._type.padEnd(16)} ${res._id}`);
    } catch (err) {
      console.error(`  ✗ ${doc._type.padEnd(16)} ${doc._id} — ${(err as Error).message}`);
    }
  }

  console.log("Done. http://localhost:4321 에서 결과 확인.");
  console.log("");
  console.log("⚠️ 다음 항목은 시드 안 됨 (별도 단계):");
  console.log("  - labArticle (콘텐츠 미정)");
  console.log("  - 약관 page 본문 (법무 검토 후 Studio 수동 — docs/legal/Studio_약관등록_가이드.md)");
  console.log("  - CEO image (클라이언트 제공 후 Studio 수동 업로드)");
  console.log("  - service heroImage (클라이언트 제공 후 Studio 수동 업로드)");
  console.log("  - 강사진 이미지·약력 (클라이언트 자료 입수 후 Studio 업로드 / 약력 입력)");
  console.log("");
  console.log("ℹ️ clientLogo·강사진 person 은 v1.3.15 임시 시드 (디자인 검수용).");
  console.log("    정식 명단·로고·동의는 §9-2 #7 클라이언트 컨펌 후 Studio 에서 교체.");
  console.log("    강사진 사진·약력·이지연 동명이인 정식 표기 등은 클라이언트 컨펌 후 Studio 갱신.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
