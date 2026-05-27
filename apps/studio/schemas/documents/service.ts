import { defineType } from "sanity";

// §4.3.2 — 컨설팅 영역
export default defineType({
  name: "service",
  title: "컨설팅 영역",
  type: "document",
  fields: [
    { name: "title", type: "localeString", title: "서비스명" },
    {
      name: "slug",
      type: "slug",
      title: "Slug",
      options: {
        source: (doc: any) => doc?.title?.ko ?? "",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    { name: "subtitle", type: "localeString", title: "부제" },
    {
      name: "category",
      type: "string",
      title: "카테고리",
      options: {
        list: [
          { title: "기업 출강", value: "corporate" },
          { title: "임원 PI", value: "executive" },
          { title: "기관·공공", value: "public" },
          { title: "미디어", value: "media" },
          { title: "개인 이미지", value: "personal" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "isFeatured",
      type: "boolean",
      title: "메인 강조 (FEATURED)",
      initialValue: false,
    },
    {
      name: "heroImage",
      type: "image",
      title: "히어로 이미지",
      options: { hotspot: true },
    },
    { name: "summary", type: "localeText", title: "요약 (카드용, 2~3줄)" },
    { name: "body", type: "localeBlockContent", title: "본문" },
    {
      name: "highlights",
      type: "array",
      of: [{ type: "localeString" }],
      title: "핵심 포인트 (3~5개)",
    },
    { name: "ctaText", type: "localeString", title: "CTA 버튼 텍스트" },
    { name: "order", type: "number", title: "정렬 순서", initialValue: 100 },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  orderings: [
    {
      title: "정렬 순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.ko", subtitle: "category", media: "heroImage" },
  },
});
