import { defineType } from "sanity";

// §4.3.10 — 간단한 텍스트 페이지 (개인정보처리방침 등) 전용
export default defineType({
  name: "page",
  title: "페이지",
  type: "document",
  fields: [
    { name: "title", type: "localeString", title: "제목" },
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
    {
      name: "effectiveDate",
      type: "date",
      title: "시행일",
      description: "약관·방침의 시행 일자 (예: 2026-06-01). 일반 페이지는 비워두세요.",
      options: { dateFormat: "YYYY-MM-DD" },
    },
    {
      name: "version",
      type: "string",
      title: "버전",
      description: "개정 버전 표기 (예: 1.0, 2025.01). 일반 페이지는 비워두세요.",
    },
    { name: "body", type: "localeBlockContent", title: "본문" },
    { name: "seo", type: "seo", title: "SEO" },
  ],
  preview: {
    select: { title: "title.ko", subtitle: "slug.current" },
  },
});
