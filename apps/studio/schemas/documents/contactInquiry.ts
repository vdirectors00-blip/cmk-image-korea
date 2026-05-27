import { defineType } from "sanity";

// §4.3.9 — Worker에서 폼 제출 시 자동 생성
// 운영진은 Studio에서 신규 문의 확인 (§9.2 운영 패턴 박스 참조)
export default defineType({
  name: "contactInquiry",
  title: "문의 내역 (자동)",
  type: "document",
  fields: [
    {
      name: "kind",
      type: "string",
      title: "종류",
      options: {
        list: [
          { title: "Personal", value: "personal" },
          { title: "Corporate", value: "corporate" },
          { title: "Academy", value: "academy" },
        ],
        layout: "radio",
      },
    },
    { name: "name", type: "string", title: "이름" },
    { name: "phone", type: "string", title: "연락처" },
    { name: "email", type: "string", title: "이메일" },
    { name: "company", type: "string", title: "회사명 (corporate)" },
    { name: "position", type: "string", title: "직책 (corporate)" },
    { name: "expectedCount", type: "number", title: "예상 인원 (corporate)" },
    { name: "topic", type: "text", title: "교육 주제 (corporate)" },
    { name: "schedule", type: "string", title: "희망 일정" },
    { name: "budgetRange", type: "string", title: "예산 범위" },
    { name: "interest", type: "string", title: "관심 영역 (personal)" },
    {
      name: "preferredCourse",
      type: "string",
      title: "희망 과정 (academy)",
    },
    { name: "message", type: "text", title: "추가 메모" },
    { name: "submittedAt", type: "datetime", title: "제출 시각" },
    {
      name: "status",
      type: "string",
      title: "상태",
      options: {
        list: [
          { title: "신규", value: "new" },
          { title: "응대 중", value: "contacted" },
          { title: "종료", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    },
    {
      name: "source",
      type: "string",
      title: "유입 경로 (color-quiz 등)",
    },
  ],
  orderings: [
    {
      title: "최근 제출순",
      name: "submittedDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "kind", description: "submittedAt" },
  },
});
