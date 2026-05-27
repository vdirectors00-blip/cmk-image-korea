// GROQ 쿼리 모음.
// 사용 예:
//   import { sanityClient } from "@/lib/sanity";
//   import { servicesFeaturedQuery } from "@/lib/queries";
//   const services = await sanityClient.fetch<Service[]>(servicesFeaturedQuery);

import { groq } from "@/lib/groq";

// ─────────────────────────────────────────────────
// SITE SETTINGS (싱글톤)
// ─────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    companyName, tagline, phone, email, address,
    kakaoChannel, instagram, youtube, facebook, naverBlog,
    businessNo, ceo,
    defaultOg
  }
`;

// ─────────────────────────────────────────────────
// SERVICE (컨설팅 영역)
// ─────────────────────────────────────────────────

// HOME 시그니처 4카드 — featured 우선, order 정렬
export const servicesAllQuery = groq`
  *[_type == "service"] | order(isFeatured desc, order asc){
    _id, title, slug, subtitle, category, isFeatured,
    heroImage, summary, ctaText, order
  }
`;

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0]{
    _id, title, slug, subtitle, category, isFeatured,
    heroImage, summary, body, highlights, ctaText, order, seo
  }
`;

export const serviceSlugsQuery = groq`
  *[_type == "service" && defined(slug.current)].slug.current
`;

// ─────────────────────────────────────────────────
// ACADEMY COURSE
// ─────────────────────────────────────────────────
export const academyCoursesAllQuery = groq`
  *[_type == "academyCourse"] | order(order asc){
    _id, title, slug, level, summary, duration,
    schedule, tuition, capacity, isOpen, order
  }
`;

export const academyCourseBySlugQuery = groq`
  *[_type == "academyCourse" && slug.current == $slug][0]{
    _id, title, slug, level, summary, curriculum,
    duration, schedule, tuition, tuitionNote, capacity,
    instructor->{_id, name, nameEn, title, image, bio},
    certificate, isOpen
  }
`;

export const academyCourseSlugsQuery = groq`
  *[_type == "academyCourse" && defined(slug.current)].slug.current
`;

// ─────────────────────────────────────────────────
// POST (CMK NEWS)
// ─────────────────────────────────────────────────
export const postsAllQuery = groq`
  *[_type == "post"] | order(coalesce(isPinned, false) desc, publishedAt desc){
    _id, title, slug, category, coverImage, excerpt,
    publishedAt, externalUrl, videoUrl, isPinned
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category] | order(coalesce(isPinned, false) desc, publishedAt desc){
    _id, title, slug, category, coverImage, excerpt,
    publishedAt, externalUrl, videoUrl, isPinned
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id, title, slug, category, coverImage, excerpt,
    body, publishedAt, externalUrl, videoUrl, bodyImages, htmlBody, isPinned
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

// ─────────────────────────────────────────────────
// LAB ARTICLE
// ─────────────────────────────────────────────────
export const labArticlesAllQuery = groq`
  *[_type == "labArticle"] | order(publishedAt desc){
    _id, title, slug, field, coverImage, excerpt,
    author->{_id, name, nameEn},
    publishedAt
  }
`;

export const labArticleBySlugQuery = groq`
  *[_type == "labArticle" && slug.current == $slug][0]{
    _id, title, slug, field, coverImage, excerpt, body,
    author->{_id, name, nameEn, image, bio},
    publishedAt
  }
`;

// IMAGE LAB 메뉴 노출 여부 판단 (§6.5)
export const labArticleCountQuery = groq`
  count(*[_type == "labArticle"])
`;

// ─────────────────────────────────────────────────
// PERSON (CEO·강사진)
// ─────────────────────────────────────────────────

// HOME / ABOUT 의 CEO 단독
export const ceoQuery = groq`
  *[_type == "person" && isCeo == true] | order(order asc)[0]{
    _id, name, nameEn, title, role, image, imagePath, bio, credentials
  }
`;

// ABOUT PEOPLE 그리드 (대표 제외)
export const peopleQuery = groq`
  *[_type == "person" && (isCeo != true)] | order(order asc){
    _id, name, nameEn, title, role, image, imagePath, axes
  }
`;

// PEOPLE 개별 페이지
export const personByIdQuery = groq`
  *[_type == "person" && _id == $id][0]{
    _id, name, nameEn, title, role, image, imagePath, bio, credentials, axes, isCeo
  }
`;

export const personIdsQuery = groq`
  *[_type == "person" && (isCeo != true) && defined(_id)]._id
`;

// ─────────────────────────────────────────────────
// CLIENT LOGO (거래 기업)
// ─────────────────────────────────────────────────
// ⚠️ consentGiven == true 만 노출 (§13.3 #8)
export const clientLogosQuery = groq`
  *[_type == "clientLogo" && consentGiven == true] | order(order asc){
    _id, name, logo, industry, order
  }
`;

// ─────────────────────────────────────────────────
// STAT (누적 수치)
// ─────────────────────────────────────────────────
export const statsQuery = groq`
  *[_type == "stat"] | order(order asc){
    _id, label, value, suffix, order
  }
`;

// ─────────────────────────────────────────────────
// PAGE (privacy / terms 등)
// ─────────────────────────────────────────────────
export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    _id, title, slug, effectiveDate, version, body, seo
  }
`;
