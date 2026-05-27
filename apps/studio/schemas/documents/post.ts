import { defineType } from "sanity";

// §4.3.4 — CMK NEWS
export default defineType({
  name: "post",
  title: "CMK NEWS",
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
      name: "category",
      type: "string",
      title: "카테고리",
      options: {
        list: ["강의·미디어", "뉴스"],
        layout: "radio",
      },
    },
    {
      name: "coverImage",
      type: "image",
      title: "대표 이미지",
      options: { hotspot: true },
    },
    { name: "excerpt", type: "localeText", title: "발췌 (목록용)" },
    { name: "body", type: "localeBlockContent", title: "본문" },
    { name: "publishedAt", type: "datetime", title: "게시일" },
    { name: "externalUrl", type: "url", title: "외부 링크 (있다면)" },
    {
      name: "videoUrl",
      type: "string",
      title: "영상 경로 (mp4, 강의·미디어)",
      description: "예: /videos/media-001.mp4 — 페이지 안에서 native 재생",
    },
    {
      name: "bodyImages",
      type: "array",
      of: [{ type: "string" }],
      title: "본문 이미지 경로 배열 (뉴스)",
      description: "예: [\"/images/news/news-001-1.png\", \"/images/news/news-001-2.png\"] — 본문 위치에 순차 렌더링",
    },
    {
      name: "htmlBody",
      type: "text",
      title: "본문 HTML (뉴스)",
      description: "cmk 기존 사이트의 뉴스 본문 HTML. set:html 로 렌더링. body 또는 bodyImages 와 함께 표시 가능.",
    },
    {
      name: "isPinned",
      type: "boolean",
      title: "공지 (상단 고정)",
      description: "기존 cmk 홈페이지의 '+' 별표 게시물. 게시일과 무관하게 목록 상단 고정.",
      initialValue: false,
    },
  ],
  orderings: [
    {
      title: "최신순",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.ko",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
