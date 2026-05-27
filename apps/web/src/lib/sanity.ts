import { createClient } from "@sanity/client";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error(
    "PUBLIC_SANITY_PROJECT_ID is not set in apps/web/.env"
  );
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // 빌드 타임 fetch이므로 CDN OK
  // token: import.meta.env.SANITY_TOKEN, // public dataset은 토큰 불필요
});
