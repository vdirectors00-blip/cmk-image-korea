import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

// siteSettings는 싱글톤 (1개 document만 존재)
// 메뉴는 documentId 고정으로 단일화되지만, 우회 차단을 위해
// document.actions / newDocumentOptions 에서 강제.
const SINGLETON_TYPES = new Set(["siteSettings"]);
const SINGLETON_DISABLED_ACTIONS = new Set(["delete", "duplicate", "unpublish"]);

export default defineConfig({
  name: "default",
  title: "CMK Image Korea",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "PLACEHOLDER_PROJECT_ID",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  document: {
    // 싱글톤 type 에 대해 delete / duplicate / unpublish 액션 차단
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => !SINGLETON_DISABLED_ACTIONS.has(action ?? ""))
        : prev,
    // "Create new" 글로벌 메뉴에서 싱글톤 type 의 새 문서 생성 옵션 숨김
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((tpl) => !SINGLETON_TYPES.has(tpl.templateId))
        : prev,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .id("siteSettings")
              .title("사이트 설정")
              .child(
                S.document().schemaType("siteSettings").documentId("siteSettings")
              ),
            S.divider(),
            S.documentTypeListItem("page").title("페이지"),
            S.documentTypeListItem("service").title("컨설팅 영역"),
            S.documentTypeListItem("academyCourse").title("Academy 강좌"),
            S.documentTypeListItem("post").title("CMK NEWS"),
            S.documentTypeListItem("labArticle").title("Image Lab 글"),
            S.documentTypeListItem("person").title("인물 (CEO·강사진)"),
            S.documentTypeListItem("clientLogo").title("거래 기업 로고"),
            S.documentTypeListItem("stat").title("누적 수치"),
            S.divider(),
            S.documentTypeListItem("contactInquiry").title("문의 내역 (자동)"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
