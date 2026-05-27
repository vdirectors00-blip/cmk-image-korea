import { defineType } from "sanity";

// §4.3.5 — Image Lab 글
export default defineType({
  name: "labArticle",
  title: "Image Lab 글",
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
      name: "field",
      type: "string",
      title: "분야",
      options: {
        list: ["퍼스널컬러", "스타일", "골격", "헤어", "기타"],
        layout: "radio",
      },
    },
    {
      name: "coverImage",
      type: "image",
      title: "대표 이미지",
      options: { hotspot: true },
    },
    {
      name: "author",
      type: "reference",
      to: [{ type: "person" }],
      title: "저자",
    },
    { name: "excerpt", type: "localeText", title: "발췌" },
    { name: "body", type: "localeBlockContent", title: "본문" },
    { name: "publishedAt", type: "datetime", title: "발행일" },
  ],
  orderings: [
    {
      title: "최신순",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title.ko", subtitle: "field", media: "coverImage" },
  },
});
