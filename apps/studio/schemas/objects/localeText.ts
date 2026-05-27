import { defineType } from "sanity";

// 1차 오픈은 KO only. 추후 다국어 확장 시 fields 에 en 추가.
export default defineType({
  name: "localeText",
  title: "Locale Text",
  type: "object",
  fields: [
    {
      name: "ko",
      title: "한국어",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    },
  ],
  options: { collapsible: true, collapsed: false },
});
