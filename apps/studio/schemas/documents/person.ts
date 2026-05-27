import { defineType } from "sanity";

// §4.3.6 — CEO·강사진
export default defineType({
  name: "person",
  title: "인물 (CEO·강사진)",
  type: "document",
  fields: [
    { name: "name", type: "localeString", title: "이름" },
    { name: "nameEn", type: "string", title: "영문 이름" },
    { name: "title", type: "localeString", title: "직함" },
    {
      name: "role",
      type: "string",
      title: "구분",
      options: {
        list: ["대표", "수석 강사", "강사", "파트너 컨설턴트"],
        layout: "radio",
      },
    },
    {
      name: "axes",
      type: "array",
      title: "전문 축 (3 Axes)",
      description: "Appearance · Behavior · Communication 중 해당하는 축 (복수 선택 가능)",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Appearance (외모·호감)", value: "appearance" },
          { title: "Behavior (행동·기억)", value: "behavior" },
          { title: "Communication (커뮤니케이션·감동)", value: "communication" },
        ],
      },
    },
    {
      name: "image",
      type: "image",
      title: "사진",
      options: { hotspot: true },
    },
    {
      name: "imagePath",
      type: "string",
      title: "사진 경로 (정적 host)",
      description: "v1.3.16 — 정적 호스팅 경로. 예: /images/people/appearance/고현정.png. image 필드 비어있을 때 fallback.",
    },
    { name: "bio", type: "localeBlockContent", title: "약력" },
    {
      name: "credentials",
      type: "array",
      of: [{ type: "localeString" }],
      title: "주요 경력·자격",
    },
    {
      name: "isCeo",
      type: "boolean",
      title: "대표 표시",
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
    select: {
      title: "name.ko",
      subtitle: "title.ko",
      media: "image",
    },
  },
});
