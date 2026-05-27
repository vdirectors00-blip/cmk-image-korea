import { defineType } from "sanity";

// §4.3.3 — Academy 강좌
// 임시값: tuition=0, schedule="일정 협의", certificate="외부 인증기관" (§13.3 #10 placeholder)
export default defineType({
  name: "academyCourse",
  title: "Academy 강좌",
  type: "document",
  fields: [
    { name: "title", type: "localeString", title: "과정명" },
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
      name: "level",
      type: "string",
      title: "레벨",
      options: {
        list: ["기초/입문", "심화", "실기", "강사양성"],
        layout: "radio",
      },
    },
    { name: "summary", type: "localeText", title: "요약" },
    { name: "curriculum", type: "localeBlockContent", title: "커리큘럼 상세" },
    { name: "duration", type: "string", title: "기간 (예: 8주)" },
    {
      name: "schedule",
      type: "string",
      title: "일정 (예: 매주 화 14:00–17:00)",
      initialValue: "일정 협의",
    },
    {
      name: "tuition",
      type: "number",
      title: "수강료 (원)",
      initialValue: 0,
    },
    {
      name: "tuitionNote",
      type: "localeString",
      title: "수강료 비고 (예: 부가세 포함)",
    },
    { name: "capacity", type: "number", title: "정원" },
    {
      name: "instructor",
      type: "reference",
      to: [{ type: "person" }],
      title: "강사",
    },
    {
      name: "certificate",
      type: "localeString",
      title: "자격증 발행기관 (외부 기관명)",
    },
    {
      name: "isOpen",
      type: "boolean",
      title: "현재 모집중",
      initialValue: false,
    },
    { name: "order", type: "number", title: "정렬", initialValue: 100 },
  ],
  orderings: [
    {
      title: "정렬 순서",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title.ko", subtitle: "level" },
  },
});
