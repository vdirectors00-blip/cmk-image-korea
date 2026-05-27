import { defineType } from "sanity";

// §4.3.8 — 누적 수치
export default defineType({
  name: "stat",
  title: "누적 수치",
  type: "document",
  fields: [
    {
      name: "label",
      type: "localeString",
      title: "라벨 (예: 누적 교육 임직원 수)",
    },
    { name: "value", type: "number", title: "숫자값" },
    { name: "suffix", type: "string", title: "단위 (예: 명, 개사, 회)" },
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
    select: { title: "label.ko", subtitle: "value" },
  },
});
