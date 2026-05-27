import { defineType } from "sanity";

// §4.3.7 — 거래 기업 로고
// ⚠️ consentGiven: true 로고만 화면 노출 (쿼리 필터)
export default defineType({
  name: "clientLogo",
  title: "거래 기업 로고",
  type: "document",
  fields: [
    {
      name: "name",
      type: "string",
      title: "기업명",
      validation: (rule) => rule.required(),
    },
    { name: "logo", type: "image", title: "로고 (SVG 권장)" },
    {
      name: "industry",
      type: "string",
      title: "업종",
      options: {
        list: ["대기업", "금융", "공공·관공서", "글로벌", "스타트업", "학교", "기타"],
        layout: "radio",
      },
    },
    {
      name: "consentGiven",
      type: "boolean",
      title: "노출 동의 받음 (필수 체크)",
      description: "동의 받지 않은 로고는 사이트에 노출되지 않습니다.",
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
    select: { title: "name", media: "logo", subtitle: "industry" },
  },
});
