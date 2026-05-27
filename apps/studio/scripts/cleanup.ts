/**
 * Sanity cleanup 스크립트 — v1.3.16 잔재 도큐먼트 일괄 삭제.
 * `sanity login` 우회 — 환경변수 SANITY_AUTH_TOKEN 직접 사용.
 * 실행: `npx sanity exec scripts/cleanup.ts` (apps/studio 디렉토리에서)
 *
 * 삭제 대상:
 *   - client-bai (감사원 — v1.3.16 사용자 결정에 따라 제거)
 *   - post-mnd-2024 / post-mk-2013 / post-ytn-2013 / post-channela-2016 (news-data.json 으로 통합)
 */

import {createClient} from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId || !dataset) {
  throw new Error("SANITY_STUDIO_PROJECT_ID / SANITY_STUDIO_DATASET 가 .env 에 없습니다.");
}
if (!token) {
  throw new Error("SANITY_AUTH_TOKEN 환경변수가 비어있습니다. PowerShell 에서 $env:SANITY_AUTH_TOKEN 설정 후 재실행.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const idsToDelete = [
  "client-bai",
  "post-mnd-2024",
  "post-mk-2013",
  "post-ytn-2013",
  "post-channela-2016",
];

(async () => {
  for (const id of idsToDelete) {
    try {
      await client.delete(id);
      console.log(`✓ deleted: ${id}`);
    } catch (e: any) {
      console.log(`- skip: ${id} (${e.statusCode === 404 ? "not found" : e.message})`);
    }
  }
  console.log("\nCleanup complete.");
})();
