// Sanity 데이터 타입 정의 — §4 스키마와 1:1 매핑.
// 클로드B Phase 2 메모 #1 반영 — 외부 dep 없이 자체 정의.

// ───────────────────────────────────────────────────────────
// 공통 primitives
// ───────────────────────────────────────────────────────────

export interface SanityReference {
  _ref: string;
  _type: "reference";
}

export interface SanityImageAsset extends SanityReference {}

export interface SanityImage {
  _type?: "image";
  asset: SanityImageAsset;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  caption?: string;
}

export interface Slug {
  _type: "slug";
  current: string;
}

// Portable Text — body / curriculum / bio 등에 사용
export interface PortableTextSpan {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: string; // "block" | "image" | ...
  _key?: string;
  children?: PortableTextSpan[];
  markDefs?: Array<{ _key: string; _type: string; [k: string]: unknown }>;
  style?: string;
  listItem?: string;
  level?: number;
  // image 인라인 등 다른 _type일 때 추가 필드는 unknown으로 허용
  [k: string]: unknown;
}

// ───────────────────────────────────────────────────────────
// i18n helpers (§4.2)
// ───────────────────────────────────────────────────────────

// 1차 오픈은 KO only. 추후 다국어 확장 시 각 인터페이스에 `en?: ...` 1줄 추가.
export interface LocaleString {
  ko: string;
}

export interface LocaleText {
  ko: string;
}

export interface LocaleBlockContent {
  ko: PortableTextBlock[];
}

export interface Seo {
  metaTitle?: LocaleString;
  metaDescription?: LocaleText;
  ogImage?: SanityImage;
  noIndex?: boolean;
}

// ───────────────────────────────────────────────────────────
// Document types (§4.3)
// ───────────────────────────────────────────────────────────

export interface SiteSettings {
  _id: "siteSettings";
  _type: "siteSettings";
  companyName?: LocaleString;
  tagline?: LocaleString;
  phone?: string;
  email?: string;
  address?: LocaleString;
  kakaoChannel?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  naverBlog?: string;
  businessNo?: string;
  ceo?: string;
  defaultOg?: SanityImage;
}

export type ServiceCategory = "corporate" | "executive" | "public" | "media" | "personal";

export interface Service {
  _id: string;
  _type: "service";
  title: LocaleString;
  slug: Slug;
  subtitle?: LocaleString;
  category: ServiceCategory;
  isFeatured?: boolean;
  heroImage?: SanityImage;
  summary?: LocaleText;
  body?: LocaleBlockContent;
  highlights?: LocaleString[];
  ctaText?: LocaleString;
  order?: number;
  seo?: Seo;
}

export type AcademyLevel = "기초/입문" | "심화" | "실기" | "강사양성";

export interface AcademyCourse {
  _id: string;
  _type: "academyCourse";
  title: LocaleString;
  slug: Slug;
  level?: AcademyLevel;
  summary?: LocaleText;
  curriculum?: LocaleBlockContent;
  duration?: string;
  schedule?: string;
  tuition?: number;
  tuitionNote?: LocaleString;
  capacity?: number;
  instructor?: Person | SanityReference;
  certificate?: LocaleString;
  isOpen?: boolean;
  order?: number;
}

export type PostCategory = "강의·미디어" | "뉴스";

export interface Post {
  _id: string;
  _type: "post";
  title: LocaleString;
  slug: Slug;
  category?: PostCategory;
  coverImage?: SanityImage;
  excerpt?: LocaleText;
  body?: LocaleBlockContent;
  publishedAt?: string;
  externalUrl?: string;
  videoUrl?: string;
  bodyImages?: string[];
  htmlBody?: string;
  isPinned?: boolean;
}

export type LabField = "퍼스널컬러" | "스타일" | "골격" | "헤어" | "기타";

export interface LabArticle {
  _id: string;
  _type: "labArticle";
  title: LocaleString;
  slug: Slug;
  field?: LabField;
  coverImage?: SanityImage;
  author?: Person | SanityReference;
  excerpt?: LocaleText;
  body?: LocaleBlockContent;
  publishedAt?: string;
}

export type PersonRole = "대표" | "수석 강사" | "강사" | "파트너 컨설턴트";

export type PersonAxis = "appearance" | "behavior" | "communication";

export interface Person {
  _id: string;
  _type: "person";
  name: LocaleString;
  nameEn?: string;
  title?: LocaleString;
  role?: PersonRole;
  image?: SanityImage;
  /** v1.3.16 — 사용자 제공 정적 사진 경로 (Sanity image 없을 때 fallback). */
  imagePath?: string;
  bio?: LocaleBlockContent;
  credentials?: LocaleString[];
  isCeo?: boolean;
  axes?: PersonAxis[];
  order?: number;
}

export type ClientIndustry =
  | "대기업"
  | "금융"
  | "공공·관공서"
  | "글로벌"
  | "스타트업"
  | "학교"
  | "기타";

export interface ClientLogo {
  _id: string;
  _type: "clientLogo";
  name: string;
  logo?: SanityImage;
  industry?: ClientIndustry;
  consentGiven?: boolean;
  order?: number;
}

export interface Stat {
  _id: string;
  _type: "stat";
  label: LocaleString;
  value: number;
  suffix?: string;
  order?: number;
}

export type InquiryKind = "personal" | "corporate" | "academy";
export type InquiryStatus = "new" | "contacted" | "closed";

export interface ContactInquiry {
  _id: string;
  _type: "contactInquiry";
  kind: InquiryKind;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  position?: string;
  expectedCount?: number;
  topic?: string;
  schedule?: string;
  budgetRange?: string;
  interest?: string;
  preferredCourse?: string;
  message?: string;
  submittedAt?: string;
  status?: InquiryStatus;
  source?: string;
}

export interface Page {
  _id: string;
  _type: "page";
  title: LocaleString;
  slug: Slug;
  effectiveDate?: string; // YYYY-MM-DD — 약관·방침 시행일
  version?: string;       // 개정 버전 표기 (예: "1.0")
  body?: LocaleBlockContent;
  seo?: Seo;
}

// ───────────────────────────────────────────────────────────
// 로케일 헬퍼 — 1차 오픈 KO only.
// 추후 다국어 확장 시 lang 파라미터 + 분기 추가.
// ───────────────────────────────────────────────────────────

export function pickLocale(
  field: LocaleString | LocaleText | undefined
): string {
  return field?.ko ?? "";
}
