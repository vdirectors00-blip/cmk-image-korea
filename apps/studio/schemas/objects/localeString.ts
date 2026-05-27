import { defineType } from "sanity";

// §4.2 — i18n 단일 패턴. 1차 오픈은 KO only.
// 데이터 모양: { ko: string }. GROQ 접근: title.ko
// 추후 다국어 확장 시 fields 에 `{ name: "en", type: "string" }` 1줄 추가로 끝.
export default defineType({
  name: "localeString",
  title: "Locale String",
  type: "object",
  fields: [
    {
      name: "ko",
      title: "한국어",
      type: "string",
      validation: (rule) => rule.required(),
    },
  ],
  options: { collapsible: true, collapsed: false },
});
