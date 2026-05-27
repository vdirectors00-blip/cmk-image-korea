import { defineType } from "sanity";

// §4.3.1 — singleton
export default defineType({
  name: "siteSettings",
  title: "사이트 설정",
  type: "document",
  fields: [
    { name: "companyName", type: "localeString", title: "회사명" },
    { name: "tagline", type: "localeString", title: "태그라인" },
    { name: "phone", type: "string", title: "대표 전화" },
    { name: "email", type: "string", title: "대표 이메일" },
    { name: "address", type: "localeString", title: "주소" },
    { name: "kakaoChannel", type: "url", title: "카카오 채널 URL" },
    { name: "instagram", type: "url", title: "Instagram URL" },
    { name: "youtube", type: "url", title: "YouTube URL" },
    { name: "facebook", type: "url", title: "Facebook URL" },
    { name: "naverBlog", type: "url", title: "네이버 블로그 URL" },
    { name: "businessNo", type: "string", title: "사업자등록번호" },
    { name: "ceo", type: "string", title: "대표자명" },
    { name: "defaultOg", type: "image", title: "기본 OG 이미지" },
  ],
});
