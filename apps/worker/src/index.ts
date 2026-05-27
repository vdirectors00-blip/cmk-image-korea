// CMK Image Korea — Contact Inquiry Worker
// 핸드오프 §9.2 기준 — honeypot + Turnstile + 폼 체류 시간 + KV 레이트리밋 + Resend 격리

import { createClient } from "@sanity/client";

interface Env {
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_TOKEN: string;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  NOTIFY_EMAIL: string;
  /** 쉼표 분리 화이트리스트 (예: "http://localhost:4321,https://cmk-staging.pages.dev,https://cmkimage.co.kr") */
  CORS_ORIGIN: string;
  TURNSTILE_SECRET: string;
  RATE_LIMIT_KV: KVNamespace;
}

// 요청의 Origin 헤더가 화이트리스트에 있으면 그걸 반환, 없으면 첫 번째 (서버 default).
// "*" 단일 entry 도 지원 (개발용 권장 X).
function resolveAllowedOrigin(req: Request, env: Env): string {
  const allowed = env.CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  const reqOrigin = req.headers.get("origin") || "";
  if (allowed.includes("*")) return "*";
  if (allowed.includes(reqOrigin)) return reqOrigin;
  return allowed[0] || "";
}

const MIN_FORM_AGE_MS = 3_000; // 3초 이내 제출은 봇으로 간주
const RATE_LIMIT_MAX = 10;      // 1시간 내 같은 (IP, UA) 조합 10회 — 회사 NAT IP 고려
const RATE_LIMIT_TTL = 60 * 60; // 1시간

// FNV-1a 32bit 해시 — UA 문자열을 짧은 키로
function hashStr(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

function corsHeaders(req: Request, env: Env): HeadersInit {
  return {
    "Access-Control-Allow-Origin": resolveAllowedOrigin(req, env),
    "Vary": "Origin", // 캐시가 origin 별로 분리되도록
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function renderEmail(kind: string, fields: Record<string, unknown>): string {
  const escape = (s: unknown) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const rows = Object.entries(fields)
    .filter(([k]) => !["agree", "website", "turnstileToken", "formLoadedAt"].includes(k))
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;"><b>${escape(k)}</b></td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${escape(v)}</td></tr>`
    )
    .join("");

  return `
    <h2 style="font-family:sans-serif;">새 ${escape(kind)} 문의가 접수되었습니다.</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">${rows}</table>
    <p style="font-family:sans-serif;font-size:12px;color:#888;margin-top:24px;">
      Sanity Studio 에서 확인: <a href="https://www.sanity.io/manage">관리</a>
    </p>
  `;
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(req, env) });
    }

    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const url = new URL(req.url);
    if (url.pathname !== "/api/inquiry") {
      return new Response("Not Found", { status: 404 });
    }

    try {
      const body = (await req.json()) as Record<string, unknown>;
      const { kind, website, turnstileToken, formLoadedAt, ...fields } = body;

      // ─── 보안 검증 ────────────────────────────────────────

      // 1) Honeypot — 채워져 있으면 조용히 200 (어그로 차단)
      if (typeof website === "string" && website.trim() !== "") {
        return Response.json({ ok: true }, { headers: corsHeaders(req, env) });
      }

      // 2) 폼 체류 시간 — 너무 빠른 제출은 봇
      const loadedAt = Number(formLoadedAt);
      if (!loadedAt || Date.now() - loadedAt < MIN_FORM_AGE_MS) {
        return Response.json({ ok: true }, { headers: corsHeaders(req, env) });
      }

      // 3) Turnstile 검증
      const ip = req.headers.get("cf-connecting-ip") || "unknown";
      const tsVerify = (await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: env.TURNSTILE_SECRET,
            response: turnstileToken,
            remoteip: ip,
          }),
        }
      ).then((r) => r.json())) as { success: boolean };

      if (!tsVerify.success) {
        return Response.json(
          { ok: false, error: "verification_failed" },
          { status: 400, headers: corsHeaders(req, env) }
        );
      }

      // 4) (IP, UA) 조합 rate limit
      const ua = req.headers.get("user-agent") || "unknown";
      const rlKey = `rl:${ip}:${hashStr(ua)}`;
      const current = Number((await env.RATE_LIMIT_KV.get(rlKey)) ?? 0);
      if (current >= RATE_LIMIT_MAX) {
        return Response.json(
          { ok: false, error: "rate_limited" },
          { status: 429, headers: corsHeaders(req, env) }
        );
      }
      await env.RATE_LIMIT_KV.put(rlKey, String(current + 1), {
        expirationTtl: RATE_LIMIT_TTL,
      });

      // ─── 본 처리 ──────────────────────────────────────────

      // 5) Sanity 저장
      const client = createClient({
        projectId: env.SANITY_PROJECT_ID,
        dataset: env.SANITY_DATASET,
        token: env.SANITY_TOKEN,
        useCdn: false,
        apiVersion: "2024-01-01",
      });

      const doc = await client.create({
        _type: "contactInquiry",
        kind: String(kind),
        ...fields,
        submittedAt: new Date().toISOString(),
        status: "new",
      });

      // 6) Resend 이메일 발송 — ctx.waitUntil 로 background 처리
      //    Sanity 저장 즉시 200 응답 → 클라이언트 대기 시간 최소화.
      //    Resend 가 늦거나 실패해도 응답에 영향 없음. (운영 패턴 §9.2 — Studio 1일 1회 확인 필수)
      //    AbortController 로 10 초 timeout 도 추가.
      const resendPromise = (async () => {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 10_000);
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: env.RESEND_FROM,
              to: env.NOTIFY_EMAIL,
              subject: `[${String(kind).toUpperCase()}] 새 문의 — ${fields.name || fields.company || ""}`,
              html: renderEmail(String(kind), fields),
            }),
            signal: ctrl.signal,
          });
          if (!res.ok) {
            const body = await res.text().catch(() => "");
            console.error("resend_http_error", { inquiryId: doc._id, status: res.status, body });
          }
        } catch (mailErr) {
          console.error("resend_failed", { inquiryId: doc._id, err: String(mailErr) });
        } finally {
          clearTimeout(timeout);
        }
      })();

      ctx.waitUntil(resendPromise);

      return Response.json(
        { ok: true, id: doc._id },
        { headers: corsHeaders(req, env) }
      );
    } catch (err) {
      console.error("inquiry_error", err);
      return Response.json(
        { ok: false, error: String(err) },
        { status: 500, headers: corsHeaders(req, env) }
      );
    }
  },
};
