import { defineType, defineArrayMember } from "sanity";

const blockArray = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "External link",
          fields: [
            { name: "href", type: "url", title: "URL" },
            {
              name: "blank",
              type: "boolean",
              title: "Open in new tab",
              initialValue: true,
            },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "image",
    options: { hotspot: true },
    fields: [
      { name: "alt", type: "string", title: "Alt text" },
      { name: "caption", type: "string", title: "Caption" },
    ],
  }),
];

// 1차 오픈은 KO only. 추후 다국어 확장 시 fields 에 en 추가.
export default defineType({
  name: "localeBlockContent",
  title: "Locale Block Content",
  type: "object",
  fields: [
    {
      name: "ko",
      title: "한국어",
      type: "array",
      of: blockArray,
      validation: (rule) => rule.required(),
    },
  ],
  options: { collapsible: true, collapsed: false },
});
